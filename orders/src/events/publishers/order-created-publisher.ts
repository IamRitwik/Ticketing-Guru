import { Publisher, OrderCreatedEvent, Subjects } from "@tixguru/common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
    readonly subject = Subjects.OrderCreated;
}