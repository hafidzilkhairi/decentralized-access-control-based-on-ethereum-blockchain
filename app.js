const express = require('express')
const app = express()
const Web3 = require('web3')
const solidity = require('./build/contracts/ControlAccessManagement.json')
const port = 3000
const rpcUrl = "http://127.0.0.1:7545"
const web3 = new Web3(rpcUrl)
const contractAddress = "0x99Bdd53be13181C8317C2ae0344436bE2986b1D8"
const contract = new web3.eth.Contract(solidity.abi, contractAddress)
// contract.methods.createPolicy("", "", "", false).call((err, result) => {
//     console.log(err)
//     console.log(result)
// })
// contract.methods.policies(0).call((err, result) => {
//     console.log(err)
//     console.log(result)
// })

const response = {
    message: "",
    data: [],
    total: 0
}

app.get('/api/v1/policies', async (req, res) => {
    const query = req.query
    if (!(query.pageNumber && query.itemAmount)) {
        res.status(400)
        res.send()
        return
    }
    var totalData = 0;
    await contract.methods.policyCount().call((err, result) => {
        totalData = parseInt(result) + 1;
    })
    if (!(totalData > (query.pageNumber - 1) * query.itemAmount)) {
        res.status(400)
        response.message = "Data amount doesn't satisfy current query";
        res.send(response);
        return
    }
    var data = [];
    var startFor = (query.pageNumber - 1) * query.itemAmount;
    var endFor = query.pageNumber * query.itemAmount < totalData ? query.pageNumber * query.itemAmount : totalData;
    var isError = false;
    for (let i = startFor; i < endFor; i++) {
        await contract.methods.policies(i).call((err, result) => {
            if (err) {
                isError = true;
            }
            data.push(result)
        })
        if (isError) {
            response.message = "Something wrong"
            res.status(500)
            res.send()
            return
        }
    }
    response.data = data
    response.total = totalData
    res.send(response)
    return
})

app.get('/api/v1/activity-logs', async (req, res) => {
    const query = req.query
    if (!(query.pageNumber && query.itemAmount)) {
        res.status(400)
        res.send()
        return
    }
    var totalData = 0;
    await contract.methods.activityLogCount().call((err, result) => {
        totalData = parseInt(result) + 1;
    })
    if (!(totalData > (query.pageNumber - 1) * query.itemAmount)) {
        res.status(400)
        response.message = "Data amount doesn't satisfy current query";
        res.send(response);
        return
    }
    var data = [];
    var startFor = (query.pageNumber - 1) * query.itemAmount;
    var endFor = query.pageNumber * query.itemAmount < totalData ? query.pageNumber * query.itemAmount : totalData;
    var isError = false;
    for (let i = startFor; i < endFor; i++) {
        await contract.methods.activityLogs(i).call((err, result) => {
            if (err) {
                isError = true;
            }
            data.push(result)
        })
        if (isError) {
            response.message = "Something wrong"
            res.status(500)
            res.send()
            return
        }
    }
    response.data = data
    response.total = totalData
    res.send(response)
    return
})

app.get('/api/v1/permission', (req, res) => {
    const query = req.query
    if (query.deviceId, query.activity, query.requester) {
        contract.methods.createActivityLog
        contract.methods.getIndex(query.deviceId, query.activity, query.requester).call((err, result) => {
            if (err) {
                res.status(500)
                res.send(err)
                return
            }
            if (result == -1) {
                res.status(403)
                res.send()
                return
            }
            res.send(result)
            return
        })
        return
    }
    res.send('Hello World!')
    return
})

app.listen(port, () => console.log(`App listening at http://0.0.0.0:${port}`))