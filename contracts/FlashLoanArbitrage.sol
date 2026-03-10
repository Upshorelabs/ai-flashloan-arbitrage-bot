// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IRouter{
 function swapExactTokensForTokens(
 uint amountIn,
 uint amountOutMin,
 address[] calldata path,
 address to,
 uint deadline
 ) external returns (uint[] memory amounts);
}

contract FlashLoanArbitrage{

 address public owner;

 constructor(){
 owner = msg.sender;
 }

 modifier onlyOwner(){
 require(msg.sender == owner);
 _;
 }

 function executeArbitrage(
 address router1,
 address router2,
 address tokenA,
 address tokenB,
 uint amount
 ) external onlyOwner{

 address;

 path[0] = tokenA;
 path[1] = tokenB;

 IRouter(router1).swapExactTokensForTokens(
 amount,
 1,
 path,
 address(this),
 block.timestamp
 );

 path[0] = tokenB;
 path[1] = tokenA;

 IRouter(router2).swapExactTokensForTokens(
 amount,
 1,
 path,
 address(this),
 block.timestamp
 );

 }

}
