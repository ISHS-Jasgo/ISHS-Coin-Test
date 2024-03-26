import crypto from 'crypto'
import { BlockChain } from './blockchain';

interface BlockData {
    index: number;
    hash: string;
    previousHash: string;
    data: string;
}

export class Block implements BlockData {

    public hash: string;

    constructor(
        public nonce: number,
        public index: number,
        public previousHash: string,
        public data: string
    ) {
        this.hash = Block.calculateHash(nonce, index, previousHash, data);
    }

    static genesis = new Block(0, 0, '0', 'my genesis block!!');

    static calculateHash(
        nonce: number,
        index: number,
        previousHash: string,
        data: string
    ): string {
        return crypto
            .createHash('sha256')
            .update(nonce + index + previousHash + data)
            .digest('hex');
    }

    static isValidBlockStructure(block: Block): boolean {
        return (
            typeof block.index === 'number' &&
            typeof block.hash === 'string' &&
            typeof block.previousHash === 'string' &&
            typeof block.data === 'string'
        );
    }

    static isValidNewBlock(newBlock: Block, previousBlock: Block): boolean {
        if (!Block.isValidBlockStructure(newBlock)) {
            console.log('invalid structure');
            return false;
        }
        if (previousBlock.index + 1 !== newBlock.index) {
            console.log('invalid index');
            return false;
        } else if (previousBlock.hash !== newBlock.previousHash) {
            console.log('invalid previous hash');
            return false;
        } else if (!Block.hasValidHash(newBlock)) {
            console.log('invalid hash');
            return false;
        }
        return true;
    }

    static hasValidHash(block: Block): boolean {
        return Block.calculateHash(block.nonce, block.index, block.previousHash, block.data) === block.hash;
    }

    static hashMatchesDifficulty(hash: string): boolean {
        const hashInBinary = Block.hexToBinary(hash);
        const requiredPrefix = '0'.repeat(4);
        return hashInBinary.startsWith(requiredPrefix);
    }

    static hexToBinary(hex: string): string {
        let binaryString = '';
        const hexLength = hex.length;
        for (let i = 0; i < hexLength; i++) {
            const binary = parseInt(hex[i], 16).toString(2);
            binaryString += binary;
        }
        return binaryString;
    }

    static mineBlock(data: string) {
        let nonce = 0;
        let hash = '';
        let index = BlockChain.instance.lastBlock.index + 1;
        let previousHash = BlockChain.instance.lastBlock.hash;
        while (true) {
            hash = Block.calculateHash(++nonce, index, previousHash, data);
            console.log(nonce, hash);
            if (Block.hashMatchesDifficulty(hash)) {
                break;
            }
        }
        const newBlock = new Block(nonce, index, previousHash, data);
        BlockChain.instance.addBlock(newBlock);
    }
}