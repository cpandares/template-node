
import jwt from 'jsonwebtoken';
import { envs } from './envs';


const secret = envs.JWT_SECRET;

export const jwtAdapter = (payload:any, expiresIn:string = '2h') =>{
        
     return new Promise((resolve) => {
        jwt.sign({ payload }, secret, { expiresIn }, (err, token) => {
            if (err) return resolve(null);
            
            resolve(token);
        });
     });


}


export const jwtVerify = (token:string) =>{
    return new Promise((resolve) => {
        jwt.verify(token, secret, (err, decoded) => {
            if ( err ) return resolve(null);
            
            resolve(decoded);
        });
    });
}