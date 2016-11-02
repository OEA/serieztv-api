/**
 * Created by gbu on 02/11/2016.
 */

import Comment from '../../src/Models/Comment';
import User from '../../src/Models/User';
import Movie from '../../src/Models/Movie';
import Star from '../../src/Models/Star';
import Genre from '../../src/Models/Genre';
import Series from '../../src/Models/Series';
import bluebird from 'bluebird';
import assert from 'assert';
import mongoose from 'mongoose';

mongoose.Promise = bluebird;

const user = new User({
    name: 'Rhegar Targaryen',
    email: 'dragonsa@gmail.com',
    password: '1234',
    activated: true,
    apiID: '1'
});

const star = new Star({
    name: 'Emilia Clark',
    image: 'image',
    active: true,
    apiID: '1'
});


const genre = new Genre({
    name: 'Comedy',
    apiID: '1'
});

var date = new Date();

const stars = [star];
const genres = [genre];

const series = new Series({
    name: 'Game of Thrones',
    stars: stars._id,
    genres: genres._id,
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


const movie = new Movie({
    name: 'Star Wars',
    stars: stars._id,
    genres: genres._id,
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



describe('Comment', ()=> {
    before((done) => {
        star.save();
        genre.save();
        user.save();
        series.save();
        movie.save();
        Comment.remove({}).then(()=> {
            done();
        });
    });

    it('should create and save new comment', (done) => {
        const comment = new Comment({
            user: user._id,
            comment: 'This movie is awesome!',
            object: series._id,
            activate: true,
            apiID: '1'
        });
        comment.save((error) => {
            if (error) done(error);
            else done();
        });

    });

    it('should return name of the user that writes the comment', (done) => {
        Comment.find({}).populate('user').exec((error, comments) => {
            const comment = comments[0];
            assert.equal(comment.user.name, 'Rhegar Targaryen');
            done();
        });

    });

    /*it('should return first comment is about Game of Thrones', (done) => {
        Comment.find({}).populate('object').exec((error, comments)=> {
            series.save();
            const comment = comments[0];
            console.log('series is: ' + series);
            console.log('comment third ' +  comment);
            assert.equal(comment.object.name, 'Game of Thrones');
            done();
        });
    });*/
});
