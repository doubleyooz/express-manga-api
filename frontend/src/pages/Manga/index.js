import React, {useState} from 'react';

import './styles.css';

import banner from "../../assets/banner_scan.png"

import api from "../../services/api"

export default function Manga(){

    const dir = ""



    const [currentPage, setCurrentPage] = useState({
        id: 0,
        path:  dir + 'banner_scan.png',
    });  
    
    async function componentDidMount() {
        //registerToSocket();
        let config = {
            
            auth: {
                username: "itachiut1r4@gmail.com",
                password: "Lucarneiro@0009"
            }
            
        }

       

        /*api.get('sign-in', config).then(response =>{
            console.log(response.data)
            console.log("login well succeed")
        }).catch(err=>{
            console.log(err)
            console.log("login failed")
        })*/
        let token =  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYwYWM0MWRjMTE2NjVkMjg1NDk4N2M3MSIsInJvbGUiOiJTY2FuIiwiaWF0IjoxNjIxOTY0ODc3LCJleHAiOjE2MjE5NzIwNzd9.al2w6IMBeVcKkevHn94hQ0CffDkhh5sDl4t6Ou4fzYQ"
        
        config = {
            headers: {
                Authorization: "Bearer " + token
            }
        }
      
      
       
        api.get('chapter/index?manga_id=60ac4bc918a0761d4c2babda&number=1', config).then(response => {
            //setState({ feed: response.data });  
            console.log(response.data);
            console.log("list chapters well succeed")
        }).catch(err =>{
            console.log(err)
            console.log("list chapters failed")
        })
      
    }
    componentDidMount()
    
    
    var imagePath = [];
    
    function generatePath(someImageName) {
        return require(`../../assets/${someImageName}`);
    }

    function getPaths(){
        let temp = [ {
            id: 0,
            path: generatePath("banner_scan.png")
        }];

        for(var i = 1; i < 49; i++){
            if (i < 10){
                temp.push({
                    id: i, 
                    path: generatePath(`cap/0${i}.jpg`)
                   
                });                
            }               
            else {
                temp.push({
                    id: i, 
                    path:  generatePath(`cap/${i}.jpg`)
                })
            }
        imagePath = temp
        }
    }
                   
    
    function nextPage(){    
        getPaths()
        imagePath.forEach((obj, index) => {
            if(obj.id === currentPage.id){
                console.log(imagePath.length)
                console.log(index)
                if(imagePath.length === index+1){

                } else{
                    setCurrentPage(imagePath[index+1])
                }
                
            }
        })
        console.log(currentPage.path)
     
    }

    function prevPage(){    
        getPaths();
        imagePath.forEach((obj, index) => {
            if(obj.id === currentPage.id){
                console.log(imagePath.length)
                console.log(index)
                if(index === 0){

                } else{
                    setCurrentPage(imagePath[index-1])
                }
                
            }
        })
        console.log(currentPage.path)
     
    }

    return <>   
        <div className="reader">
            <div className="header-board">

                    <div className="title">
                        Rental Onii-chan!
                    </div>
                    <div className="controllers">
                        <button className='button'>◄◄</button>
                        <div className="chapters"> Chapter #06 </div>
                        <button className='button'>►►</button>
                   
                   
                    </div>
                    <div className="controllers">
                        <button className='button' onClick= {() => componentDidMount()}>prev</button>
                        <div className="pages-list"> </div>
                        <div className="version"></div>
                        <div className="viewToggle"></div>
                        <button className='button' onClick={() => nextPage()}>next</button>
                   
                   
                    </div>
            </div>



            <div className='board'>       


                <img className='page' src={currentPage.path} alt={currentPage.id} onClick={() => nextPage()}/>
            </div>


        </div>
      
        

    </>
}