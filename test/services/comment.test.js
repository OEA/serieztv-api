/**
 * Created by gbu on 26/11/2016.
 */
import assert from 'assert';
import mongoose from 'mongoose';
import Comment from '../../src/Models/Comment';
import Movie from '../../src/Models/Movie';
import Star from '../../src/Models/Star';
import Genre from '../../src/Models/Genre';
import Series from '../../src/Models/Series';
import User from '../../src/Models/User';
import CommentService from '../../src/Services/Comment/index';
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
    name: 'Politics',
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

const user = new User({
    name: 'Obi-Wan Kenobi',
    username: 'ObiWan',
    email: 'deathstar@gmail.com',
    password: '1234',
    activated: true,
    apiID: '1'
});

describe('CommentService', ()=> {
    before((done) => {
        Comment.remove({}).then(()=> {
            star1.save();
            star2.save();
            user.save();
            genre.save();
            series.save();
            done();
        });
    });

    it('should create new comment', (done) => {
        const comment = new Comment({
            user: user._id,
            comment: 'This series is awesome!',
            type: series._id,
            activate: true,
            apiID: '1'
        });
        CommentService.create(comment)
            .then((result) => {
                assert.equal(result.comment, "This series is awesome!");
                done();
            });
    });

    it('should not create comment that has missing argument', (done) => {
        const comment = new Comment({
            user: user._id,
            comment: 'This series is awesome!',
            type: series._id,
            activate: true
        });
        CommentService.create(comment)
            .then((result) => {

            }).catch((error) => {
            assert.equal(error, "Could not create comment");
            done();
        });
    });

    it('should find username of comment owner', (done) => {
        const comment = new Comment({
            user: user._id,
            comment: 'I like this series!',
            type: series._id,
            activate: true,
            apiID: '1'
        });
        CommentService.create(comment)
            .then((created) => {
                CommentService.findOwnerOfComment(created)
                    .then((result) => {
                        assert.equal(result.user.username, 'ObiWan');
                        done();
                    })
            });
    });

    it('should not find owner username of nonexistent comment', (done) => {
        const comment = new Comment({
            user: user._id,
            comment: 'I dont like this series!',
            type: series._id,
            activate: true,
            apiID: '1'
        });
        CommentService.findOwnerOfComment(comment)
            .then((result) => {

            }).catch((error) => {
            assert.equal(error, "Comment does not exist");
            done();
        });
    });

    it('should find name of the comment type', (done) => {
        const comment = new Comment({
            user: user._id,
            comment: 'House of cards fantastic!',
            type: series._id,
            activate: true,
            apiID: '1'
        });
        CommentService.create(comment)
            .then( (created) => {
                CommentService.findTypeOfComment(created)
                    .then((result) => {
                        console.log(result);
                        assert.equal(result.type.name, 'House of Cards');
                        done();
                    });
            });
    });

    it('should not find type name of nonexistent comment', (done) => {
        const comment = new Comment({
            user: user._id,
            comment: 'House of cards is not fantastic!',
            type: series._id,
            activate: true,
            apiID: '1'
        });
        CommentService.findTypeOfComment(comment)
            .then((result) => {

            }).catch((error) => {
            assert.equal(error, "Comment does not exist");
            done();
        });
    });

    it('should find comments of the user', (done) => {
        CommentService.findCommentsOfUser(user)
            .then( (comments) => {
                assert.equal(comments.length, 3);
                done();
            });
    });

    it('should find comments of the media', (done) => {
        CommentService.findCommentsOfMedia(series)
            .then( (comments) => {
                assert.equal(comments[1].comment, 'I like this series!');
                done();
            });
    });

    it('should not delete nonexistent comment', (done) => {
        const comment = new Comment({
            user: user._id,
            comment: 'House of cards is far away from fantastic!',
            type: series._id,
            activate: true,
            apiID: '1'
        });
        CommentService.delete(comment._id)
            .then((result) => {

            }).catch((error) => {
            assert.equal(error, "Comment does not exist");
            done();
        });
    });

    it('should delete the comment', (done) => {
        const comment = new Comment({
            user: user._id,
            comment: 'House of cards is not fantastic!',
            type: series._id,
            activate: true,
            apiID: '1'
        });
        CommentService.create(comment)
            .then((created) => {
                CommentService.delete(created._id)
                    .then((result) => {
                        assert.equal(result.comment, "House of cards is not fantastic!");
                        done();
                    });
            });
    });
});