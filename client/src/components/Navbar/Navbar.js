import React from 'react';
import { Button } from 'antd';

import 'tailwindcss/tailwind.css';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {

  const history = useNavigate();

  

  const handelLogout = () => {
    localStorage.removeItem('userdatatoken')
    localStorage.removeItem('username')
    history('/auth');

  }

  return (
    <>
      <div className="bg-white p-4 shadow-md fixed w-full z-10">
        <div className="container mx-auto flex justify-between items-center">
          <div className="text-xl font-bold">
            <Link to="/">MyApp</Link>
          </div>
          <div className="flex space-x-4">
            <Link to="/files">
              Show Files
            </Link>
            <Link to="/">
              Upload Files
            </Link>
            <Button type="link" onClick={handelLogout}>
              Logout
            </Button>
          </div>

        </div>


      </div>

    </>
  );
};

export default Navbar;
