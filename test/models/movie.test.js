/**
 * Created by gbu on 03/11/2016.
 */

import Movie from '../../src/Models/Movie';
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
    name: 'Mark Hamill',
    image: 'image',
    active: true,
    apiID: '1'
});

const genre = new Genre({
    name: 'Adventure',
    apiID: '1'
});

const date = new Date();

describe('Movie', ()=> {
    before((done) => {
        star1.save();
        star2.save();
        genre.save();
        Movie.remove({}).then(()=> {
            done();
        });
    });

    it('should create and save new movie', (done) => {
        const movie = new Movie({
            name: 'Star Wars',
            stars: [star1._id,star2._id],
            genres: [genre._id],
            overview: 'Movie about space.',
            status: 'status',
            poster: 'poster',
            image: 'image',
            imdbScore: 1000,
            imdbRating: 9.5,
            runtime: 120,
            airDate: date,
            apiID: '1'
        });
        movie.save((error) => {
            if (error) done(error);
            else done();
        });

    });

    it('should return stars of the movie', (done) => {
        Movie.find({}).populate([{path: 'stars'}, {path: 'genres'}]).exec((error, movies) => {
            const movie = movies[0];
            assert.equal(movie.stars[0].name, 'Daisy Ridley');
            assert.equal(movie.stars[1].name, 'Mark Hamill');
            done();
        });
    });

    it('should return genre of the movie', (done) => {
        Movie.find({}).populate([{path: 'stars'}, {path: 'genres'}]).exec((error, movies) => {
            const movie = movies[0];
            assert.equal(movie.genres[0].name, 'Adventure');
            done();
        });
    });
});
