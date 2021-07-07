import React, {useState, useEffect, useContext, useRef} from 'react';
import { Link, useParams } from 'react-router-dom';
import './styles.scss';


import { Context } from '../../Contexts/AuthProvider'
import api from "../../services/api"


require('dotenv').config()

const Reader = (props) =>{
   
    const { token, handleLogin } = useContext(Context)
    
    const {manga_title, chapter_number} = useParams()

    const [chapter, setChapter] = useState({ imgCollection: [] })
    const [manga, setManga] = useState({ chapters: []})

    const [currentPage, setCurrentPage] = useState(0)
    const [currentChapter, setCurrentChapter] = useState(chapter_number - 1)

    

    let config = {
        headers: {
            'Authorization': `Bearer ${token}`
          }
    }
    const notInitialRender = useRef(false)
    useEffect(()=>{

        
        async function usingProps(){
            console.log("using props")
            setChapter( props.location.state.chapter )
            
            setManga({
                chapters: props.location.state.chapters,
                
            })
            setCurrentChapter(chapter_number - 1)
        
           
        }

        async function usingApi(){
            console.log("using api")
            

            api.get(`manga/index?title=${manga_title}`, config)
            .then(result => {                    
                                    
                if(result.data !== null){                        
                   
                    console.log(result.data.data[0])         
                    setManga(result.data.data[0])
                    
                    console.log("chapter list successfuly retrieved")
                    
                    api.get(`chapter/index?chapter_id=${result.data.data[0].chapters[currentChapter]}`, config)
                    .then(chapter => {
                    
                        console.log(chapter.data.data)
                        if(chapter.data !== null){
                            setChapter(chapter.data.data)
                            setCurrentChapter(chapter.data.data.number - 1)
                            console.log("list pages well succeed")
                        } else {
                            console.log("list pages failed")
                        }

                    }).catch(err =>{
                        console.log(err)
                        console.log("list pages failed")
                        
                    })    
                                                                   
                } else {
                    console.log("chapter list retrieve failed")
                    
                }           
        
            }).catch(err =>{
                console.log(err)
                console.log("chapter list retrieve failed")
                
            })        
        }

        async function fetchData(){         

            notInitialRender ? usingApi() : props.location.state ? usingProps() : usingApi()   
                
            
        }        
        fetchData()     
            
    }, [currentChapter]) // <-- empty dependency array

    function nextChapter(){
        if (currentChapter === manga.chapters.length - 1){
            console.log("last chapter reached")
        } else{
            notInitialRender.current = true
            setCurrentChapter(currentChapter+1)
            setCurrentPage(0)            
        }    
    }

    function prevChapter(){    
        if(currentChapter === 0){
            console.log("first chapter reached")
        } else{           
            notInitialRender.current = true
            setCurrentChapter(currentChapter-1)
            setCurrentPage(0)
        }             
    }

    function nextPage(){           
        if (currentPage === chapter.imgCollection.length - 1){
            console.log("last page reached")
        } else{            
            setCurrentPage(currentPage+1)

        }               
    }

    function prevPage(){    
        if(currentPage === 0){
            console.log("first page reached")
        } else{           
            setCurrentPage(currentPage-1)
        }             
    }
    
    function useKey(key, cb){
        const callbackRef = useRef(cb)

        useEffect(() => {
            callbackRef.current = cb;
        })

        useEffect(() => {
            function handle(event){
                if(event.code === key){
                    callbackRef.current(event)
                }
            }
            document.addEventListener("keydown", handle);
            return () => document.removeEventListener("keydown", handle)

        }, [key]);
  
    }
    
    
    useKey("ArrowRight", () => nextPage())
    useKey("ArrowLeft", () => prevPage())
    return <>   
        <div className="reader">
            <div className="header-board">

                    <div className="title">
                        <Link to={{ pathname: `/Manga/${manga_title.replace(" ", "%20")}`}}>                    
                            <h2>{manga_title}</h2>
                        
                        </Link>
                    </div>

                    <div className="controllers">
                        <Link to={{ pathname: `/Manga/${manga_title}/${currentChapter-2 <= 0 ? 1 : currentChapter-2}`}}>                    
                            <button className='button' onClick= {() => prevChapter()}>◄◄</button>
                        
                        </Link>
                        
                        <div className="chapters"> Chapter #0{chapter_number} </div>
                        <Link to={{ pathname: `/Manga/${manga_title}/${currentChapter+2 >= manga.chapters.length ? manga.chapters.length : currentChapter + 2}`}}>                    
                            <button className='button'onClick= {() => nextChapter()}>►►</button>
                        
                        </Link>
                        
                   
                   
                    </div>
                    <div className="controllers">
                        <button className='button' onClick= {() => prevPage()}>prev</button>
                        <div className="pages-list"></div>
                        <div className="version"></div>
                        <div className="viewToggle"></div>
                        <button className='button' onClick={() => nextPage()}>next</button>
                   
                   
                    </div>
            </div>


            <div className='board'>       
                {chapter ? chapter.imgCollection.map((page, index) => (                   
                    //<img src= {`http://localhost:3333/files/${post.image}`} alt= "post"/>
                    < img src={process.env.REACT_APP_SERVER + manga_title + "/" + chapter.number + "/" + page.filename}
                      alt= {page.originalname}
                      style={index === currentPage ? {}  : {display: "none"}}
                      onClick={() => nextPage()}                     
                    />
                )): <div>no data</div>}

            </div>


        </div>
      
        
    </>
}

export default Reader