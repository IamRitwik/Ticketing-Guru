import { Publisher, ExpirationCompleteEvent, Subjects } from "@tixguru/common";

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
    readonly subject = Subjects.ExpirationComplete;
}