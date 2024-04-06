import { bcryptAdapter, jwtAdapter } from "../../../config";
import { UserModel } from "../../../data";
import { CustomError, LoginUserDto, RegisterUserDto, UserEntity } from "../../../domain";




export class AuthService {

    constructor(){

    }

   public async  registerUser( dto:RegisterUserDto ){

        const existUser = await UserModel.findOne({ email:dto.email });

        if(existUser) throw CustomError.badRequest('Email already exists');

        try {   
            const user = new UserModel(dto);
            
            /* encriptar passoword */
            user.password = bcryptAdapter.hash(dto.password);
            
            /* generar JWT */
             
            await user.save();

            /* Send Email */
            const { password, ...rest } = UserEntity.fromObject(user);


            return { 
                user: {
                    ...rest
                },
                token: 'jwt'
             };
            
        } catch (error) {
            throw CustomError.internalServerError(`${error}`);
        }

    }


    public async login( dto:LoginUserDto ){

        const user = await UserModel.findOne({ email: dto.email });

        if(!user) throw CustomError.badRequest('Email o password is invalid');

        const isPasswordMatch = bcryptAdapter.compare( dto.password, user.password! );
        console.log(isPasswordMatch)
        if ( !isPasswordMatch ) throw CustomError.badRequest('Email o password is invalid');

        let { password, ...rest } = UserEntity.fromObject(user);

        const token = await jwtAdapter({ id: user.id });

        if(!token) throw CustomError.internalServerError('Error generating token');

        return {
            user:{
                rest
            },
            token
        }

    }


}