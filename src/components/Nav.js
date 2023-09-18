import React from 'react';
import {NavLink} from "react-router-dom";
import {updateUsername, updateMoney} from "../features/user";
import {useDispatch, useSelector} from "react-redux";

const Nav = () => {

    const loggedInUser = useSelector(state => state.user.username);
    const dispatch = useDispatch();

    function handleLogOut() {
        dispatch(updateUsername(null));
        dispatch(updateMoney(null));
        localStorage.removeItem('TOKEN');
        sessionStorage.removeItem('TOKEN');
        localStorage.removeItem('auto-save');
    }

    return (
        <>
            <div className="nav">
                <div className="navLeft">
                    <NavLink to='/' className='link' >
                        <div>LOGIN</div>
                    </NavLink>
                    <NavLink className='link' to='/register' >
                        <div>REGISTRATION</div>
                    </NavLink>
                    <NavLink className="link" to='/slots' >
                        <div>PLAY</div>
                    </NavLink>
                </div>
                <div className="navRight">
                    {loggedInUser &&
                        <NavLink className="link" to='/' >
                            <div onClick={handleLogOut}>LOG OUT</div>
                        </NavLink>}

                </div>

            </div>
        </>

    );
};

export default Nav;