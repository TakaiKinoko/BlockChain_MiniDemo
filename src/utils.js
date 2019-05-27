"use strict";

(async () => {

    const SHA256 = require("crypto-js/sha256");

    function getSHA256HexString(input) {
        return SHA256(input).toString();
    }

    function calculateHash(block) {
        let blockDetails = {
            previousBlockHash: block.previousBlockHash,
            data: block.data,
            blockNumber: block.blockNumber,
            timestamp: block.timestamp,
            nonce: block.nonce
        }
        // sort the block details so to ensure the inputs are always in the same order when hashed
        return getSHA256HexString(JSON.stringify(blockDetails, Object.keys(blockDetails).sort()));
    }


    module.exports = {
        getSHA256HexString,
        calculateHash
    };

})();