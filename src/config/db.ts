import mongoose from 'mongoose'
import color from 'colors'
import { exit } from 'node:process';
import colors from 'colors';

export const connectDB = async () => {
    try {
        const connection = await mongoose.connect(process.env.DATABASE_URL)

        const url =`${connection.connection.host}:${connection.connection.port}` 

        console.log(colors.magenta.bold(`mongodb conectado en: ${url}`));
        
    } catch (error) {
        console.log(colors.red.bold(error));
        exit(1) 
    }
}