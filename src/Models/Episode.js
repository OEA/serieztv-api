import mongoose from 'mongoose'

var Schema = mongoose.Schema;

const episodeSchema = new Schema ({
    name: {type: String, required: true},
    season: {type: mongoose.Schema.ObjectId, ref: 'Season', required: true},
    crew: [{type: mongoose.Schema.ObjectId, ref: 'Crew', required: true}],
    guestStars: [{type: mongoose.Schema.ObjectId, ref: 'Star', required: true}],
    overview: {type: String, required: true},
    imdbScore: {type: Number, required: true},
    imdbRating: {type: Number, required: true},
    apiID: {type: String, required: true, select: false},
    createdAt: {type: Date},
    updatedAt: {type: Date}
});

episodeSchema.set('toJSON', { getters: true });


export default mongoose.model('Episode', episodeSchema);