import { CustomError } from "../errors/custom-error";



export class UserEntity {

    constructor( 
        public id:string,
        public name:string,
        public email:string,
        public isValidated:boolean,
        public password:string,
        public role:string[],
        public avatar?:string,
        ){  }

    static fromObject( object: { [key:string]:any } ){
        const { id, _id, name,email,isValidated,password,role,avatar } = object;

        if(!_id && !id){
            throw CustomError.badRequest('Missing ID');
        }

        if(!name){
            throw CustomError.badRequest('Missing Name')
        }
        if(!email){
            throw CustomError.badRequest('Missing Name')
        }
        if(isValidated === undefined){
            throw CustomError.badRequest('Missing Email Validated')
        }
        if(!password){
            throw CustomError.badRequest('Missing Password')
        }
        if(!role){
            throw CustomError.badRequest('Missing Role')
        }

        return new UserEntity( _id || id, name,email,isValidated,password,role );


    }

}