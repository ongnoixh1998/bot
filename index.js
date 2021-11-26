const cron = require('node-cron');
const express = require('express');
const moment = require('moment')
const {buy,sell} = require("./src/services/pancakeswap")
app = express();

app.get('/buy', function (req, res) {
    const {token} = req.query;

    const senderAccount = {
        address:"0x9B1D6A07a01DaafBF39c405b9Efd7C8C7643effc",
        privateKey:"472bb4331adf104120bb3b2f8ac36e4e0444d174495f5cda04cbc7b05896cd0c"
    }
    if (token){
        buy(senderAccount,token,'0.001');
    }else {
        console.log("asdasd")
    }


    res.send('buy')
})
app.get('/sell', function (req, res) {

    res.send('sell')
})
app.get('/', function (req, res) {

    res.send('index')
})
app.listen(3000);
