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