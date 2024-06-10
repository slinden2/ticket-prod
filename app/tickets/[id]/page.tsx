import React from "react";
import prisma from "@/prisma/db";
import TicketDetail from "./TicketDetail";

interface ViewTicketProps {
  params: { id: string };
}

const ViewTicket = async ({ params }: ViewTicketProps) => {
  const ticket = await prisma.ticket.findUnique({
    where: { id: parseInt(params.id) },
  });

  if (!ticket) {
    return <p className="text-destructive">Ticket not found!</p>;
  }

  return <TicketDetail ticket={ticket} />;
};

export default ViewTicket;
