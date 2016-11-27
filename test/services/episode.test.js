/**
 * Created by gbu on 26/11/2016.
 */
import assert from 'assert';
import mongoose from 'mongoose';
import Episode from '../../src/Models/Episode';
import Season from '../../src/Models/Season';
import Series from '../../src/Models/Series';
import Star from '../../src/Models/Star';
import Crew from '../../src/Models/Crew';
import Genre from '../../src/Models/Genre';
import EpisodeService from '../../src/Services/Episode/index';
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

const guestStar = new Star({
    name: 'Kristen Connolly',
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

const season = new Season({
    name: 'House of Cards',
    number: 1,
    poster: 'poster',
    series: series._id,
    overview: 'become president',
    airDate: date,
    apiID: '1'
});

const crew = new Crew({
    name: 'Beau Willimon',
    image: 'image',
    job: 'Producer',
    department: 'Producing',
    apiID: '1'
});

describe('EpisodeService', ()=> {
    before((done) => {
        Episode.remove({}).then(()=> {
            star1.save();
            star2.save();
            guestStar.save();
            genre.save();
            series.save();
            season.save();
            crew.save();
            done();
        });
    });

    it('should create new episode', (done) => {
        const episode = new Episode({
            name: 'Chapter 1',
            season: season._id,
            crew: [crew._id],
            guestStars: [guestStar._id],
            overview: 'Frank stars to move for presidency.',
            imdbScore: 1000,
            imdbRating: 9.9,
            apiID: '1'
        });
        EpisodeService.create(episode)
            .then((result) => {
                assert.equal(result.overview, "Frank stars to move for presidency.");
                done();
            });
    });

    it('should not create episode that has missing argument', (done) => {
        const episode = new Episode({
            name: 'Chapter 1',
            season: season._id,
            crew: [crew._id],
            guestStars: [guestStar._id],
            overview: 'Frank stars to move for presidency.',
            imdbScore: 1000,
            imdbRating: 9.9
        });
        EpisodeService.create(episode)
            .then((result) => {

            }).catch((error) => {
            assert.equal(error, "Could not create episode");
            done();
        });
    });

    it('should search episode by name and return overview of episode with that name', (done) => {
        EpisodeService.searchByName('Chapter 1')
            .then((result) => {
                assert.equal(result[0].overview, 'Frank stars to move for presidency.');
                done();
            });
    });

    it('should search by name and not return for nonexistent episode', (done) => {
        EpisodeService.searchByName('Chapter 2')
            .then((result) => {

            }).catch((error) => {
            assert.equal(error, "Episode does not exist");
            done();
        });
    });

    it('should find episodes of the season', (done) => {
        const episode = new Episode({
            name: 'Chapter 2',
            season: season._id,
            crew: [crew._id],
            guestStars: [guestStar._id],
            overview: 'Frank stars to move for presidency.',
            imdbScore: 1000,
            imdbRating: 9.9,
            apiID: '1'
        });
        EpisodeService.create(episode)
            .then((created) => {
                EpisodeService.findEpisodesOf(season)
                    .then((episodes) => {
                        assert.equal(episodes.length, 2);
                        done();
                    })
            });
    });

    it('should find season overview of the episode', (done) => {
        EpisodeService.searchByName('Chapter 1')
            .then( (founded) => {
                var episode = founded[0];
                EpisodeService.findSeasonOf(episode)
                    .then((result) => {
                        assert.equal(result.season.overview, 'become president');
                        done();
                    });
            });
    });

    it('should not find season name of nonexistent episode', (done) => {
        const episode = new Episode({
            name: 'Chapter 3',
            season: season._id,
            crew: [crew._id],
            guestStars: [guestStar._id],
            overview: 'Frank stars to move for presidency.',
            imdbScore: 1000,
            imdbRating: 9.9,
            apiID: '1'
        });
        EpisodeService.findSeasonOf(episode)
            .then((result) => {

            }).catch((error) => {
            assert.equal(error, "Episode does not exist");
            done();
        });
    });

    it('should find first crew name of the episode', (done) => {
        EpisodeService.searchByName('Chapter 1')
            .then( (founded) => {
                var episode = founded[0];
                EpisodeService.findCrewOf(episode)
                    .then((result) => {
                        assert.equal(result[0].name, 'Beau Willimon');
                        done();
                    });
            });
    });

    it('should not find crew  of nonexistent episode', (done) => {
        const episode = new Episode({
            name: 'Chapter 3',
            season: season._id,
            crew: [crew._id],
            guestStars: [guestStar._id],
            overview: 'Frank stars to move for presidency.',
            imdbScore: 1000,
            imdbRating: 9.9,
            apiID: '1'
        });
        EpisodeService.findSeasonOf(episode)
            .then((result) => {

            }).catch((error) => {
            assert.equal(error, "Episode does not exist");
            done();
        });
    });

    it('should find first guest star name of the episode', (done) => {
        EpisodeService.searchByName('Chapter 1')
            .then( (founded) => {
                var episode = founded[0];
                EpisodeService.findGuestStarsOf(episode)
                    .then((result) => {
                        assert.equal(result[0].name, 'Kristen Connolly');
                        done();
                    });
            });
    });

    it('should not find first guest star name of nonexistent episode', (done) => {
        const episode = new Episode({
            name: 'Chapter 3',
            season: season._id,
            crew: [crew._id],
            guestStars: [guestStar._id],
            overview: 'Frank stars to move for presidency.',
            imdbScore: 1000,
            imdbRating: 9.9,
            apiID: '1'
        });
        EpisodeService.findGuestStarsOf(episode)
            .then((result) => {

            }).catch((error) => {
            assert.equal(error, "Episode does not exist");
            done();
        });
    });

    it('should not delete nonexistent episode', (done) => {
        const episode = new Episode({
            name: 'Chapter 3',
            season: season._id,
            crew: [crew._id],
            guestStars: [guestStar._id],
            overview: 'Frank stars to move for presidency.',
            imdbScore: 1000,
            imdbRating: 9.9,
            apiID: '1'
        });
        EpisodeService.delete(episode._id)
            .then((result) => {

            }).catch((error) => {
            assert.equal(error, "Episode does not exist");
            done();
        });
    });

    it('should delete the episode', (done) => {
        const episode = new Episode({
            name: 'Chapter 3',
            season: season._id,
            crew: [crew._id],
            guestStars: [guestStar._id],
            overview: 'Frank fails for presidency.',
            imdbScore: 1000,
            imdbRating: 9.9,
            apiID: '1'
        });
        EpisodeService.create(episode)
            .then((created) => {
                EpisodeService.delete(created._id)
                    .then((result) => {
                        assert.equal(result.overview, "Frank fails for presidency.");
                        done();
                    });
            });
    });
});