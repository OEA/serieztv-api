/**
 * Created by gbu on 26/11/2016.
 */
import assert from 'assert';
import mongoose from 'mongoose';
import Season from '../../src/Models/Season';
import Series from '../../src/Models/Series';
import Star from '../../src/Models/Star';
import Genre from '../../src/Models/Genre';
import SeasonService from '../../src/Services/Season/index';
import bluebird from 'bluebird';

bluebird.promisifyAll(mongoose);

const star1 = new Star({
    name: 'Kevin Spacey',
    image: 'image',
    active: true,
    apiID: '1'
});

const star2 = new Star({
    name: 'Robin Wright',
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
    name: 'House of Cards',
    stars: [star1._id,star2._id],
    genres: [genre._id],
    overview: 'Series about president of the USA.',
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

describe('SeasonService', ()=> {
    before((done) => {
        Season.remove({}).then(()=> {
            star1.save();
            star2.save();
            genre.save();
            series.save();
            done();
        });
    });

    it('should create new season', (done) => {
        const season = new Season({
            name: 'House of Cards',
            number: 1,
            poster: 'poster',
            series: series._id,
            overview: 'become president',
            airDate: date,
            apiID: '1'
        });
        SeasonService.create(season)
            .then((result) => {
                assert.equal(result.overview, "become president");
                done();
            });
    });

    it('should not create season that has missing argument', (done) => {
        const season = new Season({
            name: 'House of Cards',
            number: 1,
            poster: 'poster',
            series: series._id,
            overview: 'become president',
            airDate: date
        });
        SeasonService.create(season)
            .then((result) => {

            }).catch((error) => {
            assert.equal(error, "Could not create season");
            done();
        });
    });

    it('should search season by name and return overview of season with that name', (done) => {
        SeasonService.searchByName('House of Cards')
            .then((result) => {
                assert.equal(result[0].overview, 'become president');
                done();
            });
    });

    it('should search season by name and return overview of second season with that name', (done) => {
        const season = new Season({
            name: 'House of Cards',
            number: 2,
            poster: 'poster',
            series: series._id,
            overview: 'stay president',
            airDate: date,
            apiID: '1'
        });
        SeasonService.create(season)
            .then((created) => {
                SeasonService.searchByName('House of Cards')
                    .then((result) => {
                        assert.equal(result[1].overview, 'stay president');
                        done();
                    });
            });
    });

    it('should search by name and not return for nonexistent season', (done) => {
        SeasonService.searchByName('Fringe')
            .then((result) => {

            }).catch((error) => {
            assert.equal(error, "Season does not exist");
            done();
        });
    });

    it('should find seasons of the series', (done) => {
        SeasonService.findSeasonsOf(series)
            .then((seasons) => {
                assert.equal(seasons.length, 2);
                done();
            });
    });

    it('should find series overview of the season', (done) => {
        SeasonService.searchByName('House of Cards')
            .then( (founded) => {
                var season = founded[0];
                SeasonService.findSeriesOf(season)
                    .then((result) => {
                        assert.equal(result.series.overview, 'Series about president of the USA.');
                        done();
                    });
            });
    });

    it('should not find series names of nonexistent season', (done) => {
        const season = new Season({
            name: 'House of Cards',
            number: 4,
            poster: 'poster',
            series: series._id,
            overview: 'stay president',
            airDate: date,
            apiID: '1'
        });
        SeasonService.findSeriesOf(season)
            .then((result) => {

            }).catch((error) => {
            assert.equal(error, "Season does not exist");
            done();
        });
    });

    it('should not delete nonexistent season', (done) => {
        const season = new Season({
            name: 'House of Cards',
            number: 2,
            poster: 'poster',
            series: series._id,
            overview: 'stay president',
            airDate: date,
            apiID: '1'
        });
        SeasonService.delete(season._id)
            .then((result) => {

            }).catch((error) => {
                assert.equal(error, "Season does not exist");
                done();
            });
    });

    it('should delete the season', (done) => {
        const season = new Season({
            name: 'House of Cards',
            number: 3,
            poster: 'poster',
            series: series._id,
            overview: 'fall from president',
            airDate: date,
            apiID: '1'
        });
        SeasonService.create(season)
            .then((created) => {
                SeasonService.delete(created._id)
                    .then((result) => {
                        assert.equal(result.overview, "fall from president");
                        done();
                    });
            });
    });
});