import React from "react";
import { Link, useNavigate } from 'react-router-dom';
import { useState } from "react";
import axios from 'axios';

export default function SignUp() {
    const [firstname, setFirstname] = useState("");
    const [lastname, setLastname] = useState("");
    const [dateOfBirth, setDateOfBirth] = useState(new Date());
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault();

        axios.post("http://localhost:5000/User/register", {firstname, lastname, dateOfBirth, email, password}).then(
            result => {
                console.log(result);
                if (result.status == 201) {
                    navigate('/');
                } else {
                    alert("An error occurred!!!")
                }
                
            }
        ).catch(err => console.log(err))
    }
    

    return(
        <>
            <div className="heading">SIGN UP</div>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="firstname">First name</label>
                    <input type="text" id="firstname"  value={firstname} onChange={e => setFirstname(e.target.value)} required/>
                </div>
                <div>
                    <label htmlFor="lastname">Last name</label>
                    <input type="text" id="lastname" value={lastname} onChange={e => setLastname(e.target.value)} required/>
                </div>
                <div>
                    <label htmlFor="dateOfBirth">Date Of Birth ( not required )</label>
                    <input type="date" id="dateOfBirth" value={dateOfBirth} onChange={e => setDateOfBirth(e.target.value)}/>
                </div>
                <div>
                    <label htmlFor="email">Email</label>
                    <input type="email" id="email" value={email} onChange={e => setEmail(e.target.value)} required/>
                </div>
                <div>
                    <label htmlFor="password">Password</label>
                    <input type="password" id="password" value={password} onChange={e => setPassword(e.target.value)} required/>
                </div>
                <input type="submit"/>
            </form>
            <p>
                Have an account ? <Link to="/"> Login </Link>
            </p>
        </>
    )
}