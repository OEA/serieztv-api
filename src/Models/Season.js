
import mongoose from 'mongoose'
var Schema = mongoose.Schema;

const seasonSchema = new Schema ({
    name: {type: String, required: true},
    number: {type: Number, required: true},
    poster: {type: String, required: true},
    seriesID: {type: Number, required: true},
    overview: {type: String, required: true},
    airDate: {type: Date, required: true},
    apiID: {type: String, required: true, select: false},
    createdAt: {type: Date},
    updatedAt: {type: Date},
    active: {type: Number, required: true}
});

export default mongoose.model('Season', seasonSchema);