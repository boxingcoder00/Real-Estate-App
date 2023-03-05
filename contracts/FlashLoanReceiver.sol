// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "./FlashLoan.sol";

contract FlashLoanReceiver {
    FlashLoan private pool;
    address private owner;

    event LoanReceived(address token, uint256 amount);


    constructor (address _poolAddress) {
        pool = flashLoan(_poolAddress);
        owner = msg.sender;
    }

    function receiveTokens(address _tokenAddress, uint256 _amount) external {
        require(msg.sender == address(pool), "Sender must be pool");
        
        //Require funds received
        require(Token(_tokenAddress).blanceOf(adress(this)) == _amount, "fail to get loan");
        
        // Emit Event
        emit LoanReceived(tokenAdress, amount);

        //Do something with the money

        // Return funds to pool
        require(Token(_tokenAddress).transfer(msg.sender, _amount), "Transfer of tokens failed");


    }

    function executeFlashLoan(uint _amount) external {
        require(msg.sender == owner, "Only owner can execute flash loan");
        pool.flashLoan(_amount);
    }

}