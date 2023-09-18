import React from 'react';
import {useSelector, useDispatch} from "react-redux";
import {useState, useEffect} from "react";
import {useNavigate} from "react-router-dom";
import {updateMoney, updateUsername} from "../features/user";

const SlotsPage = () => {

    const nav = useNavigate();
    const dispatch = useDispatch();
    const loggedInUser = useSelector(state => state.user);
    const [error, setError] = useState();
    const [bid, setBid] = useState(1);
    const bids = [1, 5, 10];
    const slots = [
        'https://pixy.org/download/810725/',
        'https://cdn3.iconfinder.com/data/icons/casino/256/Cherries-512.png',
        'https://cdn3.iconfinder.com/data/icons/casino/256/Jackpot-512.png',
        'https://cdn4.iconfinder.com/data/icons/slot-machines/512/Crown-512.png',
        'https://cdn3.iconfinder.com/data/icons/slot-machine-symbols-filled-outline/256/bell-512.png'
    ]
    const [chanceCombo, setChanceCombo] = useState([0, 1, 2]);
    const [gameOver, setGameOver] = useState(false);


    useEffect(() => {

        const auto = JSON.parse(localStorage.getItem('auto-save'))
        if (auto) {
            const options = {
                method: 'GET',
                headers: {
                    'content-type': 'application/json',
                    authorization: localStorage.getItem('TOKEN')
                }
            }
            fetch('http://localhost:8000/getUserInfo', options)
                .then(res => res.json()).then(data => {
                    dispatch(updateUsername(data.data.username))
                    dispatch(updateMoney(data.data.money))
                }
            )
        } else {
            if (sessionStorage.getItem('TOKEN')) {
                const options = {
                    method: 'GET',
                    headers: {
                        'content-type': 'application/json',
                        authorization: sessionStorage.getItem('TOKEN')
                    }
                }
                fetch('http://localhost:8000/getUserInfo', options)
                    .then(res => res.json()).then(data => {
                        dispatch(updateUsername(data.data.username))
                        dispatch(updateMoney(data.data.money))
                    }
                )
            }
        }

    }, [])

    async function play() {

        const auto = JSON.parse(localStorage.getItem('auto-save'))
        const info = auto ? localStorage.getItem('TOKEN') : sessionStorage.getItem('TOKEN')
        const options = {
            method: 'GET',
            headers: {
                "content-type": "application/json",
                authorization: info
            }
        }
        const res = await fetch('http://localhost:8000/play/' + bid, options);
        const data = await res.json();
        setError(data.message);
        if(!data.notEnoughMoney) {
            dispatch(updateMoney(data.data.money))
            setChanceCombo(data.chanceCombo);
        }
        if (data.data.money <= 0) {
            setGameOver(true);
        }

    }

    function startNewGame() {
        const auto = JSON.parse(localStorage.getItem('auto-save'))
        if (auto) {
            const options = {
                method: 'GET',
                headers: {
                    'content-type': 'application/json',
                    authorization: localStorage.getItem('TOKEN')
                }
            }
            fetch('http://localhost:8000/newGame', options)
                .then(res => res.json()).then(data => {
                    dispatch(updateMoney(data.data.money))
                    setError();
                }
            )
        } else {
            if (sessionStorage.getItem('TOKEN')) {
                const options = {
                    method: 'GET',
                    headers: {
                        'content-type': 'application/json',
                        authorization: sessionStorage.getItem('TOKEN')
                    }
                }
                fetch('http://localhost:8000/newGame', options)
                    .then(res => res.json()).then(data => {
                        dispatch(updateMoney(data.data.money));
                        setError();
                        setGameOver(false);
                    }
                )
            }
        }
    }

    return (
        <>
            {loggedInUser.username ? <div className="page flex-column">
                    <h1 className="h1">Welcome, {loggedInUser.username}!</h1>
                    <div className="box slotsCont">
                        <h4><b>Money: ${loggedInUser.money}</b></h4>
                        <div className="slots">
                            {chanceCombo.map((combo, index) => <div key={index}>
                                <img src={slots[combo]} alt=""/>
                            </div>)}
                        </div>
                        {error && <div className="error">{error}</div>}
                        {!gameOver ?
                            <>
                                <h4><b>CHOOSE YOUR BID</b></h4>
                                <div className="d-flex gap-3">
                                    {bids.map((bidOption, index) =>
                                        <button onClick={() => setBid(bidOption)} key={index}
                                                className={bid === bidOption ? 'selected' : 'unselected'}>{bidOption}</button>
                                    )}
                                </div>
                                <button className="spinBtn" onClick={play}>PLAY</button>
                            </>
                            :
                            <button className="spinBtn" onClick={startNewGame}>PLAY AGAIN</button>
                        }

                    </div>
                </div>
                :
                <div className="page">
                    <div className="box">
                        <b>YOU NEED TO LOGIN TO BE ABLE TO PLAY</b>
                        <button onClick={() => nav("/")}>GO TO LOGIN</button>
                    </div>

                </div>}
        </>

    );
};

export default SlotsPage;