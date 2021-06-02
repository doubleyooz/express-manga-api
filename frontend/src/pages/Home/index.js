import React from 'react';
import api from "../../services/api"

import './styles.css';

export default function Home(){

    async function componentDidMount(){
        let config = {
            
            auth: {
                username: "itachiut1r4@gmail.com",
                password: "Lucarneiro@0009"
            }
            
        }

       

        api.get('sign-in', config).then(response =>{
            console.log(response.data)
            console.log("login well succeed")
        }).catch(err=>{
            console.log(err)
            console.log("login failed")
        })
    }
    componentDidMount()


    return(
        <>  
            <div className="home-container">
                <h1>HOME</h1>
            </div>
            
        </>
    )
}