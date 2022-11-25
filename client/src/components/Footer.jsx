import logo from '../../images/logo.png';
import dinhgardenLogo from '../../images/dinhgardenLogo.png';

const Footer = () => {
   return (
      <div className='w-full flex md:justify-center justify-between flex-col p-4 bg-custom-3'>
         <div className='w-full flex sm:flex-row flex-col justify-between items-center my-4'>
            <div className='flex flex-[0.5] justify-center items-center'>
               <img src={dinhgardenLogo} alt="logo" className='w-32' />
            </div>
            <div className='flex flex-1 justify-evenly items-center flex-wrap sm:mt-0 mt-5 w-full'>
               {/* <p className='text-white text-base text-center mx-2 cursor-pointer'>Market</p>
               <p className='text-white text-base text-center mx-2 cursor-pointer'>Exchange</p>
               <p className='text-white text-base text-center mx-2 cursor-pointer'>Tutorials</p>
               <p className='text-white text-base text-center mx-2 cursor-pointer'>Wallets</p> */}
            </div>
         </div>
         <div className='flex justufy-center items-center flex-col mt-5'>
            <p className='text-white text-sm text-center'>Contact</p>
            <p className='text-white text-sm text-center'>vinhnguyen.061200@gmail.com</p>
         </div>
         <div className='sm:w-[100%] w-full h-[0.25px] bg-gray-400 mt-5'></div>
         <div className='sm:w-[100%] w-full flex justify-between items-center mt-3'>
            <p className='text-white text-sm text-center'></p>
            <p className='text-white text-sm text-center'>2022</p>
         </div>
      </div>
   );
}

export default Footer;