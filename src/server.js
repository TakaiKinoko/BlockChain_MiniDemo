"use strict";

(async () => {

    const Utils = require("./utils");
    const Api = require("./api");
    const Blockchain = require('../src/blockchain');
    const Consensus = require('../src/consensus');

    const DEFAULT_PORT = 5000;
    // parse command line from user when the server is started
    const args = Utils.parseArgs();

    const port = args.port || DEFAULT_PORT;
    // create API, pass a newly created blockchain to it
    let app = Api.getAPI(new Blockchain(new Consensus()));
    //start the API listening on the supplied port 5000 by default
    app.listen(port)
    console.log("Blockchain server listening on port: " + port)


})();