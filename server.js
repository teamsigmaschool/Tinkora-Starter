import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { extname, join, normalize } from "node:path";
import { createTicket, listTickets } from "./src/data/tickets.js";

const PORT = Number(process.env.PORT) || 3000;
const publicFolder = join(process.cwd(), "public");

const contentTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".png": "image/png",
};

async function readJson(request) {
  let body = "";
  for await (const chunk of request) body += chunk;
  return JSON.parse(body || "{}");
}

function sendJson(response, status, data) {
  response.writeHead(status, { "Content-Type": "application/json" });
  response.end(JSON.stringify(data));
}

async function handleApi(request, response) {
  if (request.method === "GET" && request.url === "/api/tickets") {
    return sendJson(response, 200, listTickets());
  }

  if (request.method === "POST" && request.url === "/api/tickets") {
    const input = await readJson(request);
    if (!input.title?.trim()) {
      return sendJson(response, 400, { error: "Describe the problem first." });
    }
    return sendJson(response, 201, createTicket(input.title));
  }

  return false;
}

async function handleStatic(request, response) {
  const requestedPath = request.url === "/" ? "/index.html" : request.url;
  const safePath = normalize(requestedPath).replace(/^(\.\.[/\\])+/, "");
  const filePath = join(publicFolder, safePath);
  try {
    const file = await readFile(filePath);
    response.writeHead(200, {
      "Content-Type": contentTypes[extname(filePath)] || "text/plain",
    });
    response.end(file);
  } catch {
    response.writeHead(404);
    response.end("Not found");
  }
}

const server = createServer(async (request, response) => {
  try {
    const handled = await handleApi(request, response);
    if (handled !== false) return;
    await handleStatic(request, response);
  } catch (error) {
    console.error(error);
    sendJson(response, 500, { error: "Something went wrong." });
  }
});

server.listen(PORT, () => {
  console.log(`Tinkora is ready at http://localhost:${PORT}`);
});
