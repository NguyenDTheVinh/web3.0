//SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

contract Transactions {
   uint256 transactionCount;

   event Transfer(address from, address receiver, uint amount, uint256 timestamp, string action, string planttype, string harvest, string disease, string healthstatus, string note);

   struct TransferStruct {
      address sender;
      address receiver;
      uint amount;
      uint256 timestamp;
      string action;
      string planttype;
      string harvest;
      string disease;
      string healthstatus;
      string note;
   }

   TransferStruct[] transactions;

   function addToBlockchain(address payable receiver, uint amount, string memory action, string memory planttype, string memory harvest, string memory disease, string memory healthstatus, string memory note) public {
      transactionCount += 1;
      transactions.push(TransferStruct(msg.sender, receiver, amount, block.timestamp, action, planttype, harvest, disease, healthstatus, note));

      emit Transfer(msg.sender, receiver, amount, block.timestamp, action, planttype, harvest, disease, healthstatus, note);
   }

   function getAllTransactions() public view returns (TransferStruct[] memory) {
      return transactions;
   }

   function getTransactionCount() public view returns (uint256) {
      return transactionCount;
   }
}