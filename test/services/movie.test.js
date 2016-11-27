/**
 * Created by gbu on 21/11/2016.
 */
import assert from 'assert';
import mongoose from 'mongoose';
import Movie from '../../src/Models/Movie';
import Star from '../../src/Models/Star';
import Genre from '../../src/Models/Genre';
import MovieService from '../../src/Services/Movie/index';
import bluebird from 'bluebird';

bluebird.promisifyAll(mongoose);

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

const star3 = new Star({
    name: 'Harrison Ford',
    image: 'image',
    active: true,
    apiID: '1'
});

const genre = new Genre({
    name: 'Adventure',
    apiID: '1'
});

const genre2 = new Genre({
    name: 'Fantastic',
    apiID: '1'
});

 const date = new Date();

describe('MovieService', ()=> {
    before((done) => {
        Movie.remove({}).then(()=> {
            star1.save();
            star2.save();
            star3.save();
            genre.save();
            genre2.save();
            done();
        });
    });

    it('should create new movie', (done) => {
        const movie = new Movie({
            name: 'Star Wars',
            stars: [star1._id,star2._id, star3._id],
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
        MovieService.create(movie)
            .then((result) => {
                assert.equal(result.name, "Star Wars");
                done();
            });
    });

    it('should not create movie that has missing argument', (done) => {
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
            airDate: date
        });
        MovieService.create(movie)
            .then((result) => {

            }).catch((error) => {
            assert.equal(error, "Could not create movie");
            done();
        });
    });

    it('should search movie by name and return overview of movie with that name', (done) => {
        MovieService.searchByName('Star Wars')
            .then((result) => {
                assert.equal(result[0].overview, 'Movie about space.');
                done();
            });
    });

    it('should search movie by name and return name of second movie with that name', (done) => {
        const secondStarWars = new Movie({
            name: 'Star Wars',
            stars: [star1._id,star2._id],
            genres: [genre._id],
            overview: 'Movie about resistance.',
            status: 'status',
            poster: 'poster',
            image: 'image',
            imdbScore: 1000,
            imdbRating: 9.5,
            runtime: 120,
            airDate: date,
            apiID: '1'
        });
        MovieService.create(secondStarWars)
            .then((created) => {
                MovieService.searchByName('Star Wars')
                    .then((result) => {
                        assert.equal(result[1].overview, 'Movie about resistance.');
                        done();
                    });
            });
    });

    it('should search by name and not return for nonexistent movie', (done) => {
        MovieService.searchByName('Lord of The Rings')
            .then((result) => {

            }).catch((error) => {
            assert.equal(error, "Movie does not exist");
            done();
        });
    });

    it('should find star names of the movie', (done) => {
        const movie = new Movie({
            name: 'Harry Potter',
            stars: [star1._id,star2._id],
            genres: [genre._id],
            overview: 'Movie about wizards.',
            status: 'status',
            poster: 'poster',
            image: 'image',
            imdbScore: 1000,
            imdbRating: 9.5,
            runtime: 120,
            airDate: date,
            apiID: '1'
        });
        MovieService.create(movie)
            .then( (created) => {
                MovieService.findStarsOf(created)
                    .then((result) => {
                        assert.equal(result.stars[0].name, 'Daisy Ridley');
                        assert.equal(result.stars[1].name, 'Mark Hamill');
                        done();
                    });
            });
    });

    it('should find genres of the movie', (done) => {
        const movie = new Movie({
            name: 'Star Trek',
            stars: [star1._id,star2._id],
            genres: [genre._id, genre2._id],
            overview: 'Another movie about space.',
            status: 'status',
            poster: 'poster',
            image: 'image',
            imdbScore: 1000,
            imdbRating: 9.5,
            runtime: 120,
            airDate: date,
            apiID: '1'
        });
        MovieService.create(movie)
            .then( (created) => {
                MovieService.findGenresOf(created)
                    .then((genreResult) => {
                        assert.equal(genreResult.genres[0].name, 'Adventure');
                        assert.equal(genreResult.genres[1].name, 'Fantastic');
                        done();
                    });
            });

    });


    it('should not find star names of nonexistent movie', (done) => {

        const movie = new Movie({
            name: 'Star Trek',
            stars: [star1._id,star2._id],
            genres: [genre._id],
            overview: 'Movie about wizards.',
            status: 'status',
            poster: 'poster',
            image: 'image',
            imdbScore: 1000,
            imdbRating: 9.5,
            runtime: 120,
            airDate: date,
            apiID: '1'
        });
        MovieService.findStarsOf(movie)
            .then((result) => {

            }).catch((error) => {
            assert.equal(error, "Movie does not exist");
            done();
        });
    });

    it('should not find genres of nonexistent movie', (done) => {

        const movie = new Movie({
            name: 'The Dark Night',
            stars: [star1._id,star2._id],
            genres: [genre._id, genre2._id],
            overview: 'Movie about a bat.',
            status: 'status',
            poster: 'poster',
            image: 'image',
            imdbScore: 1000,
            imdbRating: 9.5,
            runtime: 120,
            airDate: date,
            apiID: '1'
        });
        MovieService.findGenresOf(movie)
            .then((result) => {

            }).catch((error) => {
            assert.equal(error, "Movie does not exist");
            done();
        });
    });

    it('should find movies of the star', (done) => {
        const movie = new Movie({
            name: 'Transformers',
            stars: [star3._id],
            genres: [genre._id, genre2._id],
            overview: 'Movie about alien robots.',
            status: 'status',
            poster: 'poster',
            image: 'image',
            imdbScore: 1000,
            imdbRating: 9.5,
            runtime: 120,
            airDate: date,
            apiID: '1'
        });
        MovieService.create(movie)
            .then( (created) => {
                MovieService.findMoviesOf(star3)
                    .then((movies) => {
                        assert.equal(movies.length, 2);
                        done();
                    });
            });

    });

    it('should delete the movie', (done) => {
        const movie = new Movie({
            name: 'Transformers',
            stars: [star1._id],
            genres: [genre._id, genre2._id],
            overview: 'Movie about alien robots.',
            status: 'status',
            poster: 'poster',
            image: 'image',
            imdbScore: 1000,
            imdbRating: 9.5,
            runtime: 120,
            airDate: date,
            apiID: '1'
        });
        MovieService.create(movie)
            .then((test) => {
                MovieService.delete(movie._id)
                    .then((result) => {
                        assert.equal(result.name, "Transformers");
                        done();
                    });
            });
    });

    it('should not delete nonexistent movie', (done) => {
        const movie = new Movie({
            name: 'Arrival',
            stars: [star1._id],
            genres: [genre._id, genre2._id],
            overview: 'Movie about aliens.',
            status: 'status',
            poster: 'poster',
            image: 'image',
            imdbScore: 1000,
            imdbRating: 9.5,
            runtime: 120,
            airDate: date,
            apiID: '1'
        });
        MovieService.delete(movie._id)
            .then((result) => {

            }).catch((error) => {
            assert.equal(error, "Movie does not exist");
            done();
        });
    });
});