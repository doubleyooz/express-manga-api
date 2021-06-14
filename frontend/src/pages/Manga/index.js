import React, {useState, useEffect, useContext} from 'react';
import { Link } from 'react-router-dom';

import './styles.css';

import { Context } from '../../Contexts/AuthProvider'
import api from "../../services/api"

require('dotenv').config()

const Manga = (props) =>{

   
    const { token, loading, handleLogin } = useContext(Context)
    
    
    const [chapters, setChapters] = useState([])    
    const [manga, setManga] = useState({}) 
    

    let config = {
        headers: {
            'Authorization': `Bearer ${token}`
          }
    }

    let manga_id = "60c3ff94f527df2248dcbff4"
    useEffect(()=>{        
        async function selectedManga(){
            console.log("selectedManga")
            api.get(`manga/list/manga_id=${props.location.state._id}`, config)
            .then(response => {
                //setState({ feed: response.data });  
                if(response.data !== null){
                    console.log(response)
                    console.log(response.data);
                    
                   
                   
                    setManga(response.data)
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
             api.get(`chapter/index?manga_id=${props.location.state._id}&number=1`, config)
                .then(response => {
                    //setState({ feed: response.data });  
                    if(response.data !== null){
                        console.log(response)
                        console.log(response.data);
                        console.log(response.data.data)
                       
                     
                        setChapters(response.data.data)
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
        props.location.state ? fetchData() : selectedManga()
             
            
    }, []) // <-- empty dependency array

  
    return <>   
        <div className="reader">
            <div className="header-board">


                    <div className="title">
                        {props.location.state.title}
                    </div>


            </div>
            <div className="list">

                {chapters.length !== 0 ? chapters.map((chapter, index) => (                   
                    <Link to={{ pathname: "/Reader", state: {chapter: chapter, manga_title: props.location.state.title}}}>                    
                        <h2>{chapter.title}</h2>
                        Chapter {chapter.number}
                    
                    </Link>
                )): <div>No chapters to display</div>}


            </div>

        </div>
      
        

    </>
}

export default Manga