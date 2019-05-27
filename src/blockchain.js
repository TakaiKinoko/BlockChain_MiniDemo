"use strict";

(async () => {

    // first import the files we need
    const Consensus = require('./consensus')
    const Utils = require("./utils");
    const parse = require('url-parse');

    // constructor -- generate genesis block 
    function Blockchain(consensus, blocks) {
        this.blocks = [] //the chain of blocks!
        if (blocks) {
            this.blocks = blocks;
        }
        this.peers = new Set(); // list of unique peers in the network
        this.consensus = consensus;
        //Create the genesis block
        this.newBlock("I am genesis!")
    }

    Blockchain.prototype.newBlock = function (data) {
        let previousBlockHash = "";        // since this is the first block, it doesn't have a previousBlockHash to link to
        let newBlockNumber = 0
        // if this is not the genesis block
        if (this.blocks.length > 0) {
            // set the hash to that of the previous block in the blocks array 
            previousBlockHash = this.blocks[this.blocks.length - 1].hash;
            newBlockNumber = this.blocks.length;
        }

        /* Since our blockchain will exist in a network we need to have some method to determine:
            1. when a new block is allowed to be added to the chain and by whom
            2. which chain is correct when there are conflicts 

            Use CONSENSUS algorithm to determine the above two points. 
            This is why adding a new block requires mining of a new block. 
        */
        let block = this.consensus.mineBlock(newBlockNumber, data, previousBlockHash);
        this.blocks.push(block);
        return block;
    }

    Blockchain.prototype.isValid = function () {
        let currentblockNumber = 1; //start after the genesis block (blockNumber=0)
        while (currentblockNumber < this.blocks.length) {
            const currentBlock = this.blocks[currentblockNumber];
            const previousBlock = this.blocks[currentblockNumber - 1];

            // Check that previousBlockHash is correct
            if (currentBlock.previousBlockHash !== previousBlock.hash) {
                return false;
            }

            // check that the current blockHash is correct
            if (currentBlock.hash !== Utils.calculateHash(currentBlock)) {
                return false;
            }

            // Check that the nonce (proof of work result) is correct
            if (!this.consensus.validHash(currentBlock.hash)) {
                return false;
            }
            currentblockNumber++;
        }

        return true;
    }

    // Each node in the network has its own express endpoints and we use the url-parse package to parse the peer and add its host to the peers set
    Blockchain.prototype.registerPeer = function (address) {
        const host = parse(address).host;
        this.peers.add(host);
        console.log("Registered peer: " + host)
    }

    module.exports = Blockchain;
})();