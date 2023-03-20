import React, { useEffect, useState } from "react";
import { ethers } from 'ethers';

import { contractABI, contractAddress } from '../utils/constants';

export const TransactionContext = React.createContext();

import { getDatabase, ref, child, get, set, onValue, query, push } from 'firebase/database';
import { database } from '../config/firebase';

const { ethereum } = window;

const getEthereumContract = () => {
   const provider = new ethers.providers.Web3Provider(ethereum);
   const signer = provider.getSigner();
   const transactionContract = new ethers.Contract(contractAddress, contractABI, signer);

   console.log(transactionContract);
   return transactionContract;
}

export const TransactionProvider = ({ children }) => {

   const [ currentAccount, setCurrentAccount ] = useState('');
   const [ formData, setFormData ] = useState({ addressTo: '', amount: '0.0000', action: '', planttype: '', harvest: '', disease: '', healthstatus: '', note: '', });
   const [ isLoading, setIsLoading ] = useState(false);
   const [ transactionCount, setTransactionCount ] = useState(localStorage.getItem('transactionCount'));
   const [ transactions, setTransactions ] = useState([]);
   const [ hash, setHash ] = useState('');

   const handleChange = (e, name) => {
      setFormData((prevState) => ({ ...prevState, [name]: e.target.value }))
   }

   const getAllTransactions = async () => {
      try {
         if(!ethereum) return alert("Please install metamask");

         const transactionContract = getEthereumContract();

         const availableTransactions = await transactionContract.getAllTransactions();

         const structuredTransactions = availableTransactions.map((transaction) => ({
            addressTo: transaction.receiver,
            addressFrom: transaction.sender,
            timestamp: new Date(transaction.timestamp.toNumber() * 1000).toLocaleString(),
            amount: parseInt(transaction.amount._hex) / (10 ** 18), //0000200 000 000 000 000
            action: transaction.action,
            planttype: transaction.planttype,
            harvest: transaction.harvest,
            disease: transaction.disease,
            healthstatus: transaction.healthstatus,
            note: transaction.note,
         }))

         console.log(structuredTransactions);

         setTransactions(structuredTransactions);
      } catch (error) {
         console.log(error)
      }
   }


   const checkIfWalletConnected = async () => {
      try {
         if(!ethereum) return alert("Please install Metamask or Click 'Ok' for traceability");

         const accounts = await ethereum.request({ method: 'eth_accounts' });
         console.log(accounts);
         if(accounts.length) {
            setCurrentAccount(accounts[0]);

            getAllTransactions();
            
         } else {
            console.log("No accounts found")
         }
         
      } catch (error) {
         console.log(error);

         throw new Error("(1) No ethereum object.")
      }

   }

   const checkIfTransactionsExist = async () => {
      try {
         const transactionContract = getEthereumContract();
         const transactionCount = await transactionContract.getTransactionCount();

         window.localStorage.setItem("transactionCount", transactionCount);

      } catch (error) {
         console.log(error);
         throw new Error("checkIfTransactionsExist: No ethereum object.")
      }
   }

   const connectWallet = async() => {
      try {
         if(!ethereum) return alert("Please install metamask");
         const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
         setCurrentAccount(accounts[0]);
         
      } catch (error) {
         console.log(error);

         throw new Error("(2) No ethereum object.")
      }
   }

   const sendTransaction = async () => {
      try {
         if(!ethereum) return alert("Please install metamask");
         // action, planttype, harvest, disease, healthstatus, note
         const { addressTo, amount, action, planttype, harvest, disease, healthstatus, note } = formData;
         const transactionContract = getEthereumContract();
         const parseAmount = ethers.utils.parseEther(amount);


         await ethereum.request({
            method: 'eth_sendTransaction',
            params: [{
               from: currentAccount,
               to: addressTo,
               gas: '0x5208', // 21000 GWEI (! GWEI is a sub unit of ETH)
               value: parseAmount._hex, // 0.00001
            }]
         });

         const transactionHash = await transactionContract.addToBlockchain(addressTo, parseAmount, action, planttype, harvest, disease, healthstatus, note);

         setIsLoading(true);
         setHash(transactionHash.hash)
         console.log(`Loading - ${transactionHash.hash}`);
         const db = getDatabase();
         const traceabilityRef = ref(db, `${formData.planttype}/`);
         const newPostRef = push(traceabilityRef);
         console.log({traceabilityRef:traceabilityRef});
         set(newPostRef, {
            TransactionHash: transactionHash.hash, 
            addressFrom: currentAccount,
            addressTo: formData.addressTo,
            amount: formData.amount,
            action: formData.action,
            planttype: formData.planttype,
            harvest: formData.harvest,
            disease: formData.disease,
            healthstatus: formData.healthstatus,
            note: formData.note,
            timestamp: new Date().toLocaleString(),
         });
         await transactionHash.wait();
         setIsLoading(false);
         console.log(`Success - ${transactionHash.hash}`);

         const transactionCount = await transactionContract.getTransactionCount();

         setTransactionCount(transactionCount.toNumber());

         location.reload();

      } catch (error) {
         console.log(error);

         throw new Error("3 No ethereum object.")
      }
   }


   useEffect(() => {
      checkIfWalletConnected();
      checkIfTransactionsExist();
   }, [transactionCount]);
   
   return (
      <TransactionContext.Provider value={{ connectWallet, currentAccount, formData, setFormData, handleChange, sendTransaction, transactions, isLoading, hash }}>
         {children}
      </TransactionContext.Provider>
   );
}