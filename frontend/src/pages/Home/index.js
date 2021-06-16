import React, { useState, useEffect, useContext } from 'react';
import './styles.css';
import { Link } from 'react-router-dom';

import api from "../../services/api"

import { Context } from '../../Contexts/AuthProvider'

export default function Home(){
    const { token, loading, handleLogin } = useContext(Context)

    const [text, setText] = useState("");  
    const [mangas, setMangas] = useState([]);
   

    let config = {
        headers: {
            'Authorization': `Bearer ${token}`
          }
    }


    useEffect(()=>{
      
        async function fetchData(){
            handleLogin()
            if(!loading){
                //console.log(token)
                if(token !== ""){
                    setText(`login well succeed: ${token}`)
                } else{
                    setText("login failed")
                }  
                
                api.get('manga/index', config)
                .then(response => {
                    //setState({ feed: response.data });  
                    if(response.data !== null){
                       
                        setMangas(response.data.data)
                        console.log("list mangas well succeed")
                       
                       
                        
                    } else {
                        console.log("list mangas failed")
                        return null
                    }           
            
                }).catch(err =>{
                    console.log(err)
                    console.log("list mangas failed")
                    return null
                })        
            }      
            
            
        }        
        fetchData()     
            
    }, []) // <-- empty dependency array

    console.log(mangas)


    return(
        <>  
            <div className="home-container">
                <h1>{text}</h1>

                <div className='list'>
                         
                    {mangas.length !== 0 ? mangas.map((manga) => (  
                                      
                        <Link to={{ pathname: `/Manga/${manga.title}`, state: manga }}>                    
                            {manga.title}
                        
                        </Link>
                    )): <div>no manga to be shown</div>}

                </div>
               
            </div>
            
        </>
    )
}