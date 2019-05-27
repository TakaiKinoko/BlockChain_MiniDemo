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

    module.exports = Consensus;
})();