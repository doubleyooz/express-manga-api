import React, {useState, useEffect, useContext, useRef} from 'react';
import { Link, useParams } from 'react-router-dom';
import './styles.css';


import { Context } from '../../Contexts/AuthProvider'
import api from "../../services/api"


require('dotenv').config()

const Reader = (props) =>{
   
    const { token, handleLogin } = useContext(Context)
    
    const [chapter, setChapter] = useState({pages: []})
    const [info, setInfo] = useState("")
    const [currentPage, setCurrentPage] = useState(0)
    const [loading, setLoading] = useState(true)

    const {manga_title, chapter_id} = useParams()

    let config = {
        headers: {
            'Authorization': `Bearer ${token}`
          }
    }


    useEffect(()=>{

        async function setStates(data){
            setChapter({ pages: data.imgCollection })
            setInfo({
                title: data.title,
                number: data.number
            })
        } 


        async function fetchData(){
            console.log(token)             
            props.location.state.chapter ? setStates(props.location.state.chapter) :
            api.get(`chapter/index?chapter_id=${chapter_id}`, config)
                .then(chapter => {
                    console.log("call api")
                    //setChapter({ feed: chapter.data });  
                    if(chapter.data !== null){                        
                       
                                             
                        setStates(chapter.data)

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
            
    }, [loading]) // <-- empty dependency array

  
    
    
    function nextPage(){           
        if (currentPage === chapter.pages.length - 1){
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
    
    console.log(manga_title)
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
                        <button className='button'>◄◄</button>
                        <div className="chapters"> Chapter #0{info.number} </div>
                        <button className='button'>►►</button>
                   
                   
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
                {chapter.pages.map((page, index) => (                   
                    //<img src= {`http://localhost:3333/files/${post.image}`} alt= "post"/>
                    < img src={process.env.REACT_APP_SERVER + page.filename}
                      alt= {page.originalname}
                      style={index === currentPage ? {}  : {display: "none"}}
                      onClick={() => nextPage()}                     
                    />
                ))}

            </div>


        </div>
      
        
    </>
}

export default Reader