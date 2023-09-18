import React, {useState} from 'react';
import {useRef} from "react";
import {useNavigate} from "react-router-dom";
import {useDispatch} from "react-redux";
import {updateUsername,updateMoney} from "../features/user";
import {Link} from "react-router-dom";

const Form = ({page}) => {

    const usernameRef = useRef();
    const passRef = useRef();
    const repeatPassRef = useRef();
    const ageRef = useRef();
    const autoSaveRef = useRef();
    const [error, setError] = useState();
    const nav = useNavigate();
    const dispatch = useDispatch();

    async function register() {
        if (!usernameRef.current.value) return setError('username cannot be empty')
        if (!passRef.current.value) return setError('password cannot be empty')
        if (passRef.current.value !== repeatPassRef.current.value) return setError('passwords should match');
        if (!ageRef.current.checked) return setError('You have to be 18 or over to be able to register, sorry little friend.');
        const user = {
            username: usernameRef.current.value,
            pass1: passRef.current.value,
            pass2: repeatPassRef.current.value,
            age: ageRef.current.checked
        }
        const options = {
            method: 'POST',
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify(user)
        }

        try {
            const res = await fetch('http://localhost:8000/register', options);
            const data = await res.json();
            console.log('data', data);
            setError(data.message);
            if (!data.error) {
                usernameRef.current.value = '';
                passRef.current.value = '';
                repeatPassRef.current.value = '';
                setError();
                nav('/');
            }
        } catch (e) {
            console.log('error', e)
        }
    }

    async function login() {
        localStorage.setItem('auto-save', autoSaveRef.current.checked);
        if (!usernameRef.current.value) return setError('username cannot be empty');
        if (!passRef.current.value) return setError('password cannot be empty');
        const user = {
            username: usernameRef.current.value,
            password: passRef.current.value,
        }
        const options = {
            method: 'POST',
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify(user)
        }
        try {
            const res = await fetch('http://localhost:8000/login', options);
            const data = await res.json();
            setError(data.message);
            if (!data.error) {
                dispatch(updateUsername(data.data.username));
                dispatch(updateMoney(data.data.money));
                console.log(data);
                if(JSON.parse(localStorage.getItem('auto-save'))){
                    localStorage.setItem('TOKEN', data.token);
                } else {
                    sessionStorage.setItem('TOKEN', data.token);
                }
                usernameRef.current.value = '';
                passRef.current.value = '';
                setError();
                nav('/slots');
            }
        } catch (e) {
            console.log('error', e)
        }
    }

    function handleAutoSave() {
        localStorage.setItem('auto-save', autoSaveRef.current.checked);
    }

    return (
        <div className="box">
            <h1>{page}</h1>
            {error && <div className="error">{error}</div>}
            <input type="text" ref={usernameRef} placeholder="Your username"/>
            <input type="text" ref={passRef} placeholder="Your password"/>
            {page === 'Register' &&
                <>
                    <input type="text" ref={repeatPassRef} placeholder="Repeat password"/>
                    <div>
                        <label htmlFor="userAge">Are you 18 or over? </label>
                        <input type="checkbox" id="userAge" ref={ageRef}/>
                    </div>

                </>
            }
            {page === 'Login' &&
                <>
                    <div>
                        <label htmlFor="auto">Stay logged in? </label>
                        <input onChange={handleAutoSave} id="auto" type="checkbox" ref={autoSaveRef}/>
                    </div>
                    <div>Do not have an account? <Link to="/register">Register</Link></div>
                </>}
            <button onClick={page === 'Register' ? register : login}>{page}</button>
        </div>
    );
};

export default Form;