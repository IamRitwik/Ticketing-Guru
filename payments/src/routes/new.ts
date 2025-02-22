import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { validateRequest, requireAuth, NotFoundError, OrderStatus, BadRequestError, NotAuthorizedError } from '@tixguru/common';
import mongoose from 'mongoose';
import { Order } from '../models/order';
import { natsWrapper } from '../nats-wrapper';
import { stripe } from '../stripe';
import { Payment } from '../models/payment';
import { PaymentCreatedPublisher } from '../events/publishers/payment-created-publisher';

const router = express.Router();

router.post('/api/payments', requireAuth, [
    body('token')
        .not()
        .isEmpty(),
    body('orderId')
        .not()
        .isEmpty()
], validateRequest, async (req: Request, res: Response) => {

    const {token, orderId} = req.body;

    console.log(orderId);
    
    const order = await Order.findById(orderId);

    if (!order) {
      throw new Error('Order not found');
    }

    if(order.userId !== req.currentUser!.id) {
        throw new NotAuthorizedError();
    }

    if(order.status === OrderStatus.Cancelled) {
        throw new BadRequestError('Cannot pay for cancelled order');
    }

    /*await stripe.charges.create({
        currency:'usd',
        amount: order.price * 100,
        source: token
    });*/

    const payment = Payment.build({
        orderId,
        stripeId: "cXdlcnR5QDEyMw=="
    });

    await payment.save();

    await new PaymentCreatedPublisher(natsWrapper.client).publish({
        id: payment.id,
        orderId: payment.orderId,
        stripeId: payment.stripeId
    });

    res.status(201).send({id: payment.id});
});

export {router as createChargeRouter};