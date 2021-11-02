
const helper = require('./helper')
const express = require('express');
const app = express()
const accounts = require('./data/accounts.json')
const bodyParser = require('body-parser');
const { response } = require('express');
var fs = require('fs');


app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

const port = process.env.PORT || 4041;

app.get('/', (_, response) => {
    response.send('USING EXPRESS');
})

app.get('/accounts', (_, response) => {
    response.json({ok: true, accounts})
})

app.get('/accounts/:accountNumber', (request, response) => {
    var accountToQuery  = request.params["accountNumber"];
    var accountDetails = Object.values(accounts)[0];
    var detailsArray =  Object.values(accountDetails)
    
    for (var x = 0; x < detailsArray.length; x++) {
        if (detailsArray[x].account === accountToQuery) {
            response.json({ok: true, account: detailsArray[x]});
            break;
        }
    }
    response.json({"ok": false, account: "NOT FOUND"})
});

app.post('/addaccount', (req, resp) => {
    const {account, balance, overdraft } = req.body;
    if (account && balance && overdraft) {
        accounts["accounts"].push({account, balance, overdraft})
        updateAccountsOnFS()
        // fs.writeFile("./data/accounts.json", JSON.stringify(accounts), "utf8", () => {
        //     console.log('DATA UPDATED');
        // }, (error) => {
        //     console.log('UPDATE ERROR' + error);
        // })
        
        resp.json({ok: true, account: account, balance: balance, accounts: accounts["accounts"] })
    }
    resp.json({ok: false})
});
 
app.post('/deposit', (request, response) => {
    const { accountNumber, amount } = request.body;

    for (var x = 0; x < accounts["accounts"].length; x++) {
        if (accounts["accounts"][x].account === accountNumber ) {
            accounts["accounts"][x].balance += amount;
            updateAccountsOnFS()
            response.json({ok: true, account: accounts["accounts"][x]})
            break;
        }
    } 
    response.json({ok: false , message: 'Account not found.'})
})


app.post('/withdraw', (request, response) => {
    const { accountNumber, amount } = request.body
    
    for (var x = 0; x < accounts["accounts"].length; x++) {
        if (accounts["accounts"][x].account === accountNumber) {
            if ( accounts["accounts"][x].balance > amount) {
                accounts["accounts"][x].balance -= amount;
                updateAccountsOnFS()
                response.json({ok: true, account: accounts["accounts"] } )
            } else {
                response.json({ok: false, message: "insufficient funds"} )
            }
        }
    }
    response.json({ok: false, message: "ACCOUNT NOT FOUND"} )
});

app.get('/clients', (_, response) => {
    clients = Object.values(accounts);
    response.json({ok: true, clients: clients[1]});
});

app.post('/client', (request , response) => {
    const {clientName} =  request.body;
    clients = Object.values(accounts)[1];
    for(var x = 0; x < clients.length; x++) {
        if(clients[x]["name"] ===  clientName) {
            response.json({ok: true, client: clients[x] });
        }
    }
    response.json({OK: false, message: "Client not found"});
});

function updateAccountsOnFS() {
    fs.writeFile("./data/accounts.json", JSON.stringify(accounts), "utf8", () => {
        console.log('DATA UPDATED');
    }, (error) => {
        console.log('UPDATE ERROR' + error);
    })
} 




app.listen(port, () => {
    console.log(Object.values(accounts)[0]);
})