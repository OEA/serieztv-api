/**
 * Created by gbu on 12/02/2017.
 */
import mongoose from 'mongoose'
var Schema = mongoose.Schema;

const userListSchema = new Schema ({
    userId: {type: mongoose.Schema.ObjectId, ref:'User', required: true},
    movies: [{type: mongoose.Schema.ObjectId, ref:'Movie'}],
    series: [{type: mongoose.Schema.ObjectId, ref:'Series'}],
    listName: {type: String, unique: true},
    isPrivate: {type: Boolean, default: false}
});

userListSchema.set('toJSON', { getters: true });

export default mongoose.model('Userlist', userListSchema);