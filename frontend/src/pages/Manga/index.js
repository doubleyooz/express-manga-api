import React, {useState, useEffect, useContext, useLayoutEffect,} from 'react';
import { Link, useParams } from 'react-router-dom';

import './styles.scss';

import { Context } from '../../Contexts/AuthProvider'
import api from "../../services/api"

require('dotenv').config()



const Manga = (props) =>{

   
    const { token, handleLogin } = useContext(Context)
    
    
    const [chapters, setChapters] = useState([])    
    const [manga, setManga] = useState({})
    const [isSelected, setIsSelected] = useState('b');
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



    function ResponsiveImage({width, height}) {

        return (
            
            
            <div className="responsive-image" >
                <div className="resizer" style={ {
                    paddingBottom: `${width / height * 100}%`
                    } } />
                <div 
                    className="image"               
                    style={{
                        backgroundImage: `url('${process.env.REACT_APP_SERVER + manga_title + "/" + manga.cover}')`,
                        backgroundPosition: 'center center',
                        
                    }}
                    alt={"cover"}/>
                <div className="content" style={{
                    width: `${width}px`
                }}/>
            </div>
        );
    }

    return <>   
        <div className="manga-board">
            <div className="card">
               
                <ResponsiveImage width="1200" height="800" />
                
               

            </div>
            <div className="content-container">
                <div className="toogler">
                    <button onClick={() => setIsSelected("a")}>info</button>
                    <button onClick={() => setIsSelected("b")}>chapters</button>
                    <button onClick={() => setIsSelected("c")}>art</button>
                </div>

                <div className="info" style={isSelected === "a" ? {display: 'block'} : {display: 'none'}}>
                    
                    <div className="title">
                        {manga_title}
                    </div>

                    <span>{manga.synopsis}</span>
                </div>

                <div className="list" style={isSelected === "b" ? {display: 'block'} : {display: 'none'}}>

                    {!loading ? chapters.length !== 0 ? chapters.map((chapter, index) => (       
                        <div className="chapter">
                            <Link to={{ pathname: `/Manga/${manga_title.replace(" ", "%20")}/${chapter.number}`, 
                                state: {chapter: chapter, chapters: manga.chapters}}}>                    
                                <h2>{chapter.title}</h2>
                                Chapter {chapter.number}
                                
                            
                            </Link>
                            <h4>Scan_name</h4>
                        </div>            
                    
                        
                    )): <div>No chapters to display</div>
                    : <div>Loading...</div>

                    }


                </div>

                <div className="art" style={isSelected === "c" ? {display: 'block'} : {display: 'none'}}>
                  Art
                </div>

            </div>
           
        </div>
      
        

    </>
}

export default Manga