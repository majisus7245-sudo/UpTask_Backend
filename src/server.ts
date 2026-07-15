import express from "express";
import morgan from "morgan";
import dotenv from 'dotenv'
import cors from "cors"
import { corsConfig } from "./config/cors";
import { connectDB } from "./config/db";
import projectRoutes from './routes/projectRoutes'
import authRoutes from './routes/authRoutes'

dotenv.config()

connectDB()

const server = express()
server.use(cors(corsConfig))

//Logging
server.use(morgan('dev'))

//Leer datos de formularios
server.use(express.json())

//Routes
server.use('/api/auth', authRoutes)
server.use('/api/projects', projectRoutes)

export default server