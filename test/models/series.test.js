/**
 * Created by gbu on 02/11/2016.
 */

import Series from '../../src/Models/Series';
import Star from '../../src/Models/Star';
import Genre from '../../src/Models/Genre';
import bluebird from 'bluebird';
import assert from 'assert';
import mongoose from 'mongoose';

mongoose.Promise = bluebird;

const star1 = new Star({
    name: 'Daisy Ridley',
    image: 'image',
    active: true,
    apiID: '1'
});

const star2 = new Star({
    name: 'Tom Hanks',
    image: 'image',
    active: true,
    apiID: '1'
});


const genre = new Genre({
    name: 'Comedy',
    apiID: '1'
});

const date = new Date();

describe('Series', ()=> {
    before((done) => {
        star1.save();
        star2.save();
        genre.save();
        Series.remove({}).then(()=> {
            done();
        });
    });

    it('should create and save new series', (done) => {
        const series = new Series({
            name: 'Game of Thrones',
            stars: [star1._id,star2._id],
            genres: [genre._id],
            overview: 'Series about throne, dragons, whitewalkers.',
            status: 'status',
            poster: 'poster',
            image: 'image',
            imdbScore: 1000,
            imdbRating: 9.3,
            runtime: 50,
            firstAir: date,
            active: true,
            apiID: '1'
        });
        series.save((error) => {
            if (error) done(error);
            else done();
        });

    });

    it('should return stars of the series', (done) => {
        Series.find({}).populate([{path: 'stars'}, {path: 'genres'}]).exec((error, seriesArray) => {
            const series = seriesArray[0];
            assert.equal(series.stars[0].name, 'Daisy Ridley');
            done();
        });
    });

});
