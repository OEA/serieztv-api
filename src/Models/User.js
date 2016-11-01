import mongoose from 'mongoose'
var Schema = mongoose.Schema;

const userSchema = new Schema ({
    name: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    activated: {type: Boolean, required: true},
    activation: {type: Boolean, select: false},
    forgotten: {type: Boolean, select: false},
    apiID: {type: String, required: true, select: false},
    createdAt: {type: Date},
    updatedAt: {type: Date}
});

export default mongoose.model('User', userSchema);