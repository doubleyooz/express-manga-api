import React, {useState, useEffect, useContext, useRef} from 'react';

import './styles.css';


import { Context } from '../../Contexts/AuthProvider'
import api from "../../services/api"

require('dotenv').config()

const Reader = (props) =>{
   
    const { token, loading, handleLogin } = useContext(Context)
    
    const [chapter, setChapter] = useState({pages: []})
    const [info, setInfo] = useState("")
    const [currentPage, setCurrentPage] = useState(0)
        

    let config = {
        headers: {
            'Authorization': `Bearer ${token}`
          }
    }


    useEffect(()=>{
        async function fetchData(){
            console.log(token)             
            api.get('chapter/index?manga_id=60c3ff94f527df2248dcbff4&number=1', config)
                .then(response => {
                    //setChapter({ feed: response.data });  
                    if(response.data !== null){
                        console.log(response)
                        console.log(response.data);
                        console.log(response.data.data)
                       
                        setChapter({ pages: response.data.data[0].imgCollection })
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

    useKey("ArrowRight", () => nextPage())
    useKey("ArrowLeft", () => prevPage())
    console.log(props)
    return <>   
        <div className="reader">
            <div className="header-board">

                    <div className="title">
                        {props.location.state ? props.location.state.manga_title : "no_title"}
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