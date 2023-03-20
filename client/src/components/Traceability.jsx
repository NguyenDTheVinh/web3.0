import React, { useContext } from 'react';
import { TransactionContext } from '../context/TransactionContext';

import dummyData from '../utils/dummyData';
import { shortenAddress } from '../utils/shortenAddress';
import useFetch from '../hooks/useFetch';
import { getDatabase, ref, child, get, set, onValue, query, push } from 'firebase/database';
import { database } from '../config/firebase';
import { useState, useEffect } from 'react';


const TransactionCard = ({ TransactionHash, addressFrom, addressTo, amount, timestamp, action, planttype, harvest, disease, healthstatus, note }) => {

   return (
      <div className='flex flex-1 2xl:min-w-[650px]
         2xl:max-w-[500px]
         sm:min-w-[270px]
         w-[400px]
         sm:max-w-[300px]
         flex-col p-3 rounded-md hover:shadow-2xl hover:border-[1px] hover:border-[#000]
      '>
         <div className='flex w-full rounded-md'>

            <div className='flex text-center justify-center mr-1 mt-6'>
               <div className='vl absolute'></div>
               <span className='dot absolute'></span>
            </div>

            <div className='flex flex-col items-left w-full mt-3 rounded-md'>

               <div className='flex justify-center items-center p-3 px-5 sm:w-max w-50% rounded-3xl -mt-5 ml-3'>
                  <p className='flex bg-black sm:w-max max-w-auto text-[12px] justify-center items-center sm:text-3xl h-[60px] text-[#05F38C] font-bold sm:p-3 p-1 px-5 rounded-bl-3xl rounded-tl-3xl'>
                     <p className='mr-2 text-[15px]'>Action: </p>{action}
                  </p>
                  <div className='flex bg-black h-[60px] p-3 px-5 w-max rounded-br-3xl rounded-tr-3xl shadow-2xl items-center'>
                     <p className='text-[#05F38C] text-[10px] sm:text-[30px] text-center font-bold'>
                        {timestamp}
                     </p>
                  </div>
               </div>

               <hr className='w-auto' />

               <div className='w-full p-2 ml-4'>
                  <a href={`https://goerli.etherscan.io/address/${addressFrom}`} target='_blank' rel='noopener noreferrer'>
                     <p className='flex text-white text-base'>
                        <p className='text-[#05F38C] mr-3'>Address From:</p> {shortenAddress(addressFrom)}
                     </p>
                  </a>
                  <a href={`https://goerli.etherscan.io/address/${addressTo}`} target='_blank' rel='noopener noreferrer'>
                     <p className='flex text-white text-base'>
                        <p className='text-[#05F38C] mr-3 mb-4'>Address To:</p> {shortenAddress(addressTo)}
                     </p>
                  </a>
                  <a href={`https://goerli.etherscan.io/tx/${TransactionHash}`} target='_blank' rel='noopener noreferrer'>
                     <p className='flex text-white text-base'>
                        <p className='text-[#05F38C] mr-3 mb-4'>Block Hash:</p> <p className='text-red-500'>{shortenAddress(TransactionHash)}</p>
                     </p>
                  </a>
                  <div className='w-[90%] mb-0 bg-black rounded-md shadow-2xl'>
                     <p className='rounded-tl-md rounded-tr-md w-full p-2 bg-custom-4 text-xl text-[#000] mr-3 font-bold'>
                        Content of Block
                     </p>
                     {planttype && (
                        <>
                           <br />
                           <p className='flex text-white text-base'><p className='text-[#05F38C] ml-4 mb-5 mr-3'>Plant type:</p> {planttype}</p>
                        </>
                     )}
                     {harvest && (
                        <>
                           <br />
                           <p className='flex text-white text-base'><p className='text-[#05F38C] ml-4 mb-5 mr-3'>Harvest:</p> {harvest}</p>
                        </>
                     )}
                     {disease && (
                        <>
                           <br />
                           <p className='flex text-white text-base'><p className='text-[#05F38C] ml-4 mb-5 mr-3'>Disease:</p> {disease}</p>
                        </>
                     )}
                     {healthstatus && (
                        <>
                           <br />
                           <p className='flex text-white text-base'><p className='text-[#05F38C] ml-4 mb-5 mr-3'>Health status:</p> {healthstatus}</p>
                        </>
                     )}
                     {note && (
                        <>
                           <br />
                           <p className='flex text-white text-base'><p className='text-[#05F38C] ml-4 mb-5 mr-3'>Note:</p> {note}</p>
                        </>
                     )}
                  </div>
               </div>
               <a href={`https://goerli.etherscan.io/tx/${TransactionHash}`} target='_blank' rel='noopener noreferrer'>
                  <p className='text-white ml-4 text-[13px] sm:text-xl hover:text-sky-400 hover:underline hover:decoration-2'>
                     📃  Verify information on Blockchain network
                  </p>
               </a>
            </div>
         </div>
         {/* <img 
                     src={gifUrl || url}
                     alt='gif'
                     className='w-full h-6 h-64 2xl:h-96 rounded-md shadow-lg object-cover'
                  /> */}
      </div>
   )
}


const Traceability = () => {

   var [productInfo, setProductInfo] = useState([]);

   var arrayData = [];

   useEffect(() => {
      const db = getDatabase();
      const recentPostsRef = query(ref(db, 'Butterhead Lettuce/'));
      onValue(recentPostsRef, (snapshot) => {
         snapshot.forEach((childSnapshot) => {
            const childKey = childSnapshot.key;
            const childData = childSnapshot.val();

            arrayData.splice(arrayData.length, 0, childData);
            Object.assign({}, arrayData);
         });
         setProductInfo(arrayData);
      }, {
         onlyOnce: true
      });
   }, []);

   console.log({ productInfo: productInfo });

   return (
      <div className='flex w-full justify-center items-center 2xl:px-20 bg-custom-traceability'>
         <div className='flex flex-col md:p-12 py-12 px-4'>
            <div className='flex-wrap justify-center items-center mt-5'>
               {productInfo.slice(0).reverse().map((transaction, i) => (
                  <TransactionCard key={i} {...transaction} />
               ))}
            </div>
         </div>
      </div>
   );
}

export default Traceability