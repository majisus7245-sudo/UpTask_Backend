import mongoose, { Schema, Document, PopulatedDoc, Types } from 'mongoose'
import Task, { ITask } from './Task'
import { IUser } from './User'
import Note from './Note'

export interface IProject extends Document {
    projectName: string
    clientName: string
    description: string
    tasks: PopulatedDoc<ITask & Document>[]
    manager: PopulatedDoc<IUser & Document>
    team: PopulatedDoc<IUser & Document>[]
}

const ProjectSchema: Schema = new Schema({
    projectName: {
        type: String, 
        reqired: true,
        trim: true,
        unique: true
    },
    clientName: {
        type: String, 
        reqired: true,
        trim: true,
        unique: true
    },
    description: {
        type: String, 
        reqired: true,
        trim: true,
        unique: true
    },
    tasks: [
        {
            type: Types.ObjectId,
            ref: 'Task'
        }
    ],
    manager: {
        type: Types.ObjectId,
        ref: 'User' 
    },
    team: [
        {
            type: Types.ObjectId,
            ref: 'User' 
        }  
    ]
}, {timestamps: true})

ProjectSchema.pre('deleteOne', {document: true}, async function() {
    const projectId = this._id

    if(!projectId)
        return

    const tasks = await Task.find({project : projectId})
    for(const task of tasks){
        await Note.deleteMany({task: task.id})
    }
    
    await Task.deleteMany({project: projectId})
})

const Project = mongoose.model<IProject>('Project', ProjectSchema)

export default Project