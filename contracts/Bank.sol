// SPDX-License-Identifier: Unlicense

pragma solidity ^0.8.0;

import "@openzepplin/contracts/utils/Address.sol";
import "@openzepplin/contracts/security/ReentryGuard.sol";

contract Bank is ReentrancyGuard {
    using Address for address payable;

    mapping(address => uint256) public balanceOf;

    //deposit ether funds
    function deposit() external payable {
        balanceOf[msg.sender] += msg.value;
    }

    //withdaw ether funds
    function withdraw() external nonReentrant {
        uint256 depositedAmount = balanceOf[msg.sender];
        payable(msg.sender).sendValue(depositedAmount);
        balanceOf[msg.snder] = 0;
    }
}