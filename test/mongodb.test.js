import assert from 'assert';
import mongoose from 'mongoose';

mongoose.connect('mongodb://localhost/serieztv-tests');

describe('Mongoose', ()=> {
    describe('#connection', ()=> {
        it('should return mongoose connection', (done)=> {
            assert.notEqual(mongoose.connection, null);
            done();
        });
    });
});