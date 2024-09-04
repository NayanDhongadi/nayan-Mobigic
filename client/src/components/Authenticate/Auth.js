import React, { useState } from 'react'
import './Auth.css'
import { Spin } from 'antd'
import Signup from './Signup/Signup';
import Login from './Login/Login';


function Auth() {
    const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem("admintoken"));
    const [loading, setLoading] = useState(false); 
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isFlipped, setIsFlipped] = useState(false);

    const handleFlip = () => {
        setIsFlipped(!isFlipped);
      };
    
      const setLoad = (newState) => {
        setLoading(newState);
      };
    

    return (


   

    <>

        <div className="adminCredentials">
            <Spin spinning={loading}>
                <div className="auth-container max-w-md mx-auto p-4">
                    <div className={`card relative ${isFlipped ? "flipped" : ""}`}>
                        <div className="card-front">
                            <Login
                                onFlip={handleFlip}
                                setIsLoggedIn={setIsLoggedIn}
                                setLoad={setLoad}
                                loading={loading}
                            />
                        </div>
                        <div className="card-back absolute inset-0">
                            <Signup onFlip={handleFlip} setLoad={setLoad} loading={loading} />
                        </div>
                    </div>
                </div>
            </Spin>
        </div>

    </>






    )
}

export default Auth