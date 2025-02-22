import { useState } from "react";
import useRequest from "../../hooks/use-request";
import Router from 'next/router';

const newTicket = () => {
    const [title, setTitle] = useState('');
    const [price, setPrice] = useState('');

    const onBlur = () => {
        const value = parseFloat(price);
        if(isNaN(value)) {
            return;
        }

        setPrice(value.toFixed(2));
    };

    const { doRequest, errors } = useRequest({
        url: '/api/tickets',
        method: 'post',
        body: {
            title, price
        },
        onSuccess: () => Router.push('/')
    });

    const onSubmit = async (event) => {
        event.preventDefault();
        
        await doRequest();
    }; 

    return (
        <div>
            <h1>Create a Ticket</h1>
            <form onSubmit={onSubmit}>
                <div className="form-group">
                    <label>Title </label>
                    <input value={title} onChange={e=>setTitle(e.target.value)}
                    className="form-control"></input>
                </div>
                <div className="form-group">
                    <label>Price </label>
                    <input onBlur={onBlur} value={price} onChange={e=>setPrice(e.target.value)}
                    className="form-control"></input>
                </div>
                {errors}
                <button className="btn btn-primary">Create</button>
            </form>
        </div>
    )
};

export default newTicket;