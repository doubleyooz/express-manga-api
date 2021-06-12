import React, {useState, useEffect, useContext} from 'react';

import './styles.css';


import { Context } from '../../Contexts/AuthProvider'
import api from "../../services/api"



export default function Reader(){

   
    const { token, loading, handleLogin } = useContext(Context)
    
    const [state, setState] = useState({pages: []})
    const [info, setInfo] = useState("")
    const [currentPage, setCurrentPage] = useState(0)
    
    
    var index = 0

    let config = {
        headers: {
            'Authorization': `Bearer ${token}`
          }
    }


    useEffect(()=>{
        async function fetchData(){
            console.log(token)             
            api.get('chapter/index?manga_id=60b809c8f2e54b2be09ec686&number=1', config)
                .then(response => {
                    //setState({ feed: response.data });  
                    if(response.data !== null){
                        console.log(response.data);
                       
                        setState({ pages: response.data.chapters[0].imgCollection })
                        setInfo({
                            title: response.data.chapters[0].title,
                            number: response.data.chapters[0].number
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
      
        if (currentPage === state.pages.length){
            console.log("last page reached")
        } else{
            //setCurrentPage({id: currentPage.id+1, path: pages[currentPage.id+1]})
            setCurrentPage(currentPage+1)            
        }
        

        
    }

    function prevPage(){    
        if(currentPage === 0){
            console.log("first page reached")
        } else{
            //setCurrentPage({id: currentPage.id-1, path: pages[currentPage.id-1]})
            setCurrentPage(currentPage-1)
        }
        
     
    }

    return <>   
        <div className="reader">
            <div className="header-board">

                    <div className="title">
                        Rental Onii-chan!
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
                {state.pages.map((page, index) => (                   
                    //<img src= {`http://localhost:3333/files/${post.image}`} alt= "post"/>
                    <img src={process.env.REACT_APP_NOT_SECRET_CODE + page.id} alt= {page.originalname} style={index === currentPage ? {}  : {display: "none"}}/>
                ))}

                <img className='page' src={state.pages[index]} alt={index} onClick={() => nextPage()}/>
            </div>


        </div>
      
        

    </>
}