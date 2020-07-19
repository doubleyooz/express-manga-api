import React, {useState} from 'react';

import './styles.css';



export default function Reader(){

    const [currentPage, setCurrentPage] = useState({
        id: 0,
        path:  '../../assets/banner_scan.png',
    },);  

    const imagePath = [
        {
            id: 0,
            path:  '../../assets/banner_scan.png',
        },
        {
            id: 1,
            path:  '../../assets/cap/01.jpg',
        },
        {
            id: 2,
            path:  '../../assets/cap/02.jpg',
        },
    ]
                   
    

    function nextPage(){    
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

        <div>         
            <img className='page' src={require(currentPage.path)} alt={currentPage.id} onClick={() => nextPage()}/>
        </div>
    </>
}