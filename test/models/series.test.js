/**
 * Created by gbu on 02/11/2016.
 */

import Series from '../../src/Models/Series';
import Star from '../../src/Models/Star';
import Genre from '../../src/Models/Genre';
import bluebird from 'bluebird';
import mongoose from 'mongoose';
import { expect } from 'chai';

mongoose.Promise = bluebird;

const KitHarrington = new Star({
    name: 'Kit Harrington',
    image: 'image',
    active: true,
    apiID: '1'
});

const EmiliaClark = new Star({
    name: 'Emilia Clark',
    image: 'image',
    active: true,
    apiID: '2'
});

const SeanBean = new Star({
    name: 'Sean Bean',
    image: 'image',
    active: true,
    apiID: '3'
});


const drama = new Genre({
    name: 'Drama',
    apiID: '1'
});

const comedy = new Genre({
    name: 'Comedy',
    apiID: '2'
});

const date = new Date();

const gameOfThrones = new Series({
    name: 'Game of Thrones',
    stars: [KitHarrington._id, EmiliaClark._id, SeanBean._id],
    genres: [drama._id],
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

const wasted = new Series({
    name: 'Wasted',
    stars: [SeanBean._id],
    genres: [comedy._id],
    overview: 'Surreal slacker comedy set in a West Country village...',
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



describe('Series', ()=> {
    before((done) => {
        star1.save();
        star2.save();
        star3.save();
        drama.save();
        comedy.save();
        Series.remove({}).then(()=> {
            done();
        });
    });

    it('should create and save new series', (done) => {
        Promise.all([gameOfThrones.save(), wasted.save()]).then(()=>{
            done();
        });
    });

    it('should return stars of the series', (done) => {
        Series.find({name: 'Game of Thrones'}).populate([{path: 'stars'}, {path: 'genres'}]).exec((error, seriesArray) => {
            const gameOfThrones = seriesArray[0];
            expect(gameOfThrones.stars).to.have.lengthOf(3);
            expect(gameOfThrones.stars[0].name).to.be.equal('Kit Harrington');
            expect(gameOfThrones.stars[1].name).to.be.equal('Emilia Clark');
            expect(gameOfThrones.stars[2].name).to.be.equal('Sean Bean');
            done();
        });
    });

    it('should return Sean Bean\'s series', (done) => {
        Series.findOne({name: 'Game of Thrones'}, (err, gameOfThrones) => {
            return Promise.resolve(gameOfThrones);
        }).then((gameOfThrones) => {
            return Promise.resolve(gameOfThrones.stars[2]);
        }).then((starId) => {
            return Promise.resolve(Series.find({stars: {$in: [starId]}}).populate([{path: 'stars'}, {path: 'genres'}]));
        }).then((series) => {
            expect(series).to.have.lengthOf(2);
            done();
        });
    });

    it('should return genres of the series', (done) => {
        Series.findOne({name: 'Game of Thrones'}).populate([{path: 'stars'}, {path: 'genres'}]).exec((error, gameOfThrones) => {
            expect(gameOfThrones.genres[0].name).to.be.equal('Drama');
            done();
        });
    });
});