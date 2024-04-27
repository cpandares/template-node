import { populate } from "dotenv";
import { ProductModel } from "../../data";
import { CreateProductDto, CustomError, PaginationDto } from '../../domain';




export class ProductService {

    constructor(){

    }



    async createProduct( createProductDto: CreateProductDto ){


        const productExist = await ProductModel.findOne({name: createProductDto.name});
        if(productExist) throw CustomError.badRequest('Product already exist');

        try {
            const product = new ProductModel(createProductDto);

            await product.save();

            return product;

        } catch (error) {
            throw CustomError.internalServerError('Internal Server Error creating category');
        }

    }



    async getProducts( paginationDto: PaginationDto ){

        const {  page, limit } = paginationDto;

       try {



       /*  const totalCategories = await CategoryModel.countDocuments();
        const categories = await CategoryModel.find()
                .skip((page - 1) * limit)
                .limit(limit) */

        const [products, totalProducts] = await Promise.all([
            ProductModel.find()
                .skip((page - 1) * limit)
                .limit(limit)
                .populate('user')
                .populate('category')
                ,
                ProductModel.countDocuments(),
                

        ]);
        
        return {
            page,
            limit,
            totalProducts,
            next : `api/products?page=${page + 1}&limit=${limit}`,
            previous: (page -1 > 0) ? `api/products?page=${page - 1}&limit=${limit}` : null,
            products: products

        }
       } catch (error) {
              throw CustomError.internalServerError('Internal Server Error getting categories');
       }

    }



}