/**
 * Created by gbu on 20/02/2017.
 */
import mongoose from 'mongoose'
var Schema = mongoose.Schema;

const ratingSchema = new Schema ({
    userId: {type: mongoose.Schema.ObjectId, ref:'User', required: true},
    movie: {type: mongoose.Schema.ObjectId, ref:'Movie'},
    series: {type: mongoose.Schema.ObjectId, ref:'Series'},
    rating: {type: Number, required: true}
});

ratingSchema.set('toJSON', { getters: true });

export default mongoose.model('Rating', ratingSchema);