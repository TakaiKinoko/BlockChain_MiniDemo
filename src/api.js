/* Four methods to create API
    --/mine a post which takes a single argument data and creates and mines a new block
    --/blocks a get which returns all the blocks in our node
    --/peers/add a post which takes a single argument peers and registers the peers with our node
    --/peers a get which returns all the peers added to our node
 */

"use strict";

(async () => {

    // import dependencies
    const express = require('express');
    const bodyParser = require('body-parser');
    const multer = require('multer');

    // takes blockchain class and creates the API endpoints which our node server uses
    function getAPI(blockchain) {
        // create express app, then use nulter and bodyparser to setup json request
        var app = express();
        const requestParser = multer();
        app.use(bodyParser.json());

        // add a /mine POST endpoint to the express app
        app.post('/mine', requestParser.array(), (req, res) => {
            const { data } = req.body || {};
            // check if data is empty
            if (!data) {
                res.status(400).send('Error: Must set data in request');
                return;
            }
            
            // use blockchain object to create and mine a new block using the newBlock function
            let block = blockchain.newBlock(data);
            // set the response of the request to be the contents of the block object and send response
            const response = {
                message: 'Mined new block',
                ...block
            };

            res.status(201).send(response);
        });

        // add a /blocks GET endpoint to the express app
        app.get('/blocks', (req, res) => {
            // construct a response object which returns the blocks array in the blockchain object and also the length
            const response = {
                blocks: blockchain.blocks,
                count: blockchain.blocks.length
            };

            res.send(response);
        });

        // add a /peers GET endpoint to the express app
        app.get('/peers', (req, res) => {
            // construct a response object which returns the peers array in the blockchain object and also the length
            const response = {
                peers: blockchain.peers,
                count: blockchain.peers.length
            };

            res.send(response);
        });

        app.post('/peers/add', requestParser.array(), (req, res) => {
            // check that the request parameters are valid and that peers is not empty
            const { peers } = req.body || [];

            if (!peers) {
                res.status(400).send('Error: Must supply list of peers in field peers');
                return;
            }

            // use blockchain object to register each peer to the node
            peers.forEach((peer) => {
                blockchain.registerPeer(peer);
            });

            // set the response of the request to be the contents of our block.peers object and send the response
            const response = {
                message: 'New peers have been added',
                peers: JSON.stringify([...blockchain.peers]),
                count: blockchain.peers.size
            };

            res.status(201).send(response);
        });

        return app;
    }

    module.exports = {
        getAPI
    }
})();