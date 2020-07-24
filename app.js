const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const Web3 = require('web3')
const solidity = require('./build/contracts/ControlAccessManagement.json')
const port = 8000
const rpcUrl = "http://127.0.0.1:8585"
const web3 = new Web3(rpcUrl)
const contractAddress = "0xa140e13F9b6270963A95ed1A5376a08ae6E4b2ab"
const privKey = '5087a9fbb2e02e58fff959f153812072fc612288b4e76c1ca70e2c90afd40271'
const pubKey = "0x1be072c8A431c1F52CF9B3016B8B1ECcC6B37CBE"
const contract = new web3.eth.Contract(solidity.abi, contractAddress)
const account = web3.eth.accounts.privateKeyToAccount('0x' + privKey)
web3.eth.accounts.wallet.add(account)
web3.eth.Contract.defaultAccount = account.address


app.use(bodyParser.json())

const txOptions = {
    from: pubKey,
    gas: "800000",
    gasPrice: 2000000000
}

const responseDefault = () => {
    return rt = {
        message: "Success",
        data: [],
        total: 0
    }
}

app.use((req, res, next) => {
    let current_datetime = new Date();
    let formatted_date =
        current_datetime.getFullYear() +
        "-" +
        (current_datetime.getMonth() + 1) +
        "-" +
        current_datetime.getDate() +
        " " +
        current_datetime.getHours() +
        ":" +
        current_datetime.getMinutes() +
        ":" +
        current_datetime.getSeconds();
    let method = req.method;
    let url = req.url;
    let log = `[${formatted_date}] ${method}:${url}`;
    console.log(log);
    next();
})

app.get('/api/v1/policies', async (req, res) => {
    const response = responseDefault();
    const query = req.query
    if (!(query.pageNumber && query.itemAmount)) {
        response.message = 'Unsatisfied query'
        res.status(400)
        res.send(response)
        return
    }


    var totalData = 0, isError = false;
    const pgNumber = parseInt(query.pageNumber),
        itemAmount = parseInt(query.itemAmount),
        bottomLine = (pgNumber - 1) * itemAmount,
        topLine = pgNumber * itemAmount,
        data = []


    try {
        await contract.methods.policyCount().call((err, result) => {
            if (err) {
                isError = true
                return
            }
            totalData = parseInt(result) + 1;
        })
    } catch (error) {
        isError = true
    }
    if (isError) {
        res.status(500)
        response.message = "Something wrong"
        res.send(response)
        return
    }
    if (!(totalData > bottomLine)) {
        res.status(400)
        response.message = "Query of request doesn't satisfy current data";
        res.send(response);
        return
    }


    const startFor = bottomLine,
        endFor = topLine > totalData ? totalData : topLine


    for (let i = startFor; i < endFor; i++) {
        try {
            await contract.methods.policies(i).call((err, result) => {
                if (err) {
                    isError = true;
                }
                data.push(result)
            })
        } catch (error) {
            isError = true
        }
        if (isError) {
            response.message = "Something wrong"
            res.status(500)
            res.send(response)
            return
        }
    }

    response.data = data
    response.total = totalData
    res.send(response)
    return
})

app.get('/api/v1/activity-log', async (req, res) => {
    const response = responseDefault();
    const query = req.query
    if (!(query.pageNumber && query.itemAmount)) {
        response.message = "Unsatisfied query"
        res.status(400)
        res.send(response)
        return
    }


    var totalData = 0, isError = false;
    const pgNumber = parseInt(query.pageNumber),
        itemAmount = parseInt(query.itemAmount),
        bottomLine = (pgNumber - 1) * itemAmount,
        topLine = pgNumber * itemAmount,
        data = []


    try {
        await contract.methods.activityLogCount().call((err, result) => {
            if (err) {
                isError = true
                return
            }
            totalData = parseInt(result) + 1;
        })
    } catch (error) {
        isError = true
    }
    if (isError) {
        res.status(500)
        response.message = "Something wrong"
        res.send(response)
        return
    }
    if (!(totalData > bottomLine)) {
        res.status(400)
        response.message = "Query of request doesn't satisfy current data";
        res.send(response);
        return
    }


    const startFor = bottomLine,
        endFor = topLine > totalData ? totalData : topLine


    for (let i = startFor; i < endFor; i++) {
        try {
            await contract.methods.activityLogs(i).call((err, result) => {
                if (err) {
                    isError = true;
                }
                data.push(result)
            })
        } catch (error) {
            isError = true
        }
        if (isError) {
            response.message = "Something wrong"
            res.status(500)
            res.send(response)
            return
        }
    }
    response.data = data
    response.total = totalData
    res.send(response)
    return
})

app.post('/api/v1/permission', async (req, res) => {
    const query = req.body,
        response = responseDefault()
    var isError = false,
        isPermit = false,
        permission = false,
        totalData = 0

    if (!(query.deviceId, query.activity, query.requester)) {
        console.log(query)
        response.message = "Unsatisfied query"
        res.status(400)
        res.send(response)
        return
    }

    try {
        await contract.methods.policyCount().call((e, r) => {
            if (e) {
                isError = true;
            }
            totalData = parseInt(r) + 1
        })
    } catch (error) {
        isError = true;
    }
    if (isError) {
        response.message = "Something wrong"
        res.status(500)
        res.send(response)
        return
    }

    try {
        for (let i = 0; i < totalData; i++) {
            await contract.methods.policies(i).call((e, r) => {
                if (e) {
                    isError = true
                }
                if (query.deviceId == r.deviceId && query.activity == r.activity && query.requester == r.requester) {
                    idxPolicy = i
                    permission = r.permission
                }
            })
            if (isError) {
                break
            }
        }
    } catch (error) {
        console.log(error)
        isError = true;
    }
    if (isError) {
        response.message = "Something wrong"
        res.status(500)
        res.send(response)
        return
    }

    try {
        await contract.methods.createActivityLog(query.deviceId, query.activity, query.requester, permission).send(txOptions, (e, r) => {
            if (e) {
                isError = true
                return
            }
            isPermit = r
            return
        })
    } catch (error) {
        console.log(error)
        isError = true
    }
    if (isError) {
        response.message = "Something wrong"
        res.status(500)
        res.send(response)
        return
    }

    response.data = {
        deviceId: query.deviceId,
        activity: query.activity,
        requester: query.requester,
        permission: permission
    }
    response.message = permission ? "Allowed" : "Forbidden"
    res.status(permission ? 200 : 403)
    res.send(response)
    return
})

app.post('/api/v1/policies', async (req, res) => {
    const query = req.body,
        response = responseDefault()
    isError = false

    if (!(query.deviceId, query.activity, query.requester, query.permission)) {
        response.message = "Unsatisfied query"
        res.status(400)
        res.send(response)
        return
    }

    try {
        await contract.methods.createPolicy(query.deviceId, query.activity, query.requester, query.permission).send(txOptions, (e, r) => {
            if (e) {
                isError = true
                return
            }
        })
    } catch (error) {
        console.log(error)
        isError = true
    }
    if (isError) {
        response.message = "Something wrong"
        res.status(500)
        res.send(response)
        return
    }

    response.message = "Created"
    res.status(201)
    res.send(response)
    return
})

app.put('/api/v1/permission/:id', async (req, res) => {
    const idx = web3.eth.abi.encodeParameter('uint256', parseInt(req.params.id)),
        permission = req.body.permission,
        response = responseDefault()
    var totalData = 0,
        isError = false,
        isSucces = false

    try {
        await contract.methods.policyCount().call((e, r) => {
            if (e) {
                isError = true;
            }
            totalData = parseInt(r) + 1
        })
    } catch (error) {
        isError = true
    }
    if (isError) {
        response.message = "Something wrong"
        res.status(500)
        res.send(response)
        return
    }

    if (!(permission && typeof (permission) == 'boolean' && idx > -1 && idx < totalData)) {
        response.message = "Unsatisfied query"
        res.status(400)
        res.send(response)
        return
    }

    try {
        await contract.methods.changePolicy(idx, permission).send(txOptions, (e, r) => {
            if (e) {
                isError = true;
                return
            }
            isSucces = parseInt(r) == 0
        })
    } catch (error) {
        isError = true;
    }
    if (isError) {
        response.message = "Something wrong"
        res.status(500)
        res.send(response)
        return
    }

    response.message = "Success"
    res.send(response)
    return
})

// Grant a permission to activity log
app.put('/api/v1/activity-log/:id', async (req, res) => {
    const idx = web3.eth.abi.encodeParameter('uint256', parseInt(req.params.id)),
        query = req.body,
        response = responseDefault(),
        permission = query.permission
    var isSucces = false,
        isError = false,
        idxPolicy = -1,
        totalData = 0,
        activityLog = {}

    try {
        await contract.methods.activityLogCount().call((e, r) => {
            if (e) {
                isError = true;
            }
            totalData = parseInt(r) + 1
        })
    } catch (error) {
        isError = true
    }
    if (isError) {
        response.message = "Something wrong"
        res.status(500)
        res.send(response)
        return
    }

    if (!(permission && typeof (permission) == 'boolean' && idx > -1 && idx < totalData)) {
        response.message = "Unsatisfied query"
        res.status(400)
        res.send(response)
        return
    }

    try {
        await contract.methods.activityLogs(idx).call((e, r) => {
            if (e) {
                isError = true;
            }
            activityLog = r
        })
    } catch (error) {
        isError = true
    }
    if (isError) {
        response.message = "Something wrong"
        res.status(500)
        res.send(response)
        return
    }

    try {
        await contract.methods.policyCount().call((e, r) => {
            if (e) {
                isError = true;
            }
            totalData = parseInt(r) + 1
        })
    } catch (error) {
        isError = true;
    }
    if (isError) {
        response.message = "Something wrong"
        res.status(500)
        res.send(response)
        return
    }

    try {
        for (let i = 0; i < totalData; i++) {
            await contract.methods.policies(i).call((e, r) => {
                if (e) {
                    isError = true
                }
                if (activityLog.deviceId == r.deviceId && activityLog.activity == r.activity && activityLog.requester == r.requester) {
                    idxPolicy = i
                }
            })
            if (isError) {
                break
            }
        }
    } catch (error) {
        isError = true;
    }
    if (isError) {
        response.message = "Something wrong"
        res.status(500)
        res.send(response)
        return
    }


    if (idxPolicy < 0) {
        try {
            await contract.methods
                .createPolicy(activityLog.deviceId, activityLog.activity, activityLog.requester, permission)
                .send(txOptions, (e, r) => {
                    if (e) {
                        isError = true
                    }
                })
        } catch (error) {
            isError = true;
        }
        if (isError) {
            response.message = "Something wrong"
            res.status(500)
            res.send(response)
            return
        }
    } else {
        idxPolicy = web3.eth.abi.encodeParameter('uint256', parseInt(idxPolicy))
        try {
            await contract.methods.changePolicy(idxPolicy, permission).send(txOptions, (e, r) => {
                if (e) {
                    isError = true
                }
            })
        } catch (error) {
            isError = true;
        }
        if (isError) {
            response.message = "Something wrong"
            res.status(500)
            res.send(response)
            return
        }
    }

    response.message = "Success"
    res.send(response)
    return
})

// app.listen(port, () => console.log(`App listening at http://0.0.0.0:${port}`))

const https = require('https');
const fs = require('fs');

const options = {
    key: fs.readFileSync('key.pem'),
    cert: fs.readFileSync('cert.pem')
};

server = https.createServer(options, app)

server.listen(port, "0.0.0.0", 2, (e) => {
    console.log(`App listening at https://0.0.0.0:${port}`)
})