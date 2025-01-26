import { Message } from 'node-nats-streaming';
import { Subjects, Listener, OrderCancelledEvent } from '@tixguru/common';
import { Ticket } from '../../models/tickets'; 
import { queueGroupName } from './queue-group-name';
import { TicketUpdatedPublisher } from '../publishers/ticket-updated-publisher';


export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
    readonly subject = Subjects.OrderCancelled;
    queueGroupName = queueGroupName;
    
    async onMessage(data: OrderCancelledEvent['data'], msg: Message): Promise<void> {
        //Find the ticket that order is cancelling
        const ticket = await Ticket.findById(data.ticket.id);

        //If no ticket, throw error
        if(!ticket){
            throw new Error('Ticket not found!');
        }

        //Mark the ticket reserved by setiing orderId
        ticket.set({orderId: undefined});

        //Save the ticket
        await ticket.save();
        
        new TicketUpdatedPublisher(this.client).publish({
            id: ticket.id,
            version: ticket.version,
            title: ticket.title,
            price: ticket.price,
            userId: ticket.userId
        });

        //Ack the message
        msg.ack();

    }
    
}