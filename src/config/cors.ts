import { CorsOptions } from 'cors'
import { printColor } from '../helpers'

export const corsConfig: CorsOptions = {
    origin: function(origin, callback){
        console.log("Origen " + origin);
        const whiteList = [process.env.FRONTEND_URL]
        console.log("WhiteL " + whiteList);
        if(process.argv[2] === '--api')
            whiteList.push(undefined)
        if(whiteList.includes(origin)){
            callback(null, true)
        }else{
            callback(new Error('Error de CORS'))
        }
    }
}