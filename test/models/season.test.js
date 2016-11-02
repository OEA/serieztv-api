/**
 * Created by gbu on 02/11/2016.
 */

import Season from '../../src/Models/Season';
import Series from '../../src/Models/Series';
import Star from '../../src/Models/Star';
import Genre from '../../src/Models/Genre';
import bluebird from 'bluebird';
import assert from 'assert';
import mongoose from 'mongoose';

mongoose.Promise = bluebird;

const star = new Star({
    name: 'Kit Harrington',
    image: 'image',
    active: true,
    apiID: '1'
});

const genre = new Genre({
    name: 'Drama',
    apiID: '1'
});

const date = new Date();

const series = new Series({
    name: 'Game of Thrones',
    stars: [star._id],
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

describe('Season', ()=> {
    before((done) => {
        star.save();
        genre.save();
        series.save();
        Season.remove({}).then(()=> {
            done();
        });
    });

    it('should create and save new season', (done) => {
        const season = new Season({
            name: 'Game of Thrones',
            number: 1,
            poster: 'poster',
            series: series._id,
            overview: 'king is dead, war begins',
            airDate: date,
            apiID: '1'
        });
        season.save((error) => {
            if (error) done(error);
            else done();
        });
    });

    it('should return series name of the season is Game of Thrones', (done) => {
        Season.find({}).populate({path: 'series'}).exec((error, seasons) => {
            const season = seasons[0];
            assert.equal(season.series.name, 'Game of Thrones');
            done();
        });
    });

    it('should return star of the series is Kit Harrington', (done) => {
        Season.find({}).populate({path: 'series', populate: { path: 'stars' }}).exec((error, seasons) => {
            const season = seasons[0];
            assert.equal(season.series.stars[0].name, 'Kit Harrington');
            done();
        });
    });
});