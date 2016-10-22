import mongoose from 'mongoose'
import Star from 'Star'
import Crew from 'Crew'

var Schema = mongoose.Schema;

const episodeSchema = new Schema ({
    name: {type: String, required: true},
    seasonID: {type: Number, required: true},
    crew: {type: [Crew], required: true},
    guestStars: {type: [Star], required: true},
    overview: {type: String, required: true},
    imdbScore: {type: Number, required: true},
    imdbRating: {type: Number, required: true},
    apiID: {type: String, required: true, select: false},
    createdAt: {type: Date},
    updatedAt: {type: Date}
});


export default mongoose.model('Episode', episodeSchema);