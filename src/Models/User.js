import mongoose from 'mongoose'
var Schema = mongoose.Schema;

const userSchema = new Schema ({
    name: {type: String, required: true},
    username: {type: String, required: true, unique: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    activated: {type: Boolean, required: true},
    activation: {type: Boolean, select: false},
    forgotten: {type: Boolean, select: false},
    apiID: {type: String, select: false},
    createdAt: {type: Date},
    updatedAt: {type: Date},
    followers: [{type: mongoose.Schema.ObjectId, ref:'User'}],
    following: [{type: mongoose.Schema.ObjectId, ref:'User'}],
    followedMovies: [{type: mongoose.Schema.ObjectId, ref:'Movie'}],
    followedSeries: [{type: mongoose.Schema.ObjectId, ref:'Series'}],
    __v: {type: Number, select: false},
});

export default mongoose.model('User', userSchema);