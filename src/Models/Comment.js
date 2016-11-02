/**
 * Created by omeremreaslan on 25/10/2016.
 */

import mongoose from 'mongoose'

var Schema = mongoose.Schema;

const commentScheme =  new Schema ({
    user: {type: Schema.Types.ObjectId, ref: 'User'},
    comment: {type: String, required: true},
    object: {type: Schema.Types.ObjectId, $or: [{ref: 'Movie'}, {ref: 'Series'}]},
    activate: {type: Boolean, required: true, default: true},
    apiID: {type: String, required: true, select: false},
    createdAt: {type: Date},
    updatedAt: {type: Date}
});

commentScheme.set('toJSON', { getters: true });

export default mongoose.model('Comment', commentScheme);