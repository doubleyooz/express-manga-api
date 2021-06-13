import React, {useState, useEffect, useContext} from 'react';

import './styles.css';


import { Context } from '../../Contexts/AuthProvider'
import api from "../../services/api"

require('dotenv').config()

export default function Manga(){

   
    const { token, loading, handleLogin } = useContext(Context)
    
    
    const [info, setInfo] = useState("")    
    
    

    let config = {
        headers: {
            'Authorization': `Bearer ${token}`
          }
    }

    let manga_id = "60c3ff94f527df2248dcbff4"
    useEffect(()=>{
        async function selectedManga(){
            api.get(`manga/list/manga_id=${manga_id}`, config)
            .then(response => {
                //setState({ feed: response.data });  
                if(response.data !== null){
                    console.log(response)
                    console.log(response.data);
                    
                   
                   
                    setInfo(response.data[0])
                    console.log("get manga info well succeed")
                   
                   
                    
                } else {
                    console.log("get manga info failed")
                    return null
                }           
        
            }).catch(err =>{
                console.log(err)
                console.log("get manga info failed")
                return null
            })        
        }        

        async function fetchData(){
            console.log(token)             
             api.get('chapter/index?manga_id=60c3ff94f527df2248dcbff4&number=1', config)
                .then(response => {
                    //setState({ feed: response.data });  
                    if(response.data !== null){
                        console.log(response)
                        console.log(response.data);
                        console.log(response.data.data)
                       
                     
                        setInfo({
                            title: response.data.data[0].title,
                            number: response.data.data[0].number
                        })
                        console.log("list chapters well succeed")
                       
                       
                        
                    } else {
                        console.log("list chapters failed")
                        return null
                    }           
            
                }).catch(err =>{
                    console.log(err)
                    console.log("list chapters failed")
                    return null
                })        
        }        
        fetchData()     
            
    }, []) // <-- empty dependency array

  
    return <>   
        <div className="reader">
            <div className="header-board">

                    <div className="title">
                        {info.title}
                    </div>


            </div>


        </div>
      
        

    </>
}