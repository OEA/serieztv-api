import mongoose from 'mongoose'
import mongoosastic from 'mongoosastic';

var Schema = mongoose.Schema;

const characterSchema =  new Schema ({
    star: {type: Schema.Types.ObjectId, ref: 'Star', required: true,
        es_type:'nested', es_include_in_parent:true, es_indexed: true},
    characterName: {type: String, required: true, es_indexed: true},
    characterImage: {type: String, es_indexed: true},
    apiID: {type: String, required: true, select: false, es_indexed: true},
    createdAt: {type: Date, es_indexed: true},
    updatedAt: {type: Date, es_indexed: true}
});

characterSchema.plugin(mongoosastic, {
    populate: [
        {path: 'star'}
    ]
});

characterSchema.set('toJSON', { getters: true });

export default mongoose.model('Character', characterSchema);