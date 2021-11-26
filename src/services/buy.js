const fs = require('fs')
const Tx = require('ethereumjs-tx').Transaction;
const Web3 = require('web3')
const Common = require('ethereumjs-common').default;
const web3 = new Web3(new Web3.providers.HttpProvider('https://bsc-dataseed.binance.org/'))
const BSC_FORK = Common.forCustomChain(
    'mainnet',
    {
        name: 'Binance Smart Chain Mainnet',
        networkId: 56,
        chainId: 56,
        url: 'https://bsc-dataseed.binance.org/'
    },
    'istanbul',
);
/** sender */
const senderAccount = {
    address:"0x9B1D6A07a01DaafBF39c405b9Efd7C8C7643effc",
    privateKey:"472bb4331adf104120bb3b2f8ac36e4e0444d174495f5cda04cbc7b05896cd0c"
}


const buyOnlyone = async ()=> {
    const amountToBuyWith = web3.utils.toHex(web3.utils.toWei('1','ether'));
    const privateKey = Buffer.from(senderAccount.privateKey, 'hex')  ;
    const tokenAddress = '0xe9e7cea3dedca5984780bafc599bd69add087d56'; // ONLYONE contract address
    const WBNBAddress = '0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c'; // WBNB token address
    const amountOutMin = '100' + Math.random().toString().slice(2,6);
    const pancakeSwapRouterAddress = '0x10ed43c718714eb63d5aa57b78b54704e256024e';
    const routerAbi = JSON.parse(fs.readFileSync('pancake-router-abi.json', 'utf-8'));
    const contract = new web3.eth.Contract(routerAbi, pancakeSwapRouterAddress, {from: senderAccount.address});
    const data = contract.methods.swapExactETHForTokens(
        web3.utils.toHex(amountOutMin),
        [tokenAddress,WBNBAddress ],
        senderAccount.address,
        web3.utils.toHex(Math.round(Date.now()/1000)+60*20),
    );

    const count = await web3.eth.getTransactionCount(senderAccount.address);
    const rawTransaction = {
        "from":senderAccount.address,
        "gasPrice":web3.utils.toHex(5000000000),
        "gasLimit":web3.utils.toHex(290000),
        "to":pancakeSwapRouterAddress,
        "value":web3.utils.toHex(amountToBuyWith),
        "data":data.encodeABI(),
        "nonce":web3.utils.toHex(count)
    };

    const transaction = new Tx(rawTransaction, { 'common': BSC_FORK });
    transaction.sign(privateKey);

    const result = await web3.eth.sendSignedTransaction('0x' + transaction.serialize().toString('hex'));

    return result;
}


