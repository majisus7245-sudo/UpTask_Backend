import type { Request, Response, NextFunction } from 'express'
import Task, { ITask } from '../models/Task'

declare global {
    namespace Express{
        interface Request {
            task: ITask
        }
    }
}

export async function validateTaskExists(req: Request, res: Response, next: NextFunction){
    const { taskId } = req.params
    try {
        const task = await Task.findById(taskId)

        if(!task){
            const error = new Error('Tarea no Encontrada')
            return res.status(404).json({error : error.message})
        }

        req.task = task
        
        next()
    } catch (error) {
        res.status(500).json({error: "Hubo un error"})
    }
}

export function taskBelongToProject(req: Request, res: Response, next: NextFunction){

     if(req.task.project.toString() !== req.project._id.toString()){
        const error = new Error('Accion no valida')
        return res.status(404).json({error : error.message})
    }
    next()
}

export function hasAuthorization(req: Request, res: Response, next: NextFunction){
     if(req.user._id.toString() !== req.project.manager.toString()){
        const error = new Error('Accion no valida')
        return res.status(404).json({error : error.message})
    }
    next()
}