const cryptoHash=require('./crypto-hash');

describe('cryptoHash()',()=>{

    it('generates SHA-256 o/p',()=>{
        expect(cryptoHash('hashone')).toEqual('76b824aa750a31b44c030b30cfd727c8695f0490a0db458629be0682d6c1eac7');
    });

    it('produces the same hash with the same input in different order',()=>{
        expect(cryptoHash('one','two','three')).toEqual(cryptoHash('three','one','two'));
    });

    it('produces a unique hash when the properties have changed on an input',()=>{
        const foo={};
        const originalHash=cryptoHash(foo); 
        foo['a']='a';

        expect(cryptoHash(foo)).not.toEqual(originalHash);
    });
});