import axios from 'axios';

export default ({req}) => {
    if(typeof window === 'undefined'){
        console.log('Executing from server!');
        return axios.create({
            baseURL: 'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local',
            headers: req.headers
        });
    }else{
        console.log('Executing from browser!');
        return axios.create({
            baseURL: '/'
        });
    }
};