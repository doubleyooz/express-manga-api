import React, {useState, useEffect, useContext} from 'react';
import { Link, useParams } from 'react-router-dom';

import './styles.css';

import { Context } from '../../Contexts/AuthProvider'
import api from "../../services/api"

require('dotenv').config()

const User = (props) =>{

   
    const { token, loading, handleLogin } = useContext(Context)
    
    
   
    return <>   
        <div className="User">
           User

        </div>
      
        

    </>
}

export default User