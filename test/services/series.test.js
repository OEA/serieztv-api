/**
 * Created by gbu on 26/11/2016.
 */
import assert from 'assert';
import mongoose from 'mongoose';
import Series from '../../src/Models/Series';
import Star from '../../src/Models/Star';
import Genre from '../../src/Models/Genre';
import SeriesService from '../../src/Services/Series/index';
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

const star3 = new Star({
    name: 'Kate Mara',
    image: 'image',
    active: true,
    apiID: '1'
});

const genre = new Genre({
    name: 'Drama',
    apiID: '1'
});

const genre2 = new Genre({
    name: 'Action',
    apiID: '1'
});

const date = new Date();

describe('SeriesService', ()=> {
    before((done) => {
        Series.remove({}).then(()=> {
            star1.save();
            star2.save();
            star3.save();
            genre.save();
            genre2.save();
            done();
        });
    });

    it('should create new series', (done) => {
        const series = new Series({
            name: 'House of Cards',
            stars: [star1._id,star2._id, star3._id],
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
        SeriesService.create(series)
            .then((result) => {
                assert.equal(result.name, "House of Cards");
                done();
            });
    });

    it('should not create series that has missing argument', (done) => {
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
            active: true
        });
        SeriesService.create(series)
            .then((result) => {

            }).catch((error) => {
            assert.equal(error, "Could not create series");
            done();
        });
    });

    it('should search series by name and return overview of series with that name', (done) => {
        SeriesService.searchByName('House of Cards')
            .then((result) => {
                assert.equal(result[0].overview, 'Series about president of the USA.');
                done();
            });
    });

    it('should search series by name and return overview of second series with that name', (done) => {
        const secondHoC = new Series({
            name: 'House of Cards',
            stars: [star1._id,star2._id],
            genres: [genre._id],
            overview: 'Series about secretary of state of the USA.',
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
        SeriesService.create(secondHoC)
            .then((created) => {
                SeriesService.searchByName('House of Cards')
                    .then((result) => {
                        assert.equal(result[1].overview, 'Series about secretary of state of the USA.');
                        done();
                    });
            });
    });

    it('should search by name and not return for nonexistent movie', (done) => {
        SeriesService.searchByName('Fringe')
            .then((result) => {

            }).catch((error) => {
            assert.equal(error, "Series does not exist");
            done();
        });
    });

    it('should find star names of the series', (done) => {
        const series = new Series({
            name: 'Fringe',
            stars: [star1._id,star2._id],
            genres: [genre._id],
            overview: 'Series about paralel universe.',
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
        SeriesService.create(series)
            .then( (created) => {
                console.log('found' + created);
                SeriesService.findStarsOf(created)
                    .then((result) => {
                        console.log('result' + result);
                        assert.equal(result[0].name, 'Kevin Spacey');
                        assert.equal(result[1].name, 'Robin Wright');
                        done();
                    });
            });
    });

    it('should find genres of the series', (done) => {
        const series = new Series({
            name: 'Prison Break',
            stars: [star1._id,star2._id],
            genres: [genre._id, genre2._id],
            overview: 'Series about escaping prisons.',
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
        SeriesService.create(series)
            .then( (created) => {
                SeriesService.findGenresOf(created)
                    .then((genreResult) => {
                        console.log('genreResult' + genreResult);
                        assert.equal(genreResult[0].name, 'Drama');
                        assert.equal(genreResult[1].name, 'Action');
                        done();
                    });
            });
    });

    it('should not find star names of nonexistent series', (done) => {
        const series = new Series({
            name: 'Harry Potter',
            stars: [star1._id,star2._id],
            genres: [genre._id, genre2._id],
            overview: 'Series about wizards.',
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
        SeriesService.findStarsOf(series)
            .then((result) => {

            }).catch((error) => {
            assert.equal(error, "Series does not exist");
            done();
        });
    });

    it('should not find genres of nonexistent series', (done) => {
        const series = new Series({
            name: 'Harry Potter',
            stars: [star1._id,star2._id],
            genres: [genre._id, genre2._id],
            overview: 'Series about wizards.',
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
        SeriesService.findGenresOf(series)
            .then((result) => {

            }).catch((error) => {
            assert.equal(error, "Series does not exist");
            done();
        });
    });

    it('should find series of the star', (done) => {
        const series = new Series({
            name: 'American Horror Story',
            stars: [star3._id],
            genres: [genre._id, genre2._id],
            overview: 'Series about horror stories.',
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
        SeriesService.create(series)
            .then( (created) => {
                SeriesService.findSeriesOf(star3)
                    .then((seriesList) => {
                        console.log('movies' + seriesList);
                        assert.equal(seriesList.length, 2);
                        // assert.equal(movies[1].name, 'Transformers');
                        done();
                    });
            });

    });

    it('should delete the series', (done) => {
        const series = new Series({
            name: 'Luke Cage',
            stars: [star3._id],
            genres: [genre._id, genre2._id],
            overview: 'Series about a strong man.',
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
        SeriesService.create(series)
            .then((test) => {
                SeriesService.delete(series._id)
                    .then((result) => {
                        assert.equal(result.name, "Luke Cage");
                        done();
                    });
            });
    });

    it('should not delete nonexistent series', (done) => {
        const series = new Series({
            name: 'Reign',
            stars: [star3._id],
            genres: [genre._id, genre2._id],
            overview: 'Series about queen Elizabeth.',
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
        SeriesService.delete(series._id)
            .then((result) => {

            }).catch((error) => {
            assert.equal(error, "Series does not exist");
            done();
        });
    });
});