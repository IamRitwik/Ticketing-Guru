import { Message } from 'node-nats-streaming';
import { Subjects, Listener, OrderCreatedEvent } from '@tixguru/common';
import { queueGroupName } from './queue-group-name';
import { Order } from '../../models/order';

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
    readonly subject = Subjects.OrderCreated;
    queueGroupName = queueGroupName;
    
    async onMessage(data: OrderCreatedEvent['data'], msg: Message): Promise<void> {
        
        const order = Order.build({
            id: data.id,
            version: data.version,
            userId: data.userId,
            status: data.status,
            price: data.ticket.price
        });
        await order.save();
        //Ack the message
        msg.ack();

    }
    
}