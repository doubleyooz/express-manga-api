import React, {useState, useEffect, useContext} from 'react';
import { Link, useParams} from 'react-router-dom';

import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';

import { GoogleLogin } from 'react-google-login';

import './styles.css';

import { Context } from '../../Contexts/AuthProvider'
import  userSchema from '../../Validations/LoginValidation'
import api from "../../services/api"

require('dotenv').config()

const Login = () =>{

    const [activationToken, setActivationToken] = useState(null)

    const { token, setToken } = useContext(Context)
    
    const { register, handleSubmit,  formState: { errors } } = useForm({
        // defaultValues: { firstName: data.firstName, lastName: data.lastName },
        mode: "onBlur",
        resolver: yupResolver(userSchema),
    });


    const onSubmit = data => console.log(data);
  
      
    /*const login = async (event) =>{
        event.preventDefault()
        let formData ={
            email: event.target[0].value,
            password: event.target[1].value
        }

        userSchema.validate(formData).then(() => {
            
        })
            .catch((err) => {
                      
            
        })
    }*/

    const sendPassword = data => {
        console.log(data)
        api.post('/google-sign-up', {password: data.password}, {token: activationToken})
            .then(async result =>  {
                console.log(result)
                const accessToken = result.data.metadata.token.toString()
                setToken(accessToken)
            }).catch(err=>{
                console.log(err)
                setToken(undefined)
            }) 
    }

    const handleLogin = async googleData => {

        let config = {            
            token: googleData.tokenId
            
        }        
        

        api.post('/google-sign-in', config).then(async response =>{
            
            console.log(response)
            response.data.metadata.activationToken 
                ? setActivationToken(response.data.metadata.activationToken )
                : setToken(response.data.metadata.token.toString())
                
           
         
            
            

            
        }).catch(err=>{
            console.log(err)                   
            setToken(undefined)
            
            
        })


      
       
    }
   
    
 
   
    return <>   
        <div className="login-page">
            {!activationToken ? 
                <div className="card">

                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="field">

                            {/* register your input into the hook by invoking the "register" function */}
                            <input placeholder="email"  {...register("email")} error={!!errors.email} />
                            <span>{errors.email?.message}</span>
                        </div>

                        <div className="field">
                            {/* include validation with required or other standard HTML validation rules */}
                            <input type="password" placeholder="password" {...register("password")} error={!!errors.password} />
                            <span>{errors.password?.message}</span>
                            
                        </div>                   

                    
                        
                        <input className="submit" type="submit" value="Login" />
                    </form>


                    <GoogleLogin
                        clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
                        buttonText="Log in with Google"
                        onSuccess={handleLogin}
                        onFailure={handleLogin}
                        cookiePolicy={'single_host_origin'}
                    />

                    <div className="footer">
                        <Link to='/'>
                            Forgot password?          
                        </Link> 

                        <Link to='/'>
                            create account           
                        </Link> 

                    
                    </div>
                </div> :
               <form onSubmit={handleSubmit(sendPassword)}>                   

                    <div className="field">
                        {/* include validation with required or other standard HTML validation rules */}
                        <input type="password" placeholder="password" {...register("password")} error={!!errors.password} />
                        <span>{errors.password?.message}</span>
                        
                    </div>                   

                
                    
                    <input className="submit" type="submit" value="Login" />
                </form>


            }
            


        </div>
      
        

    </>
}

export default Login
