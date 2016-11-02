import mongoose from 'mongoose'

var Schema = mongoose.Schema;

const characterSchema =  new Schema ({
    star: {type: Schema.Types.ObjectId, ref: 'Star', required: true},
    characterName: {type: String, required: true},
    characterImage: {type: String, required: true},
    apiID: {type: String, required: true, select: false},
    createdAt: {type: Date},
    updatedAt: {type: Date}
});

characterSchema.set('toJSON', { getters: true });

export default mongoose.model('Character', characterSchema);