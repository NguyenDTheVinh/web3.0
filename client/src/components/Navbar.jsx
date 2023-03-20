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

const Navbar = () => {
   const [toggleMenu, setToggleMenu] = useState(false);

   return (
      <nav className='bg-custom-2 w-full flex md:justify-center justufy-between items-center fixed pr-9'>
         <div className='md:flex-[2/3] w-full flex-initial justify-center items-center'>
            <img src={dinhgardenLogo} alt="logo" className='w-32 cursor-pointer sm:ml-[50px] ml-[30px]' />
         </div>
         <ul className='text-black md:flex hidden list-none flex-row justify-between item-center flex-initial'>
            <Link className='h-20 w-[100px] flex justify-center items-center ml-[10px] mr-[15px] text-white hover:bg-[#6ED94E]' to='/owner/dashboard/area/a'>Dashboard</Link>
            <Link to='/owner/upload' className='h-20 w-[100px] flex justify-center items-center ml-[15px] mr-[15px] text-white hover:bg-[#6ED94E]'>Upload</Link>
            <Link to='/owner/retrieve' className='h-20 w-[100px] flex justify-center items-center ml-[15px] text-white hover:bg-[#6ED94E]'>Traceability</Link>
         </ul>
         <div className='flex relative'>
            {toggleMenu
               ? <p />
               : <HiMenuAlt4 fontSize={28} className='text-red md:hidden cursor-pointer fixed -right-0 top-5' onClick={() => setToggleMenu(true)} />
            }
            {toggleMenu && (
               <ul
                  className='z-10 fixed top-0 -right-2 p-3 w-[70vw] h-screen
                                 shadow-2xl md:hidden list-none flex flex-col 
                                 justify-start items-end rounded-md blue-glassmorphism
                                 text-white animate-slide-in '
               >
                  <li className='text-xl w-full my-2'>
                     <AiOutlineClose onClick={() => setToggleMenu(false)} />
                  </li>
                  <Link to='/owner/dashboard' className='text-lg my-2 mr-3'>Dashboard</Link>
                  <Link to='/owner/dashboard/area/a' className='text-lg my-2 mr-3'>Upload</Link>
                  <Link to='/owner/retrieve' className='text-lg my-2 mr-3'>Traceability</Link>
               </ul>
            )}
         </div>
      </nav>
   );
}

export default Navbar;