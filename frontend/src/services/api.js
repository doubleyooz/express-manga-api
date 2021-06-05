import axios from 'axios';

var token = null

module.exports = {
    get_instance(){
        return axios.create({
            baseURL: 'http://localhost:3333',
        });
    },

    get_token(new_token){
        if(new_token){
            token = new_token
            return new_token
        }
        return token    
        
    }

}


