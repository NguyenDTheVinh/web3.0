import { useState } from 'react';
import { HiMenuAlt4 } from 'react-icons/hi';
import { AiOutlineClose } from 'react-icons/ai';
import { Link, useMatch, useResolvedPath } from 'react-router-dom';

import logo from '../../images/logo.png';
import dinhgardenLogo from '../../images/dinhgardenLogo.png';
import React from 'react';

const NavbarItem = ({ title, classProps }) => {
   //Retrieve
   return (
      <li className={`text-white mx-4 cursor-pointer ${classProps}`}>
         {title}
      </li>
   );
}

const NavbarConsumer = () => {
   const [toggleMenu, setToggleMenu] = useState(false);

   return (
      <nav className='bg-custom-2 w-full flex md:justify-center justufy-between items-center p-4'>
         <div className='md:flex-[0.5] flex-initial justify-center items-center'>
            <img src={dinhgardenLogo} alt="logo" className='w-32 cursor-pointer' />
         </div>
      </nav>
   );
}

export default NavbarConsumer;