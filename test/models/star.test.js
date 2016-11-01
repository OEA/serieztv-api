/**
 * Created by gbu on 01/11/2016.
 */

import assert from 'assert';
import mongoose from 'mongoose';
import Star from '../../src/Models/Star';
import bluebird from 'bluebird';

mongoose.Promise = bluebird;
describe('Star', ()=> {
    before((done) => {
        Star.remove({}).then(()=> {
            done();
        });
    });

    it('should create and save new star', (done) => {
        const star = new Star({
            name: 'Mark Hamill',
            image: 'image',
            active: true,
            apiID: '1'
        });
        star.save((error) => {
            if (error) done(error);
            else done();
        });

    });

    it('should return created star that is Mark Hamill', (done) => {
        Star.find({name: 'Mark Hamill'}).limit(1).exec((error, stars)=> {
            const star = stars[0];
            assert.equal(star.name, 'Mark Hamill');
            done();
        });
    });
});