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





describe('Series', ()=> {
    before((done) => {
        Series.remove({}).then(()=> {
            done();
        });
    });

    it('should create and save new series', (done) => {

        Star.find({name: {$in : ['Kit Harrington', 'Emilia Clark', 'Sean Bean']}}, (error, stars) => {
            return Promise.resolve(stars);
        }).then((stars) => {
            const gameOfThrones = new Series({
                name: 'Game of Thrones',
                stars: [stars[0]._id, stars[1]._id, stars[2]._id],
                overview: 'Series about throne, dragons, whitewalkers.',
                status: 'status',
                poster: 'poster',
                image: 'image',
                imdbScore: 1000,
                imdbRating: 9.3,
                runtime: 50,
                firstAir: new Date(),
                active: true,
                apiID: '1'
            });

            const wasted = new Series({
                name: 'Wasted',
                stars: [stars[2]._id],
                overview: 'Surreal slacker comedy set in a West Country village...',
                status: 'status',
                poster: 'poster',
                image: 'image',
                imdbScore: 1000,
                imdbRating: 9.3,
                runtime: 50,
                firstAir: new Date,
                active: true,
                apiID: '1'
            });

            return Promise.resolve([gameOfThrones, wasted]);
        }).then((seriesArray) => {
            Genre.find({name: {$in : ['Drama' , 'Comedy']}}, (error, genres) => {
               const drama = genres[0];
               const comedy = genres[1];
               seriesArray[0].set('genres', [drama._id]);
               seriesArray[1].set('genres', [comedy._id]);
               Promise.all([seriesArray[0].save(), seriesArray[1].save()]).then(() => {
                   done();
               });
            });
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