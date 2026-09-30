const tickets = [
  { id: 1, title: "Projector will not turn on", status: "Investigating" },
  { id: 2, title: "Wi-Fi keeps dropping in Lab 2", status: "Queued" },
  { id: 3, title: "The classroom microphone sounds like a robot", status: "Resolved" },
  { id: 4, title: "The printer has entered its villain arc", status: "Investigating" },
];

export function listTickets() {
  return tickets;
}

export function createTicket(title) {
  const ticket = {
    id: tickets.length + 1,
    title,
    status: "Queued",
  };
  tickets.unshift(ticket);
  return ticket;
}
