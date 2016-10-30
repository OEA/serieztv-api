import assert from 'assert';
import User from '../../src/Models/User';
import mongoose from 'mongoose'

mongoose.connect('mongodb://localhost/serieztv-tests');


describe('Array', ()=> {
    describe('#indexOf()', ()=> {
        it('should return -1 when the value is not present', ()=> {
            assert.equal(-1, [1,2,3].indexOf(4));
        });
    });
});

describe('User', ()=> {
    it('should create and save new user', (done) => {
        var user = new User({
            name: 'Obi-Wan',
            surname: 'Kenobi',
            email: 'deathstar@gmail.com',
            password: '1234',
            activated: true,
            apiID: '1'
        });
        user.save(function (err, user) {
            if (err) console.log(err);
            console.log(user);
            done();
        });
    });
});



