import mongoose from 'mongoose'


var Schema = mongoose.Schema;

const seriesSchema = new Schema ({
    name: {type: String, required: true},
    characters: [{type: Schema.ObjectId, ref: 'Character'}],
    genres: [{type: Schema.ObjectId, ref: 'Genre'}],
    seasons: [{type: Schema.ObjectId, ref: 'Season'}],
    overview: {type: String, required: true},
    status: {type: String, required: true},
    poster: {type: String, required: true},
    image: {type: String, required: true},
    imdbScore: {type: Number, required: true},
    imdbRating: {type: Number, required: true},
    imdbID: {type: String},
    runtime: {type: Number, required: true},
    firstAir: {type: Date, required: true},
    createdAt: {type: Date},
    updatedAt: {type: Date},
    active: {type: Boolean, required: true},
    apiID: {type: String, required: true, select: false}
});

seriesSchema.set('toJSON', { getters: true });

export default mongoose.model('Series', seriesSchema);