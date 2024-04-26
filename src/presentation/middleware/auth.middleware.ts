import { NextFunction, Request, Response } from "express";
import { jwtVerify } from "../../config";
import { UserModel } from "../../data";
import { UserEntity } from "../../domain";


export class AuthMiddleware {

    static async validateJWT( req: Request, res:Response, next: NextFunction ){

        const authorization = req.header('Authorization');
        if(!authorization) return res.status(401).json({ error:'No Token Provided' });
        if( !authorization.startsWith('Bearer ') ) return res.status(401).json({ error:'Invalid Token Bearer' });

        const token  = authorization.split(' ').at(1) || '';


        try {

            const payload = await jwtVerify(token);
            const { payload: { id } } = payload as { payload: { id:string } };
            if(!id) return res.status(401).json({ error: 'Invalid Token' });

            const user = await UserModel.findById(id);
          

            if(!user) return res.status(401).json({ error: 'Invalid Token - user' });

            req.body.user = UserEntity.fromObject(user);
            next();
            
        } catch (error) {
            console.log(error);
            res.status(500).json({ error:'Internal Server Error' });
        }


    }



}