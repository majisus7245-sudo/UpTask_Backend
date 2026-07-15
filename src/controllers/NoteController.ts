import { Request, Response } from "express";
import Note, {INote} from "../models/Note";
import { Types } from "mongoose";

type NoteParams = {
    noteId: Types.ObjectId
}

export class NoteController {
    static createNote = async (req : Request<{}, {}, INote>, res : Response) => {
        try {
            const { content } = req.body
            const note = new Note()
            note.content = content
            note.createdBy = req.user._id
            note.task = req.task._id

            req.task.notes.push(note._id)

            Promise.allSettled([req.task.save(), note.save()])
            res.send('Nota creada Correctamente')
        } catch (error) {
            res.status(500).json({error: 'Hubo un error'})
        }
    }

    static getTaskNotes = async (req : Request<{}, {}, INote>, res : Response) => {
        try {   
            const notes = await Note.find({task: req.task._id})

            res.json({notes})
        } catch (error) {
            res.status(500).json({error: 'Hubo un error'})
        }
    }

    static deleteNote = async (req : Request<NoteParams>, res : Response) => {
        const { noteId } = req.params
        const note = await Note.findById(noteId)

        if(!note) {
            const error = new Error('Nota no Encontrada')
            return res.status(404).json({error: error.message})
        }

        if(note.createdBy._id.toString() !== req.user._id.toString()){
            const error = new Error('Accion no Valida')
            return res.status(404).json({error: error.message})
        }

        req.task.notes = req.task.notes.filter( note => note._id.toString() !== noteId.toString())

        try {
            await Promise.allSettled([note.deleteOne(), req.task.save()])
            res.send('Nota Eliminada')
        } catch (error) {
            res.status(500).json({error: 'Hubo un error'})
        }
    }
}