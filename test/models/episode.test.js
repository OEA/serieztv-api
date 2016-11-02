/**
 * Created by gbu on 02/11/2016.
 */

import Episode from '../../src/Models/Episode';
import Season from '../../src/Models/Season';
import Star from '../../src/Models/Star';
import Crew from '../../src/Models/Crew';
import Genre from '../../src/Models/Genre';
import Series from '../../src/Models/Series';
import bluebird from 'bluebird';
import assert from 'assert';
import mongoose from 'mongoose';

mongoose.Promise = bluebird;

const guestStar = new Star({
    name: 'Faye Marsay',
    image: 'image',
    active: true,
    apiID: '1'
});

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

const crew = new Crew({
    name: 'David Benioff',
    image: 'image',
    job: 'Writer',
    department: 'Writing',
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

const season = new Season({
    name: 'Game of Thrones',
    number: 6,
    poster: 'poster',
    series: series._id,
    overview: 'whitewalkers attack, jon takes north.',
    airDate: date,
    apiID: '1'
});

describe('Episode', ()=> {
    before((done) => {
        star.save();
        guestStar.save();
        genre.save();
        series.save();
        season.save();
        Episode.remove({}).then(()=> {
            done();
        });
    });

    it('should create and save new season', (done) => {
        const episode = new Episode({
            name: 'The Winds of Winter',
            season: season._id,
            crew: [crew._id],
            guestStars: [guestStar._id],
            overview: 'Winter is here',
            imdbScore: 1000,
            imdbRating: 9.9,
            apiID: '1',
        });
        episode.save((error) => {
            if (error) done(error);
            else done();
        });
    });

    it('should return IMDB rating of the episode named The Winds of Winter is 9.9', (done) => {
        Episode.find({name: 'The Winds of Winter'}).limit(1).exec((error, episodes)=> {
            const episode = episodes[0];
            assert.equal(episode.imdbRating, 9.9);
            done();
        });
    });


    it('should return season number of the episode is 6', (done) => {
        Episode.find({}).populate({path: 'season'}).exec((error, episodes) => {
            const episode = episodes[0];
            assert.equal(episode.season.number, '6');
            done();
        });
    });

    it('should return series imdb rating is 9.3', (done) => {
        Episode.find({}).populate({path: 'season', populate: { path: 'series' }}).exec((error, episodes) => {
            const episode = episodes[0];
            assert.equal(episode.season.series.imdbRating, 9.3);
            done();
        });
    });
});