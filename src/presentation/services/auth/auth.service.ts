import { bcryptAdapter, envs, jwtAdapter, jwtVerify } from "../../../config";
import { UserModel } from "../../../data";
import { CustomError, LoginUserDto, RegisterUserDto, UserEntity } from "../../../domain";
import { EmailService } from "./email.service";




export class AuthService {

    constructor(
        private readonly emailService:EmailService
    ){

    }

   public async  registerUser( dto:RegisterUserDto ){

        const existUser = await UserModel.findOne({ email:dto.email });

        if(existUser) throw CustomError.badRequest('Email already exists');

        try {   
            const user = new UserModel(dto);
            
            /* encriptar passoword */
            user.password = bcryptAdapter.hash(dto.password);
             
            await user.save();            
            /* Send Email */            
            await this.sendEMailValidationLink( dto.email );
            
            const { password, ...rest } = UserEntity.fromObject(user);

            /* generar JWT */
            const token = await jwtAdapter({ id: user.id });
            if(!token) throw CustomError.internalServerError('Error generating token');

            return { 
                user: {
                    ...rest
                },
                token
             };
            
        } catch (error) {
            throw CustomError.internalServerError(`${error}`);
        }

    }


    public async login( dto:LoginUserDto ){

        const user = await UserModel.findOne({ email: dto.email });

        if(!user) throw CustomError.badRequest('Email o password is invalid');

        const isPasswordMatch = bcryptAdapter.compare( dto.password, user.password! );
        
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

    private sendEMailValidationLink = async(email:string) =>{

        const token = await jwtAdapter({ email:email });
       
        if(!token) throw CustomError.internalServerError('Error getting token');

        const link = `${envs.WEBSERVICE_URL}/auth/validate-email/${token}`;

        const html = `
            <h1>Validate you email </h1>
            <p>Click on the link to validate you email: ${email}</p>
            <a href="${link}">Clik here</a>
        `

        const options = {
            to: email,
            subject: 'Validate your email',
            htmlBody: html
        }

        const isSent = await this.emailService.sendEmail(options);
        if(!isSent) throw CustomError.internalServerError('Error sending email verification');

        return true;

    }



    public validateEmail = async( token:string ) =>{
     
        const payload = await jwtVerify(token);
       
        if(!payload) throw CustomError.unAuthorized('Invalid Token');

        const { payload: { email } } = payload as { payload: { email:string } };
      

        if(!email) throw CustomError.internalServerError(`Error getting email from token ${email} ${token}` );

        const user = await UserModel.findOne({email});

        if(!user) throw CustomError.badRequest('Email not Found');
       
        try {
            user.isValidated = true;
            await user.save();
    
            return true;
        } catch (error) {

           throw CustomError.internalServerError('Something happend validating token');
        }



    }


}