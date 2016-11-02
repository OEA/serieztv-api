
import mongoose from 'mongoose'
var Schema = mongoose.Schema;

const seasonSchema = new Schema ({
    name: {type: String, required: true},
    number: {type: Number, required: true},
    poster: {type: String, required: true},
    series: {type: mongoose.Schema.ObjectId, ref: 'Series', required: true},
    overview: {type: String, required: true},
    airDate: {type: Date, required: true},
    apiID: {type: String, required: true, select: false},
    createdAt: {type: Date},
    updatedAt: {type: Date}
});


seasonSchema.set('toJSON', { getters: true });

export default mongoose.model('Season', seasonSchema);