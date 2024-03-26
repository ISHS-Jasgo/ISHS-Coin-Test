import { Block } from "./block";

export class BlockChain {
    public static instance = new BlockChain();
    chain: Block[];

    constructor() {
        this.chain = [Block.genesis];
    }

    get lastBlock() {
        return this.chain[this.chain.length - 1];
    }

    addBlock(block: Block) {
        this.chain.push(block);
    }
    
    isValid() {
        for (let i = 1; i < this.chain.length; i++) {
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i - 1];
            if (!Block.isValidNewBlock(currentBlock, previousBlock)) {
                return false;
            }
        }
        return true;
    }

    static isValidChain(chain: Block[]): boolean {
        if (JSON.stringify(chain[0]) !== JSON.stringify(Block.genesis)) {
            return false;
        }
        for (let i = 1; i < chain.length; i++) {
            if (!Block.isValidNewBlock(chain[i], chain[i - 1])) {
                return false;
            }
        }
        return true;
    }

    blockchain2json() {
        return JSON.stringify(this.chain);
    }
}