import mongoose from 'mongoose'
var Schema = mongoose.Schema;

const genreSchema = new Schema ({
    name: {type: String, required: true, unique: true},
    apiID: {type: String, required: true, select: false},
    createdAt: {type: Date},
    updatedAt: {type: Date}
});

genreSchema.set('toJSON', { getters: true });

export default mongoose.model('Genre', genreSchema);