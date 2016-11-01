import mongoose from 'mongoose'
var Schema = mongoose.Schema;

const starSchema = new Schema ({
    name: {type: String, required: true},
    image: {type: String, required: true},
    birthday: {type: Date},
    createdAt: {type: Date},
    updatedAt: {type: Date},
    active: {type: Boolean, required: true},
    apiID: {type: String, required: true, select: false}
});

export default mongoose.model('Star', starSchema);