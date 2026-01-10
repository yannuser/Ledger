import React from "react";
import { useState } from "react";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    function handleSubmit(e) {
        e.preventDefault();
    }

    return(
    <form onSubmit={handleSubmit}>
        <label htmlFor="email">
            <input type="email" id="email" value={email} onChange={ e => setEmail(e.target.value) } />
        </label>
        <label htmlFor="password">
            <input type="password" id="password" value={password} onChange={ e => setPassword(e.target.value) } />
        </label>
        <input type="submit"/>
    </form>
)
}



export default Login;