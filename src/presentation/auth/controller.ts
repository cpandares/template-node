import { Request, Response } from 'express';
import { CustomError, LoginUserDto, RegisterUserDto } from '../../domain';
import { AuthService } from '../services/auth/auth.service';

export class AuthController {

    constructor(
        public readonly authService:AuthService
    ) {

    }

    private handleError = (error:unknown, res:Response) => {
        if(error instanceof CustomError){
            return res.status(error.statusCode).json({error: error.message})
        }
        res.status(500).json({error: 'Internal Server Error'})
    }


    register = ( req:Request, res:Response )=>{

        const [error,registerDto] = RegisterUserDto.create(req.body)

        if(error) return res.status(400).json({error})


        this.authService.registerUser(registerDto!)
        .then(user => res.json(user))
        .catch(error => this.handleError(error,res))
    }


    login = ( req:Request, res:Response )=>{
        const [error, loginDto ] = LoginUserDto.create(req.body);

        if(error) return res.status(400).json({error});

        this.authService.login(loginDto!)
            .then( user => res.json(user) )
            .catch(error => this.handleError(error,res))

       
    }


    validateEmail = ( req:Request, res:Response )=>{


        res.json({
            ok: true,
            message: 'Validate Email'
        })
    }

}