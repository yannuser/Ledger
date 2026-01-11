import React from "react";
import { Link } from 'react-router-dom';

export default function SignUp() {

    async function handleSubmit(e) {
        e.preventDefault();
    }

    return(
        <>
            <div className="heading">SIGN UP</div>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="firstname">First name</label>
                    <input type="text" id="firstname" />
                </div>
                <div>
                    <label htmlFor="lastname">Last name</label>
                    <input type="text" id="lastname" />
                </div>
                <div>
                    <label htmlFor="dateOfBirth">Date Of Birth ( not required )</label>
                    <input type="date" id="dateOfBirth" />
                </div>
                <div>
                    <label htmlFor="email">Email</label>
                    <input type="email" id="email"/>
                </div>
                <div>
                    <label htmlFor="password">Password</label>
                    <input type="password" />
                </div>
                <input type="submit"/>
            </form>
            <p>
                Have an account ? <Link to="/"> Login </Link>
            </p>
        </>
    )
}