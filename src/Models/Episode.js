import mongoose from 'mongoose'

var Schema = mongoose.Schema;

const episodeSchema = new Schema ({
    name: {type: String, required: true},
    number: {type: Number, required: true, default: 0},
    overview: {type: String},
    apiID: {type: String, required: true, select: false},
    createdAt: {type: Date},
    updatedAt: {type: Date}
});

episodeSchema.set('toJSON', { getters: true });


export default mongoose.model('Episode', episodeSchema);