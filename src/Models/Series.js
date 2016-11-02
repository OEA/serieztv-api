import mongoose from 'mongoose'


var Schema = mongoose.Schema;

const seriesSchema = new Schema ({
    name: {type: String, required: true},
    stars: [{type: Schema.ObjectId, ref: 'Star'}],
    genres: [{type: Schema.ObjectId, ref: 'Genre'}],
    overview: {type: String, required: true},
    status: {type: String, required: true},
    poster: {type: String, required: true},
    image: {type: String, required: true},
    imdbScore: {type: Number, required: true},
    imdbRating: {type: Number, required: true},
    runtime: {type: Number, required: true},
    firstAir: {type: Date, required: true},
    createdAt: {type: Date},
    updatedAt: {type: Date},
    active: {type: Boolean, required: true},
    apiID: {type: String, required: true, select: false}
});

export default mongoose.model('Series', seriesSchema);