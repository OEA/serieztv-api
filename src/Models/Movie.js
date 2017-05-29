import mongoose from 'mongoose'
import mongoosastic from 'mongoosastic';


var Schema = mongoose.Schema;

const movieSchema = new Schema ({
    name: {type: String, required: true, es_indexed: true},
    characters: [{
        type: mongoose.Schema.ObjectId,
        ref:'Character',
        required: true,
        es_type:'nested', es_include_in_parent:true, es_indexed: true}],
    genres: [{type: mongoose.Schema.ObjectId, ref:'Genre', required: true, es_type:'nested', es_include_in_parent:true, es_indexed: true}],
    overview: {type: String, required: true, es_indexed: true},
    status: {type: String, required: true, es_indexed: true},
    poster: {type: String, required: true, es_indexed: true},
    image: {type: String, required: true, es_indexed: true},
    imdbScore: {type: Number, es_indexed: true},
    imdbRating: {type: Number, es_indexed: true},
    imdbID: {type: String, es_indexed: true},
    runtime: {type: Number, required: true, es_indexed: true},
    airDate: {type: Date, required: true, es_indexed: true},
    createdAt: {type: Date, es_indexed: true},
    updatedAt: {type: Date, es_indexed: true},
    apiID: {type: String, required: true, unique: true}
});

movieSchema.plugin(mongoosastic, {
    populate: [
        {
            path: 'characters',
            populate: {
                path: 'star'
            }
        },
        {path: 'genres'},
    ]
});

movieSchema.set('toJSON', { getters: true });

export default mongoose.model('Movie', movieSchema);