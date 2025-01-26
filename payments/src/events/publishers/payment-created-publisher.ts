import { Publisher, PaymentCreatedEvent, Subjects } from "@tixguru/common";

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
    readonly subject = Subjects.PaymentCreated;
}