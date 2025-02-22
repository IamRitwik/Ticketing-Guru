import { Message } from 'node-nats-streaming';
import { Subjects, Listener, TicketCreatedEvent } from '@tixguru/common';
import { Ticket } from '../../models/ticket';
import { queueGroupName } from './queue-group-name';

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
    readonly subject = Subjects.TicketCreated;
    queueGroupName = queueGroupName;
    
    async onMessage(data: TicketCreatedEvent['data'], msg: Message): Promise<void> {
        const { id, title, price } = data;
        const ticket = Ticket.build({
            id,
            title,
            price
        });
        await ticket.save();

        msg.ack();

    }
    
}