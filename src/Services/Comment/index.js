/**
 * Created by gbu on 26/11/2016.
 */
import mongoose from 'mongoose';
import Comment from '../../Models/Comment.js';
import Promise from 'bluebird';

Promise.promisifyAll(mongoose);

const CommentErrorMessages = {
    COMMENT_ALREADY_EXISTS: "Comment already exists",
    CANNOT_CREATE_COMMENT: "Could not create comment",
    COMMENT_NOT_EXIST: "Comment does not exist"
};

class CommentService {

    static create(comment) {
        return new Promise((resolve, reject) => {
            comment.save((error) => {
                if (error) {
                    reject(CommentErrorMessages.CANNOT_CREATE_COMMENT);
                } else {
                    resolve(comment);
                }
            });
        });
    }

    static delete(id) {
        return new Promise((resolve, reject) => {
            Comment.find({_id:id}).count((error, count) => {
                if (count == 0 || error) {
                    reject(CommentErrorMessages.COMMENT_NOT_EXIST);
                }
            }).then((res) => {
                Comment.findOneAndRemove({_id: id}, (error, comment) => {
                    if (error) {
                        console.log(error);
                    } else {
                        resolve(comment);
                    }
                });
            });

        });
    }

    static findTypeOfComment(comment) {
        return new Promise((resolve, reject) => {
            Comment.find({_id:comment._id}).count((error, count) => {
                if (count == 0 || error) {
                    reject(CommentErrorMessages.COMMENT_NOT_EXIST);
                }
            }).then((count) => {
                Comment.findOne({_id: comment._id}).populate('type').exec((error, founded) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(founded);
                    }
                });
            });
        });
    }



    static findOwnerOfComment(comment) {
        return new Promise((resolve, reject) => {
            Comment.findOne({_id:comment._id}).count((error, count) => {
                if (count == 0 || error) {
                    reject(CommentErrorMessages.COMMENT_NOT_EXIST);
                }
            }).then((count) => {
                Comment.findOne({_id: comment._id}).populate('user').exec((error, founded) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(founded);
                    }
                });
            });
        });
    }

    static populateComment(comment) {
        return new Promise((resolve, reject) => {
            Comment.find({_id:comment._id}).count((error, count) => {
                if (count == 0 || error) {
                    reject(CommentErrorMessages.COMMENT_NOT_EXIST);
                }
            }).then((count) => {
                Comment.findOne({_id: comment._id}).populate([{path: 'user'}, {path: 'type'}]).exec((error, commentPopulated) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(commentPopulated);
                    }
                });
            });
        });
    }

    static findCommentsOfUser(user) {
        return new Promise((resolve, reject) => {
            Comment.find({user: {$in: [user._id]}}).populate([{path: 'user'}]).exec((error, comments) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(comments);
                }
            });
        });
    }

    static findCommentsOfMedia(media) {
        return new Promise((resolve, reject) => {
            Comment.find({type: {$in: [media._id]}}).populate([{path: 'type'}]).exec((error, comments) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(comments);
                }
            });
        });
    }
}

export default CommentService;