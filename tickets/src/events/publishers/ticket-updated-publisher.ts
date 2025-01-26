import { Publisher, TicketUpdatedEvent, Subjects } from "@tixguru/common";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
    readonly subject = Subjects.TicketUpdated;
}