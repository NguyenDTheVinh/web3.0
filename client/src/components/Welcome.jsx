import React, { useContext } from 'react';
import { AiFillPlayCircle } from 'react-icons/ai';
import { SiEthereum } from 'react-icons/si';
import { BsInfoCircle } from 'react-icons/bs';

import { TransactionContext } from '../context/TransactionContext';
import { Loader } from './';
import { shortenAddress } from '../utils/shortenAddress';
import { useEffect } from 'react';

import { getDatabase, ref, child, get, set, onValue, query, push } from 'firebase/database';
import { database } from '../config/firebase';

const commonStyles = "min-h-[70px] sm:px-0 px-2 sm:min-w-[120px] flex justify-center items-center border-[0.5px] border-gray-400 text-sm font-light text-white";

const Input = ({ placeholder, name, type, value, handleChange }) => (
   <input
      placeholder={placeholder}
      type={type}
      step='0.0001'
      value={value}
      onChange={(e) => handleChange(e, name)}
      className='my-2 w-full rounded-sm p-2 outline-none bg-transparent text-white border-none text-sm input-glassmorphism'
   />
);

const changeAccount = () => {
   location.reload();
}

const Welcome = () => {

   const { connectWallet, currentAccount, formData, sendTransaction, handleChange, isLoading, hash } = useContext(TransactionContext);

   const handleSubmit = (e) => {
      const { addressTo, amount, action, planttype, harvest, disease, healthstatus, note } = formData;
      e.preventDefault();

      if (!addressTo || !amount || !action || !planttype || !harvest || !disease || !healthstatus || !note) return;
      sendTransaction();
   }


   return (
      <div className='bg-custom-welcome flex w-full justify-center items-center'>
         <div className='flex mf:flex-row flex-col items-start justify-between md:p-20 py-12 px-4 sm:mt-[50px] mt-0'>
            <div className='flex flex-1 justify-start flex-col mf:mr-10'>
               <h1 className='h-auto text-3xl sm:text-5xl text-white text-gradient py-1 sm:mt-[50px] mt-[50px]'>
                  Upload <br /> garden status
               </h1>
               <p className='text-left mt-5 text-white font-light md:w-9/12 w-11/12 text-base'>
                  Connect your wallet to upload information.
               </p>
               {/* {!currentAccount && (
                  <button
                     type='button'
                     onClick={connectWallet}
                     className='flex flex-row justify-center items-center my-5 bg-[#2952e3] p-3 rounded-full cursor-pointer hover:bg-[#2546bd]'
                  >
                     <p className='text-white text-base font-semibold'>Connect Wallet</p>
                  </button>
               )
               }
               {currentAccount && (
                  <button
                     type='button'
                     onClick={changeAccount}
                     className='flex flex-row justify-center items-center my-5 border-[2px] p-2 border-[#fff] p-3 rounded-full cursor-pointer text-white hover:bg-[#fff] hover:text-[#000]'
                  >
                     <p className='text-base font-semibold'>Change Account</p>
                  </button>
               )
               } */}


               <div className='grid sm:grid-cols-3 grid-cols-2 w-full mt-10'>
                  {/* <div className={`rounded-tl-2xl ${commonStyles}`}>
                     Garden
                  </div>
                  <div className={`sm:rounded-none ${commonStyles} rounded-tr-2xl`}>
                     Realtime
                  </div>
                  <div className={`sm:rounded-tr-2xl ${commonStyles} rounded-none`}>
                     Ethereum
                  </div>
                  <div className={`sm:rounded-bl-2xl ${commonStyles} rounded-none`}>
                     WEB 3.0
                  </div>
                  <div className={`sm:rounded-none ${commonStyles} rounded-bl-2xl`}>
                     Low fees
                  </div>
                  <div className={`rounded-br-2xl ${commonStyles}`}>
                     Blockchain
                  </div> */}
               </div>
            </div>

            <div className='flex flex-col flex-1 items-center justify-start w-full mf:mt-0 mt-10'>

               <div className='justify-end items-start flex rounded-xl sm:w-full w-full'>

                  <div className='p-3 justify-end items-start flex-col rounded-xl h-30 sm:w-[70%] w-full my-5 eth-card white-glassmorphism'>
                     <div className='flex justify-between flex-col w-full h-full'>
                        {/* <div className='flex justify-between items-start'>
                        <div className='w-10 h-10 rounded-full border-2 border-white flex justify-center items-center'>
                           <SiEthereum className='static justify-center items-center' fontSize={21} color='#fff' />
                        </div>
                        <BsInfoCircle className='static ml-[100px]' fontSize={17} color='#fff' />
                     </div> */}
                        <div>
                           <p className='text-white font-semibold text-lg mt-1'>
                              Ethereum
                           </p>
                           <p className='text-white font-light text-sm'>
                              {shortenAddress(currentAccount)}
                           </p>
                        </div>
                     </div>
                  </div>

                  <div>
                     {!currentAccount && (
                        <button
                           type='button'
                           onClick={connectWallet}
                           className='h-full flex flex-row justify-center items-center my-5 ml-[5%] bg-[#2952e3] p-3 rounded-xl cursor-pointer hover:bg-[#2546bd]'
                        >
                           <p className='text-white text-base font-semibold'>Connect Wallet</p>
                        </button>
                     )
                     }
                     {currentAccount && (
                        <button
                           type='button'
                           onClick={changeAccount}
                           className='h-full flex flex-row justify-center items-center my-5 ml-[5%] border-[2px] border-[#fff] p-3 rounded-xl cursor-pointer text-white hover:bg-[#fff] hover:text-[#000]'
                        >
                           <p className='text-base font-semibold'>Change Account</p>
                        </button>
                     )
                     }
                  </div>

               </div>


               <div className='p-5 sm:w-96 w-full flex flex-col justify-start items-center blue-glassmorphism'>
                  <Input placeholder='Address To' name='addressTo' type='text' handleChange={handleChange} />
                  {/* <Input placeholder='Amount (ETH)' name='amount' type='number' handleChange={handleChange} /> */}
                  <Input placeholder='Action' name='action' type='text' handleChange={handleChange} />
                  <Input placeholder='Plant type' name='planttype' type='text' handleChange={handleChange} />
                  <Input placeholder='Harvest' name='harvest' type='text' handleChange={handleChange} />
                  <Input placeholder='Disease' name='disease' type='text' handleChange={handleChange} />
                  <Input placeholder='Health status' name='healthstatus' type='text' handleChange={handleChange} />
                  <Input placeholder='Note' name='note' type='text' handleChange={handleChange} />

                  <div className='h-[1px] w-full bg-gray-400 my-2' />
                  {isLoading ? (
                     <Loader />
                  ) : (
                     <button
                        type='button'
                        onClick={handleSubmit}
                        className='text-white w-full mt-2 border-[2px] p-2 border-[#fff] rounded-full cursor-pointer hover:bg-[#fff] hover:text-[#000]'
                     >
                        UPLOAD
                     </button>
                  )}

               </div>

            </div>
         </div>
      </div>
   );
}

export default Welcome;