import React from 'react';


const commonStyles = "min-h-[70px] sm:px-0 px-2 sm:min-w-[120px] flex justify-center items-center border-[0.5px] border-gray-400 text-sm font-light text-white";

const Home = () => {

   return (
      <div className='bg-custom-welcome flex w-full justify-center items-center'>
         <div className='flex mf:flex-row flex-col items-start justify-between md:p-20 py-12 px-4'>
            <div className='flex flex-1 justify-start flex-col mf:mr-10'>
               <h1 className='h-[100px] sm:text-7xl text-white text-gradient py-1 sm:mt-[50px] text-3xl sm:h-[200px] fadeInLeft mt-[50px] welcome-to-my-garden-text'>
                  Hello! I'm Dinh <br /> Welcome to my garden
               </h1>

               <div className='grid sm:grid-cols-3 grid-cols-2 w-full mt-10'>
                  <div className={`rounded-tl-2xl ${commonStyles}`}>
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
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
}

export default Home;