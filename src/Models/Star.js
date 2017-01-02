import mongoose from 'mongoose'
var Schema = mongoose.Schema;

const starSchema = new Schema ({
    name: {type: String, required: true},
    image: {type: String},
    biography: {type: String},
    birthday: {type: Date},
    createdAt: {type: Date},
    updatedAt: {type: Date},
    active: {type: Boolean, required: true},
    apiID: {type: String, required: true, unique: true, select: false}
});

starSchema.set('toJSON', { getters: true });

export default mongoose.model('Star', starSchema);