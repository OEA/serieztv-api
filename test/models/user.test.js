/**
 * Created by omeremreaslan on 30/10/2016.
 */
import assert from 'assert';
import mongoose from 'mongoose';
import User from '../../src/Models/User';
import bluebird from 'bluebird';

mongoose.Promise = bluebird;
describe('User', ()=> {
    before((done) => {
        User.remove({}).then(()=> {
            done();
        });
    });

    it('should create and save new user', (done) => {
        const user = new User({
            name: 'Obi-Wan',
            surname: 'Kenobi',
            email: 'deathstar@gmail.com',
            password: '1234',
            activated: true,
            apiID: '1'
        });
        user.save((error) => {
            if (error) done(error);
            else done();
        });

    });

    it('should return created user that is Obi-Wan Kenobi', (done) => {
        User.find({name: 'Obi-Wan'}).limit(1).exec((error, users)=> {
            const user = users[0];
            assert.equal(user.name, 'Obi-Wan');
            done();
        });
    });

    it('should give error when same user is wanted to create', (done) => {
        const user = new User({
            name: 'Obi-Wan',
            surname: 'Kenobi',
            email: 'deathstar@gmail.com',
            password: '1234',
            activated: true,
            apiID: '1'
        });
        user.save((error) => {
            assert.notEqual(error, null);
            done();
        });
    });
});