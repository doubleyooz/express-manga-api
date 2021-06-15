import React, {useState, useEffect, useContext} from 'react';
import { Link, useParams } from 'react-router-dom';

import './styles.css';

import { Context } from '../../Contexts/AuthProvider'
import api from "../../services/api"

require('dotenv').config()

const Manga = (props) =>{

   
    const { token, loading, handleLogin } = useContext(Context)
    
    
    const [chapters, setChapters] = useState([])    
    const [manga, setManga] = useState({}) 
    
    const {manga_title} = useParams()

    let config = {
        headers: {
            'Authorization': `Bearer ${token}`
          }
    }

    
    useEffect(()=>{        
        async function selectedManga(){
            console.log("selectedManga")
            api.get(`manga/list/title=${manga_title}`, config)
            .then(response => {
                //setState({ feed: response.data });  
                if(response.data !== null){
                    console.log(response)
                    console.log(response.data);
                    
                   
                   
                    setManga(response.data.data[0])
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
             api.get(`chapter/index?manga_id=${manga.title}`, config)
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
        selectedManga()
        fetchData()
             
            
    }, []) // <-- empty dependency array

  
    return <>   
        <div className="manga-page">
            <div className="header-board">


                    <div className="title">
                        manga_title
                    </div>


            </div>
            <div className="list">

                {chapters.length !== 0 ? chapters.map((chapter, index) => (                   
                    <Link to={{ pathname: `/Manga/${manga_title}/${chapter._id}`, state: {chapter}}}>                    
                        <h2>{chapter.title}</h2>
                        Chapter {chapter.number}
                        <h4>Scan_name</h4>

                    
                    </Link>
                )): <div>No chapters to display</div>}


            </div>

        </div>
      
        

    </>
}

export default Manga