import React, { useContext } from 'react';
import { TransactionContext } from '../context/TransactionContext';

import { shortenAddress } from '../utils/shortenAddress';


const TransactionCard = ({ addressTo, addressFrom, amount, timestamp, action, planttype, harvest, disease, healthstatus, note, url }) => {
   
   return (
      <div className='bg-[#FFF] m-4 flex flex-1 2xl:min-w-[1000px]
         2xl:max-w-[500px]
         sm:min-w-[270px]
         sm:max-w-[300px]
         flex-col p-3 rounded-md hover:shadow-2xl
      '>
         <div className='flex flex-col items-center w-full mt-3 bg-custom-2 rounded-md'>
            <div className='w-full mb-6 p-2'>
               <a href={`https://goerli.etherscan.io/address/${addressFrom}`} target='_blank' rel='noopener noreferrer'>
                  <p className='text-white text-base'>
                     From: {shortenAddress(addressFrom)}
                  </p>
               </a>
               <a href={`https://goerli.etherscan.io/address/${addressTo}`} target='_blank' rel='noopener noreferrer'>
                  <p className='text-white text-base'>
                     To: {shortenAddress(addressTo)}
                  </p>
               </a>
               {/* <p className='text-white text-base'>
                  Amount: {amount} ETH
               </p> */}
               {action && (
                  <>
                     <br />
                     <p className='text-white text-base'>Action: {action}</p>
                     <p className='text-white text-base'>Plant type: {planttype}</p>
                     <p className='text-white text-base'>Harvest: {harvest}</p>
                     <p className='text-white text-base'>Disease: {disease}</p>
                     <p className='text-white text-base'>Health status: {healthstatus}</p>
                     <p className='text-white text-base'>Note: {note}</p>
                  </>
               )}

            </div>
                  {/* <img 
                     src={gifUrl || url}
                     alt='gif'
                     className='w-full h-6 h-64 2xl:h-96 rounded-md shadow-lg object-cover'
                  /> */}

               <div className='bg-black p-3 px-5 w-max rounded-3xl -mt-5 shadow-2xl'>
                  <p className='text-[#37c7da] font-bold'>
                     {timestamp}
                  </p>
               </div>
         </div>
      </div>
   )
}

const Transactions = () => {
   const { currentAccount, transactions } = useContext(TransactionContext)
   console.log({transactions:transactions});
   return (
      <div className='flex w-full justify-center items-center 2xl:px-20 bg-custom'>
         <div className='flex flex-col md:p-12 py-12 px-4'>
            {currentAccount ? (
               <h3 className='text-white text-3xl text-center my-2 mt-20 sm:mt-[140px]'>Product Information</h3>
            ) : (
               <h3 className='text-white text-3xl text-center my-2 mt-20 h-[1000px]'>Connect your account to see the updated info</h3>
            )}
            <div className='flex-wrap justify-center items-center mt-5'>
               {transactions.slice(0).reverse().map((transaction,  i) => (
                  <TransactionCard key={i} {...transaction} />
               ))}
            </div>
         </div>
      </div>
   );
}

export default Transactions