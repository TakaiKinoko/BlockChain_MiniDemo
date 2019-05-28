/* a simple version of the POW (proof of work) consensus algorithm. 
   
    The computation work is defined as a mathematical problem: 
        Find the number n (the nonce) which when hashed with the block data X gives Y number of leading 0's
    -- X: block data not including the nonce 
    -- n: the nonce we hash with the block data X. We need to try random values for n or increment n until we find a sol
    -- Y: the difficulty setting for the mathematical problem. The larger Y the longer it takes to find the correct value of n 

    It is important for the POW algorithm to find it difficult to find the solution to the problem, 
    but easy to verify when given a solution to the problem that it is correct.
*/ 

"use strict";

(async () => {

    const Block = require('./block');
    const Utils = require('./utils');
    const fetch = require('node-fetch');

    function Consensus() {
        this.difficulty = 5;
        //The difficultyRegex checks for difficulty number of leading 0s in the data, where the data is the computed hash
        this.difficultyRegex = new RegExp('^0{' + this.difficulty + '}')
    }

    Consensus.prototype.mineBlock = function (blockNumber, data, previousBlockHash) {
        let block = new Block(blockNumber, data, 0, previousBlockHash); //start the nonce at 0
        //while we have not got the correct number of leadings 0's (difficulty * 0) in our blockHash, keep incrementing the blocks nonce
        while (!this.validHash(block.hash)) {
            block.incrementNonce(); // since nonce is part of the block data, when it's updataed, the block hash also changes 
        }
        console.log("Mined new block: " + block.toString());
        return block;
    }

    Consensus.prototype.validHash = function (hash) {
        return this.difficultyRegex.test(hash);
    }

    Consensus.prototype.checkLongestChain = function (peers, length) {
        let promises = [];

        // for each peer registered, call the /blocks endpoint to retrieve their list of blocks
        peers.forEach((host) => {
            /*
            Wait for all the calls to return before we run the checks, 
            so add a fetch call for each peer to a list of promises which we resolve.
            */
            promises.push(
                fetch('http://' + host + '/blocks')
                    .then(res => {
                        if (res.ok) {
                            return res.json();
                        }
                    })
                    .then(json => json)
            );
        });

        // use Promise.all to resolve the list of promises and for each returned set of blocks, check if peer had a longer list of blocks, and if the list of blocks is valid
        return Promise.all(promises).then((chains) => {
            let newBlocks = null;
            let longestLength = length;

            chains.forEach(({ blocks }) => {
                // Check if the length is longer and the chain is valid
                if (blocks.length > longestLength && this.isChainValid(blocks)) {
                    longestLength = blocks.length;
                    newBlocks = blocks;
                }
            });

            return { isLongestChain: !newBlocks, newBlocks: newBlocks };
        });
    }

    Consensus.prototype.isChainValid = function (blocks) {
        let currentblockNumber = 1; //start after the genesis block (blockNumber=0)
        while (currentblockNumber < blocks.length) {
            const currentBlock = blocks[currentblockNumber];
            const previousBlock = blocks[currentblockNumber - 1];

            // Check that previousBlockHash is correct
            if (currentBlock.previousBlockHash !== previousBlock.hash) {
                return false;
            }
            // check that the current blockHash is correct
            if (currentBlock.hash !== Utils.calculateHash(currentBlock)) {
                return false;
            }
            // Check that the nonce (proof of work result) is correct
            if (!this.validHash(currentBlock.hash)) {
                return false;
            }
            currentblockNumber++;
        }
        return true;
    }

    module.exports = Consensus;
})();