/**
 * Created by omeremreaslan on 30/10/2016.
 */
import mongoose from 'mongoose';
import User from '../../src/Models/User';
import bluebird from 'bluebird';
import { expect } from 'chai';

mongoose.Promise = bluebird;

const ObiWanKenobi = new User({
    name: 'Obi-Wan Kenobi',
    username: 'ObiWan',
    email: 'deathstar@gmail.com',
    password: '1234',
    activated: true,
    apiID: '1'
});

describe('User', ()=> {
    before((done) => {
        User.remove({}).then(()=> {
            done();
        });
    });

    it('should create and save new user', (done) => {
        ObiWanKenobi.save((error) => {
            if (error) done(error);
            else done();
        });

    });

    it('should return created user that is Obi-Wan Kenobi', (done) => {
        User.findOne({name: 'Obi-Wan Kenobi'}).limit(1).exec((error, obiWan)=> {
            expect(obiWan.name).to.be.equal('Obi-Wan Kenobi');
            done();
        });
    });

    it('should give error when same email is wanted to use', (done) => {
        const user = new User({
            name: 'Jon Snow',
            username: 'stark',
            email: 'deathstar@gmail.com',
            password: '1234',
            activated: true,
            apiID: '1'
        });
        user.save((error) => {
            expect(error).not.to.be.null;
            done();
        });
    });

    it('should give error when same username is wanted to use', (done) => {
        const user = new User({
            name: 'Jon Snow',
            username: 'ObiWan',
            email: 'stark@gmail.com',
            password: '1234',
            activated: true,
            apiID: '1'
        });
        user.save((error) => {
            expect(error).not.to.be.null;
            done();
        });
    });
});