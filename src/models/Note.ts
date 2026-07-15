import mongoose, { Schema, Document, Types } from 'mongoose'

export interface INote extends Document {
    content: string
    createdBy: Types.ObjectId
    task: Types.ObjectId
}

const NOteSchema : Schema = new Schema({
    content: {
        type: String,
        required: true
    },
    createdBy: {
        type: Types.ObjectId,
        ref: 'User',
        required: true
    },
    task: {
        type: Types.ObjectId,
        ref: 'Task',
        required: true
    }
}, {timestamps: true})

const Note = mongoose.model<INote>('Note', NOteSchema)

export default Note