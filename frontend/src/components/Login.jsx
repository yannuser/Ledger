import React from "react";
import { useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';


export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();

        // axios.get(URL, CONFIG_OBJECT)
        axios.get("http://localhost:5000/User/login", {
            params: {
                email: email,
                password: password
            }
        })
        .then(result => {
            navigate('/')
            console.log(result);
        })
        .catch(err => {
            console.log(err)
        });
    }

    return(
        <>
            <div className="heading">LOGIN</div>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="email">Email</label>
                    <input type="email" id="email" value={email} onChange={ e => setEmail(e.target.value) } />
                </div>
                <div>
                    <label htmlFor="password">password</label>            
                    <input type="password" id="password" value={password} onChange={ e => setPassword(e.target.value) } />
                </div>

                <input type="submit"/>
            </form>
            <p>
                Don't have an account ? <Link to="/register"> Sign In </Link>
            </p>
        </>
    )
}
