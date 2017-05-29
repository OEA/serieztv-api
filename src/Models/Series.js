import mongoose from 'mongoose'
import mongoosastic from 'mongoosastic';


var Schema = mongoose.Schema;

const seriesSchema = new Schema ({
    name: {type: String, required: true, es_indexed: true},
    characters: [{type: Schema.ObjectId, ref: 'Character', required: true,
        es_type:'nested', es_include_in_parent:true, es_indexed: true}],
    genres: [{type: Schema.ObjectId, ref: 'Genre', required: true,
        es_type:'nested', es_include_in_parent:true, es_indexed: true}],
    seasons: [{type: Schema.ObjectId, ref: 'Season', required: true,
        es_type:'nested', es_include_in_parent:true, es_indexed: true}],
    overview: {type: String, required: true, es_indexed: true},
    status: {type: String, required: true, es_indexed: true},
    poster: {type: String, required: true, es_indexed: true},
    image: {type: String, required: true, es_indexed: true},
    imdbScore: {type: Number, required: true, es_indexed: true},
    imdbRating: {type: Number, required: true, es_indexed: true},
    imdbID: {type: String, es_indexed: true},
    runtime: {type: Number, required: true},
    firstAir: {type: Date, required: true},
    createdAt: {type: Date, es_indexed: true},
    updatedAt: {type: Date, es_indexed: true},
    active: {type: Boolean, required: true, es_indexed: true},
    apiID: {type: String, required: true, select: false, es_indexed: true}
});

seriesSchema.plugin(mongoosastic, {
    populate: [
        {
            path: 'characters',
            populate: {
                path: 'star'
            }
        },
        {
            path: 'genres'
        },
        {
            path: 'season',
            populate: {
                path: 'episode'
            }
        }
    ]
});

seriesSchema.set('toJSON', { getters: true });

export default mongoose.model('Series', seriesSchema);