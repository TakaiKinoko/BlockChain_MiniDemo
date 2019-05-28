# BlockChain_MiniDemo

### Reference
[kauri.io tutorial article](
 https://kauri.io/article/92034a0c23ed4cb4a6ca959e0a4b78b9?utm_campaign=ConsenSys%20Newsletter&utm_source=hs_email&utm_medium=email&utm_content=72818337&_hsenc=p2ANqtz-97ZLpmpSnvFmkouThG-CZUBBFpaq7Bp06gGqzfqEPthg6DK7tGrkPdvAecTpAD5bXWl7kwAOIlJyQkYEpMpkd_dVa0b1rUbt9b4Zanw1FegeVfHyw&_hsmi=72818337#settingup)

### BlockChain Set-up
```
npm install
npm install crypto-js --save
npm install mocha --save   //(point to node_modules dir)
```

### Testing (Blockchain)
-- point to root dir
```
./node_modules/mocha/bin/mocha test
```

### Network Set-up
(point to node_modules dir)
```
npm install express --save  // enable api with express
npm install body-parse --save // parse request arguments
npm install multer --save // parse request arguments
```
Each node in the network has its own express endpoints and we use the url-parse package to parse the peer and add its host to the peers set:
```
npm install url-parse --save
```

### Testing (Network)
In order to test the blockchain network we need to be able to connect to the API over HTTP. **curl** is used in this tutorial, *Postman* also works.

* start the server
```
node src/server.js
```
Should start successfully a server listening on port 5000.

* mine a new block
call the **/mine** endpoint.In a new terminal tab, run the following curl command: 
```
curl -X POST "localhost:5000/mine" -H 'Content-Type: application/json' -d'
{
    "data": "Mine block no 1"
}
'
```
* use /blocks endpoint to confirm blocks mined 
```
curl -X GET "localhost:5000/blocks" -H 'Content-Type: application/json'
```
So far we have a node running on a machine with 2 blocks (or more, depending on how many times the curl POST command was ran)

* start up another server on a different port
```
node src/server.js port=5001
```

* add the first node to the new server as a peer using the **/peers/add** endpoint
```
curl -X POST "localhost:5001/peers/add"  -H 'Content-Type: application/json' -d'
{
    "peers":  ["http://localhost:5000"]
}
'
```

* mine a new block on the second node
```
curl -X POST "localhost:5001/mine" -H 'Content-Type: application/json' -d'
{
    "data": "Mine block on second server"
}
'
```

* now we have nodes in the network, where the second one is a fork from the genesis block. Time to move onward to the **consensus** mechanism.

### Consensus 
**longest valid chain rule** in the network the valid chain with the most work is recognised as the main chain. All new blocks would thus be added to this by any other node in the network
Add: 
1. A new endpoint to our API /peers/check
1. A new function to our blockchain class checkLongestChain which is called via the API and return true if our set of blocks is the longest chain
1. A new function in our consensus implementation checkLongestChain which called the /blocks endpoint for each peer and checks the length of their chain

Install the node-fetch package
```
npm install node-fetch --save
```

### More Testing 
Start node 1 server: 
```
node src/server.js
```

Mine a few blocks (say 2):
```
curl -X POST "localhost:5000/mine" -H 'Content-Type: application/json' -d'
{
    "data": "Mine a block on node 1"
}
'
```

Start node 2 server:
```
node src/server.js port=5001
```
Add nodes as peers of each other 
```
curl -X POST "localhost:5000/peers/add"  -H 'Content-Type: application/json' -d'
{
    "peers":  ["http://localhost:5001"]
}
'
curl -X POST "localhost:5001/peers/add"  -H 'Content-Type: application/json' -d'
{
    "peers":  ["http://localhost:5000"]
}
'
```

Call /peers/check on node 2: (this will result in the chain on node 2 being replaced with the chain on node 1)
```
curl -X GET "localhost:5001/peers/check" 
```

Mine a new block on node 2 would now mean adding block number 4
```
curl -X POST "localhost:5001/mine" -H 'Content-Type: application/json' -d'
{
    "data": "Mine a block on node 2"
}
'
```
