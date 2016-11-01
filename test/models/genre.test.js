/**
 * Created by gbu on 01/11/2016.
 */

import assert from 'assert';
import mongoose from 'mongoose';
import Genre from '../../src/Models/Genre';
import bluebird from 'bluebird';

mongoose.Promise = bluebird;
describe('Genre', ()=> {
    before((done) => {
        Genre.remove({}).then(()=> {
            done();
        });
    });

    it('should create and save new genre', (done) => {
        const genre = new Genre({
            name: 'Comedy',
            apiID: '1'
        });
        genre.save((error) => {
            if (error) done(error);
            else done();
        });

    });

    it('should return created genre that is Comedy', (done) => {
        Genre.find({name: 'Comedy'}).limit(1).exec((error, genres)=> {
            const genre = genres[0];
            assert.equal(genre.name, 'Comedy');
            done();
        });
    });
});