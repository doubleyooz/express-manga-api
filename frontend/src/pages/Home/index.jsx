import React, { useState, useEffect, useContext, useRef } from 'react';
import { Link } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

import { Context } from '../../Contexts/AuthProvider'
import Manga from '../../Components/Activity'
import api from "../../services/api"

import arrowLeft from "../../assets/arrow-left.png"

import './styles.scss';


export default function Home(){
    const { token, setToken, handleLogin } = useContext(Context)

      
    const [mangas, setMangas] = useState([]);
    const [update, setUpdate] = useState(false)
    const [block, setBlock] = useState(0);
    //const [text, setText] = useState("")
    
    

    const feed = useRef()
    let config = {
        headers: {
            'Authorization': `Bearer ${token}`
          }
    }
 

    

    useEffect(()=>{
      
        async function fetchData(){
           
           
            api.get('manga/list?recent=true')
                .then(response => {
                   
                    //setState({ feed: response.data });  
                    if(response.data !== null){
                        
                      
                            
                        console.log(response.data.data)
                        
                        let temp = response.data.data.map(item => {
                           
                            return {uid: uuidv4(), ...item}
                        }) 

                        console.log(temp)
                           
                        setMangas([...mangas, ...temp])
                                                  
                       
                        
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
        fetchData()     
            
    }, [update]) // <-- empty dependency array

    
    return(
        <>  
            <div className="home-container">
                {/*token ? <div className="div">auth</div> : <div className="div">not auth</div>*/}
                
                

                <div className='last-updated'>
                    <div className="header">
                        <h2>Lastest Update</h2>
                        <div className="next">
                            <img src={arrowLeft} onClick={() => setUpdate(!update)}/>
                        </div>
                        
                        
                    </div>
                   
                    <div className="box" ref={feed}>
                    {mangas.length !== 0 ? mangas.map((manga) => (
                        
        
                        <div className="manga-container" key={manga.uid.toString()}>
                            <Manga data={manga}  />
                       
                        
                        </div>
                        
                       
                        
                        
                       
                                              
                        
                    )): <div>no manga to be shown</div>}
                    </div>
                    

                </div>
               
            </div>
            
        </>
    )
}