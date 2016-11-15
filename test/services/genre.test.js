/**
 * Created by gbu on 15/11/2016.
 */
import assert from 'assert';
import mongoose from 'mongoose';
import Genre from '../../src/Models/Genre';
import GenreService from '../../src/Services/Genre/index';
import bluebird from 'bluebird';

bluebird.promisifyAll(mongoose);

describe('Genre', ()=> {

    before((done) => {
        Genre.remove({}).then(()=> {
            done();
        });
    });

    it('should create new genre', (done) => {
        const genre = new Genre({
            name: 'Comedy',
            apiID: '1'
        });
        GenreService.create(genre)
            .then((result) => {
                console.log(result);
                assert.equal(result.name, "Comedy");
                done();
            });
    });

    it('should not create genre that already exists', (done) => {
        const genre = new Genre({
            name: 'Comedy',
            apiID: '1'
        });
        GenreService.create(genre)
            .then((result) => {

            }).catch((error) => {
                console.log(result);
                assert.equal(error, "Genre already exists");
                done();
            });
    });

    it('should search and return for genre', (done) => {
        const genre = new Genre({
            name: 'Comedy',
            apiID: '1'
        });
        GenreService.search(genre.name)
            .then((result) => {
                console.log(result);
                assert.equal(result, genre);
                done();
            });
    });

    it('should search and not return for nonexistent genre', (done) => {
        const genre = new Genre({
            name: 'Comedy',
            apiID: '1'
        });
        GenreService.search(genre.name)
            .then((result) => {

            }).catch((error) => {
                assert.equal(error, "Genre does not exist");
                done();
            });
    });



    it('should delete the genre', (done) => {
        const genre = new Genre({
            name: 'Comedy',
            apiID: '1'
        });
        GenreService.delete(genre.name)
            .then((result) => {
                console.log(result);
                assert.equal(result.name, "Comedy");
                assert.equal(result.apiID, "1");
                done();
            });
    });

    it('should not delete nonexistent genre', (done) => {
        const genre = new Genre({
            name: 'Comedy',
            apiID: '1'
        });
        GenreService.delete(genre.name)
            .then((result) => {

            }).catch((error) => {
                assert.equal(error, "Genre does not exist");
                done();
            });
    });
});
