require("dotenv").config()

const { ethers } = require("ethers")
const axios = require("axios")

const provider = new ethers.JsonRpcProvider(process.env.RPC_URL)
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider)

const CONTRACT = process.env.CONTRACT_ADDRESS
const PROFIT = process.env.PROFIT_WALLET

const ABI = [
"function executeArbitrage(address,address,address,address,uint256)"
]

const contract = new ethers.Contract(CONTRACT, ABI, wallet)

const PANCAKE = "0x10ED43C718714eb63d5aA57B78B54704E256024E"
const BISWAP = "0x858e3312ed3a876947ea49d572a7c42de08af7ee"
const APESWAP = "0xC0788A3aD43d79aa53B09c2EaCc313A787d1d607"

async function getPrice(pair){

 const url = `https://api.dexscreener.com/latest/dex/pairs/bsc/${pair}`

 const res = await axios.get(url)

 return res.data.pair.priceUsd

}

async function scanArbitrage(){

 console.log("Scanning DEX markets...")

 try{

 const price1 = await getPrice("pancakeswap")
 const price2 = await getPrice("biswap")

 const diff = Math.abs(price1 - price2)

 console.log("Price difference:", diff)

 if(diff > 0.5){

 console.log("Arbitrage opportunity detected")

 const tx = await contract.executeArbitrage(
 PANCAKE,
 BISWAP,
 "0x55d398326f99059fF775485246999027B3197955",
 "0xBB4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c",
 ethers.parseUnits("100",18)
 )

 console.log("Trade sent:", tx.hash)

 }

 }catch(err){

 console.log("Scan error:", err.message)

 }

}

setInterval(scanArbitrage,15000)
