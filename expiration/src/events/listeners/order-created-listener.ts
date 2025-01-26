import { Message } from 'node-nats-streaming';
import { Subjects, Listener, OrderCreatedEvent } from '@tixguru/common';
import { queueGroupName } from './queue-group-name';
import { expirationQueue } from '../../queues/expiration-queue';

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
    readonly subject = Subjects.OrderCreated;
    queueGroupName = queueGroupName;
    
    async onMessage(data: OrderCreatedEvent['data'], msg: Message): Promise<void> {
        const delay = new Date(data.expiresAt).getTime() - new Date().getTime();
        console.log("Delay = " + delay);
        //Add to expiration queue
        await expirationQueue.add({
            orderId: data.id
        },{
            delay: delay
        });

        //Ack the message
        msg.ack();
    }
    
}