import mongoose from 'mongoose'
var Schema = mongoose.Schema;

const crewSchema = new Schema ({
    name: {type: String, required: true},
    image: {type: String, required: true},
    birthday: {type: Date, required: true},
    job: {type: String, required: true},
    department: {type: String, required: true},
    apiID: {type: String, required: true, select: false},
    createdAt: {type: Date},
    updatedAt: {type: Date}
});

export default mongoose.model('Crew', crewSchema);