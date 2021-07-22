const hexToBinary=require('hex-to-binary');
const Block=require('./block');
const { GENESIS_DATA, MINE_RATE } = require('../config');
const {cryptoHash}=require('../util');

describe('Block',()=>{
    const timestamp=2000;
    const lastHash='foo-last';
    const hash='foo-hash';
    const data=["dataone","data2","data3"];
    const nonce=1;
    const difficulty=1;
    const block=new Block({ timestamp, lastHash, hash, data, nonce, difficulty});

    it('it has a time,last,hash,data',()=>{
        expect(block.timestamp).toEqual(timestamp);
        expect(block.lastHash).toEqual(lastHash);
        expect(block.hash).toEqual(hash);
        expect(block.data).toEqual(data);
        expect(block.nonce).toEqual(nonce);
        expect(block.difficulty).toEqual(difficulty);
    });

    describe('genesis()',()=>{
        const genesisblock=Block.genesis();
        console.log('genesisblock',genesisblock);
        it('returns an instance',()=>{
            expect(genesisblock instanceof Block).toBe(true);
        });

        it('returns a genesis data',()=>{
            expect(genesisblock).toEqual(GENESIS_DATA);
        });
    });
    
    describe('mineBlock()', ()=>{
        const lastBlock=Block.genesis();
        const data='data';
        const minedBlock=Block.mineBlock({lastBlock,data});
        console.log('minedBlock',minedBlock);
        it('returns a Block instance',()=>{
            expect(minedBlock instanceof Block).toBe(true);
        });

        it('sets the `lastHash` to be the `hash` of the lastBlock',()=>{
            expect(minedBlock.lastHash).toEqual(lastBlock.hash);
        });

        it('sets the `data`',()=>{
            expect(minedBlock.data).toEqual(data);
        });

        it('sets the `timestamp`',()=>{
            expect(minedBlock.timestamp).not.toEqual(undefined);
        });

        it('creates a SHA-256 `hash` based on the proper inputs',()=>{
            expect(minedBlock.hash).toEqual(cryptoHash(minedBlock.timestamp,minedBlock.nonce,minedBlock.difficulty,lastBlock.hash,data));
        });

        it('sets a `hash` that matches the difficulty criteria',()=>{
            expect(hexToBinary(minedBlock.hash).substring(0,minedBlock.difficulty)).toEqual('0'.repeat(minedBlock.difficulty));
        });

        it('adjusts the difficulty',()=>{
            const possibleResults=[lastBlock.difficulty+1,lastBlock.difficulty-1];

            expect(possibleResults.includes(minedBlock.difficulty)).toBe(true);
        });
    });

    describe('adjustDifficulty()',()=>{
        it('raises difficulty for a quickly mined block',()=>{
            expect(Block.adjustDifficulty({originalBlock: block, timestamp: block.timestamp+MINE_RATE-100})).toEqual(block.difficulty+1);
        });

        it('lowers difficulty for a slowly mined block',()=>{
            expect(Block.adjustDifficulty({originalBlock: block, timestamp: block.timestamp+MINE_RATE+100})).toEqual(block.difficulty-1);
        });

        it('has a lower limit of 1',()=>{
            block.difficulty=-1;
            expect(Block.adjustDifficulty({originalBlock: block})).toEqual(1);
        });
    });
});