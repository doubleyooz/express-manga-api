import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:3333',
});

var token = null

export function getToken(new_token){
    if(new_token){
        token = new_token
        return new_token
    }
    return token    
}


export default api;