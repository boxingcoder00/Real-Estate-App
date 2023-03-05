// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "./Token.sol";
import "@openzepplin/contracts/utils/math/SafeMath.sol";
import "@openzepplin/contracts/security/ReentryGuard.sol";

interface IReceiver {
    function receiveTokens(address tokenAdress, uint256 amount)
}


contract FlashLoan {
    using SafeMath for uint256;

    Token public token;
    uint256 public poolBalance;

    constructor(address _tokenAddress) public {
        token = Token(_tokenAddress);
    }

    function depositTokens(uint256 _amount) external {
        require(_amount > 0, "Must deposit at least one token");
        token.transferFrom(msg.sender, address(this), _amount);
        poolBalance = poolBalance.add(amount);
    }

    function flashLoan(uint256 _borrowAmount)external {
       require(borrowAmount > 0, "Must burrow at least 1 token");
    
    uint256 balanceBefore = token.balanceOf(address(this));
    require(balanceBefore >= _borrowAmount, "Not enough tokens in pool");
    function flashLoan(uint256 _borrowAmount) external {
       
       // Ensured by the protocol via the `deposittokens` function
       assert(poolBalance == balanceBefore);
       
        // Send tokens to receiver
        toke.transfer(msg.sender, _borrowAmount);

        // Get paid back
        IReceiver(msg.sender)receiveTokens(address(token), _borrowAmount);

        // Ensure loan pain back
        uint256 balanceAfter = token.balanceOf(address(this));
        require(balanceAfter >= balanceBefore, "Flash loan hasnt been paid back");
    }

}