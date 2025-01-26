import { useEffect, useState } from 'react';
import useRequest from "../../hooks/use-request";
import Router from 'next/router';
import StripeCheckout from 'react-stripe-checkout';

const OrderShow = ({order, currentUser}) => {
    const [timeLeft, setTimeLeft] = useState(0);

    const { doRequest, errors } = useRequest({
        url: '/api/payments',
        method: 'post',
        body: {
            orderId: order.id,
            token: 'cXdlcnR5QDEyMw=='
        },
        onSuccess: (payment) => Router.push('/orders')
    });

    useEffect(() => {
        const findTimeLeft = () => {
            const msLeft = new Date(order.expiresAt) - new Date();
            setTimeLeft(Math.round(msLeft / 1000));
        };
        findTimeLeft();
        const timerId = setInterval(findTimeLeft, 1000);

        return () => {
            clearInterval(timerId)
        };
    }, [order]);

    if(timeLeft < 0) {
        return <div>Oops! Order has been expired</div>
    }

    return (
        <div>
            Time left for payment : {timeLeft} seconds
            {/* <StripeCheckout
                token={(token) => console.log(token)}
                stripeKey='cXdlcnR5QDEyMw=='
                amount={order.ticket.price * 100}
                email={currentUser.email}
             /> */}
             <button onClick={doRequest} className="btn btn-primary">Confirm</button>
        </div>
    )
}

OrderShow.getInitialProps = async (context, client, currentUser) => {
    const {orderId} = context.query;
    const {data} = await client.get(`/api/orders/${orderId}`);

    return {order: data};
}

export default OrderShow;