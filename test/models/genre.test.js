/**
 * Created by gbu on 01/11/2016.
 */

import { expect } from 'chai';
import mongoose from 'mongoose';
import Genre from '../../src/Models/Genre';
import bluebird from 'bluebird';

mongoose.Promise = bluebird;

const drama = new Genre({
    name: 'Drama',
    apiID: '1'
});

const comedy = new Genre({
    name: 'Comedy',
    apiID: '2'
});

describe('Genre', ()=> {
    before((done) => {
        Genre.remove({}).then(()=> {
            done();
        });
    });

    it('should create and save new genres', (done) => {
        Promise.all([drama.save(), comedy.save()]).then(() => {
            done();
        });
    });

    it('should return created genre that is Comedy', (done) => {
        Genre.findOne({name: 'Comedy'}).limit(1).exec((error, comedy)=> {
            expect(error).to.be.null;
            expect(comedy).not.to.be.null;
            expect(comedy.name).equal('Comedy');
            done();
        });
    });
});