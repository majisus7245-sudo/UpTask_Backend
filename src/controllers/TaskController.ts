import type { Request, Response } from 'express'
import Project from '../models/Project';
import Task, { taskStatus } from '../models/Task';
import { printColor } from '../helpers/index';

export class TaskController {

    static createTask = async (req: Request, res: Response) => {        
        try {
            const { project } = req
            const task = new Task(req.body)

            task.project = project._id
            project.tasks.push(task._id)

            await Promise.allSettled([task.save(), project.save()])

            res.json('Tarea creada correctamente')
            
        } catch (error) {
            res.status(500).json({error: "Hubo un error"})
        }

    }

    static getProjectTasks = async (req: Request, res: Response) => {
        try {
            const { project } = req
            const tasks = await Task.find({
                project: project._id
            }).populate('project')
            res.json(tasks)
        } catch (error) {
            res.status(500).json({error: "Hubo un error"})
        }
    }

    static getTaskById = async (req: Request, res: Response) => {
        try {
            const task = await Task.findById(req.task._id)
                                    .populate({path: 'completedBy.user', select: "_id name email"})
                                    .populate({path: 'notes', populate: {path: 'createdBy', select: "_id name email"}})
            res.json(task)
        } catch (error) {
           res.status(500).json({error: "Hubo un error"}) 
        }
    }

    static updateTask = async (req: Request, res: Response) => {
        try {
            req.task.name = req.body.name
            req.task.description = req.body.description

            await req.task.save()

            res.json("Tarea actualizada correctamente")
        } catch (error) {
           res.status(500).json({error: "Hubo un error"}) 
        }
    }

    static deleteTask = async (req: Request, res: Response) => {
        try {

            req.project.tasks = req.project.tasks.filter( task => task._id.toString() != req.task._id.toString())
            await Promise.allSettled([req.task.deleteOne(), req.project.save()])

            res.json("Tarea eliminada correctamente")
        } catch (error) {
            res.status(500).json({error: "Hubo un error"}) 
        }
    }

    static updateStatusTask = async (req : Request, res : Response) => {
        try {

            const { status } = req.body
            req.task.status = status

            const data = {
                user: req.user._id,
                status
            }
            req.task.completedBy.push(data)
            await req.task.save()

            res.json("Tarea actualizada correctamente")
        } catch (error) {
            res.status(500).json({error: "Hubo un error"}) 
        }
    }

}