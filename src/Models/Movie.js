import mongoose from 'mongoose'


var Schema = mongoose.Schema;

const movieSchema = new Schema ({
    name: {type: String, required: true},
    characters: [{type: mongoose.Schema.ObjectId, ref:'Character', required: true}],
    genres: [{type: mongoose.Schema.ObjectId, ref:'Genre', required: true}],
    overview: {type: String, required: true},
    status: {type: String, required: true},
    poster: {type: String, required: true},
    image: {type: String, required: true},
    imdbScore: {type: Number},
    imdbRating: {type: Number},
    imdbID: {type: String},
    runtime: {type: Number, required: true},
    airDate: {type: Date, required: true},
    createdAt: {type: Date},
    updatedAt: {type: Date},
    apiID: {type: String, required: true, select: false}
});


movieSchema.set('toJSON', { getters: true });

export default mongoose.model('Movie', movieSchema);