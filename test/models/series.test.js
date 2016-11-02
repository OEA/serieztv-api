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


const stars = Array(star1._id, star2._id);
const genres = Array(genre._id);
const date = new Date();

describe('Series', ()=> {
    before((done) => {
        console.log('starss: ' + stars);
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
        console.log(series);
        series.save((error) => {
            if (error) done(error);
            else done();
        });

    });

    it('should return stars of the series', (done) => {
        Series.find({}).populate('stars').exec((error, series) => {
            const serie = series[0];
            console.log(series.stars);
            assert.equal(serie.stars.name, 'Daisy Ridley');
            done();
        });
    });

    /*it('should return created character that is Rey', (done) => {
        Character.find({characterName: 'Rey'}).limit(1).exec((error, characters)=> {
            const character = characters[0];
            assert.equal(character.characterName, 'Rey');
            done();
        });
    });*/
});
