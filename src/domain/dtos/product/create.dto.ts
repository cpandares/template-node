import { Validators } from "../../../config";



export class CreateProductDto {


    private constructor(
        public readonly name: string,
        public readonly available: boolean,
        public readonly price: string,
        public readonly description: string,
        public readonly user: string,
        public readonly category: string,
        public readonly image: string,
    ){

    }

    static create ( props: { [key:string]:any } ) : [string?, CreateProductDto?]{

        const { 
            name,
            available,
            price,
            description,
            user,
            category,
            image,
         } = props;

        let availableBoolean = available;

        if(!name) return ['Missing Product Name'];
        if(!user) return ['Missing User in Products'];
        if( !Validators.isMongoId(user)) return ['User is invalid in create product'];
        if( !Validators.isMongoId(category)) return ['Category is Invalid'];
        if(!category) return ['Missing Category in Products'];

        
        if( typeof available !=='boolean' ){
            availableBoolean = ( available === 'true' )
        }

        return [ undefined, new CreateProductDto(name, availableBoolean, price, description, user, category,image) ]
    }


}