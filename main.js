const SHA256 = require('crypto-js/sha256');

class Block {
  constructor(index, timestamp, data, previousHash = '') {
    this.index = index;
    this.timestamp = timestamp;
    this.data = data;
    this.previousHash = previousHash;
    this.hash = this.calculateHash();
    this.nonce = 0;
  };

  calculateHash() {
    return SHA256(this.index + this.previousHash + this.timestamp + JSON.stringify(this.data) + this.nonce).toString();
  };

  mineBlock(difficulty) {
    while (this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")) {
      this.nonce++;
      this.hash = this.calculateHash();
    }
    console.log("Mined block: ", this.hash);
  };
};

class BlockChain {
  constructor() {
    this.chain = [this.createGenesisBlock()];
    this.difficulty = 4;
  };

  createGenesisBlock() {
    return new Block(0, '01/01/2018', "Genesis block", "0");
  };

  getLatestBlock() {
    return this.chain[this.chain.length - 1];
  };

  addBlock(newBlock) {
    newBlock.previousHash = this.getLatestBlock().hash;
    newBlock.mineBlock(this.difficulty);
    this.chain.push(newBlock);
  };

  isChainValid() {
    for (let i = 1; i < this.chain.length; i++) {
      const currentBlock = this.chain[i];
      const previousBlock = this.chain[i - 1];

      if (currentBlock.hash !== currentBlock.calculateHash()) {
        return false;
      }

      if (currentBlock.previousHash !== previousBlock.hash) {
        return false;
      }
    }
    return true;
  };
};

let awesomeCoin = new BlockChain();

console.log("Mining block 1....");
awesomeCoin.addBlock(new Block(1, "19/03/2018", { amount: 10 }));

console.log("Mining block 2....");
awesomeCoin.addBlock(new Block(2, "20/03/2018", { amount: 15 }));

console.log("Is the blockchain valid?", awesomeCoin.isChainValid());
console.log(JSON.stringify(awesomeCoin, null, 4));

//Let's temper a block by changing it's data and hash, see if it works!

awesomeCoin.chain[1].data = { amount: 100 };
awesomeCoin.chain[1].hash = awesomeCoin.chain[1].calculateHash();

console.log("After tempering,is the blockchain valid?", awesomeCoin.isChainValid());