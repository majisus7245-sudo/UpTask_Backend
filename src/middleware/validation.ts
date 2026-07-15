import type { Request, Response, NextFunction } from "express"
import { validationResult } from "express-validator"
import { printColor } from "../helpers"

export const handleInputErrors = (req : Request, res : Response, next : NextFunction) => {
    let errors = validationResult(req)
    
    if(!errors.isEmpty()){
        const errorMessages = errors.array().reduce((cadena, error) => error.msg + " " + cadena,'')
        printColor(errorMessages)
        return res.status(400).json({ errors: errorMessages })
    }
    next()
}