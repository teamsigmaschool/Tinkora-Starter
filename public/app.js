const form = document.querySelector("#ticket-form");
const titleInput = document.querySelector("#title");
const message = document.querySelector("#message");
const ticketList = document.querySelector("#ticket-list");
const refreshButton = document.querySelector("#refresh");

function ticketItem(ticket) {
  return `
    <li>
      <span>${ticket.name}</span>
      <strong>${ticket.status}</strong>
    </li>
  `;
}

async function loadTickets() {
  const response = await fetch("/api/tickets");
  const tickets = await response.json();
  ticketList.innerHTML = tickets.map(ticketItem).join("");
}

async function submitTicket(event) {
  event.preventDefault();
  message.textContent = "";

  const response = await fetch("/api/tickets", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ problem: titleInput.value }),
  });
  const result = await response.json();

  if (!response.ok) {
    message.textContent = result.error;
    return;
  }

  titleInput.value = "";
  message.textContent = "Report sent. Nice one!";
  await loadTickets();
}

form.addEventListener("submit", submitTicket);
loadTickets();
