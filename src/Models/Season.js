
import mongoose from 'mongoose'
var Schema = mongoose.Schema;

const seasonSchema = new Schema ({
    name: {type: String, required: true},
    episodes: [{type: Schema.ObjectId, ref: 'Episode'}],
    number: {type: Number, required: true},
    poster: {type: String, required: true},
    overview: {type: String, required: true},
    airDate: {type: Date},
    apiID: {type: String, required: true, select: false},
    createdAt: {type: Date},
    updatedAt: {type: Date}
});


seasonSchema.set('toJSON', { getters: true });

export default mongoose.model('Season', seasonSchema);