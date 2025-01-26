import { Publisher, OrderCancelledEvent, Subjects } from "@tixguru/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
    readonly subject = Subjects.OrderCancelled;
}