import { Publisher, TicketCreatedEvent, Subjects } from "@tixguru/common";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
    readonly subject = Subjects.TicketCreated;
}