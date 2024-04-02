import { Request, Response } from "express";




export class AuthController {

    constructor() {

    }

    register = ( req:Request, res:Response )=>{


        res.json({
            ok: true,
            message: 'register'
        })
    }


    login = ( req:Request, res:Response )=>{


        res.json({
            ok: true,
            message: 'login'
        })
    }


    validateEmail = ( req:Request, res:Response )=>{


        res.json({
            ok: true,
            message: 'Validate Email'
        })
    }

}