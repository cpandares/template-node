import { regularExps } from "../../../config";


export class LoginUserDto {

 private constructor(
       
        public readonly email:string,
        public readonly password:string
    ){}


    static create ( object: { [key:string]:any } ):[string?, LoginUserDto?]{
        const { email,password } = object;

        
        if(!email) return ['Missing Email'];
        if(!regularExps.email.test(email)) return ['Email is invalid'];
        if(!password) return ['Missing Password']
        

        return [undefined, new LoginUserDto(email,password)];
    }

}