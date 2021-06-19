import React, {useState, useEffect, useContext} from 'react';
import { Link, useParams } from 'react-router-dom';

import './styles.css';

import { Context } from '../../Contexts/AuthProvider'
import api from "../../services/api"

require('dotenv').config()

const Manga = (props) =>{

   
    const { token, handleLogin } = useContext(Context)
    
    
    const [chapters, setChapters] = useState([])    
    const [manga, setManga] = useState({})
    const [loading, setLoading] = useState(true)

    const {manga_title} = useParams()

    let config = {
        headers: {
            'Authorization': `Bearer ${token}`
          }
    }

    
    useEffect(()=>{
     
        async function getMangaData(){
            console.log(manga_title)    
            console.log(token)                   
            api.get(`manga/index?title=${manga_title}`, config)
            .then(response => {
                //setState({ feed: response.data });  
                if(response.data !== null){
                   
                    console.log(response.data);                  
                    setManga(response.data.data[0])
                    console.log(manga)
                    console.log("get manga info well succeed")

                    api.get(`chapter/index?manga_id=${manga._id}`, config)
                    .then(response => {
                        //setState({ feed: response.data });  
                        if(response.data !== null){
                            console.log(response)
                            console.log(response.data);
                            console.log(response.data.data)
                           
                            
                            setChapters(response.data.data)
                            console.log("list chapters well succeed")
                            setLoading(false)
                           
                            
                        } else {
                            console.log("list chapters failed")
                            setLoading(false)
                        }           
                
                    }).catch(err =>{
                        console.log(err)
                        console.log("list chapters failed")
                        setLoading(false)
                    })        
                   
                    
                } else {
                    console.log("get manga info failed")
                    setLoading(false)
                }           
        
            }).catch(err =>{
                console.log(err)
                console.log("get manga info failed")
                setLoading(false)
            })        
        }        

        
        getMangaData()
        
        
        
             
            
    }, [loading]) // <-- empty dependency array

    console.log(manga_title)
    return <>   
        <div className="manga-page">
            <div className="header-board">


                    <div className="title">
                        {manga_title}
                    </div>


            </div>
            <div className="list">

                {!loading ? chapters.map((chapter, index) => (       
                    <div className="chapter">
                        <Link to={{ pathname: `/Manga/${manga_title.replace(" ", "%20")}/${chapter.number}`, 
                            state: {chapter: chapter, chapters: manga.chapters}}}>                    
                            <h2>{chapter.title}</h2>
                            Chapter {chapter.number}
                            
                        
                        </Link>
                        <h4>Scan_name</h4>
                    </div>            
                   
                    
                )): <div>No chapters to display</div>}


            </div>

        </div>
      
        

    </>
}

export default Manga