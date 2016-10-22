import mongoose from 'mongoose'
var Schema = mongoose.Schema;

const genreSchema = new Schema ({
    name: {type: String, required: true},
    apiID: {type: String, required: true, select: false},
    createdAt: {type: Date},
    updatedAt: {type: Date}
});

export default mongoose.model('Genre', genreSchema);