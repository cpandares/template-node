import { CategoryModel } from "../../../data";
import { CreateCategoryDto, CustomError, PaginationDto, UserEntity } from "../../../domain";




export class CategoryService {

    constructor(){

    }



    async createCategory( createCategoryDto: CreateCategoryDto, user: UserEntity ){


        const categoryExist = await CategoryModel.findOne({name: createCategoryDto.name});
        if(categoryExist) throw CustomError.badRequest('Category already exist');

        try {
            const category = new CategoryModel({
                ...createCategoryDto,
                user: user.id
            });

            await category.save();
            return {
                id: category.id,
                name: category.name,
                available: category.available,
                user: category.user
            }

        } catch (error) {
            throw CustomError.internalServerError('Internal Server Error creating category');
        }

    }



    async getCategories( paginationDto: PaginationDto ){

        const {  page, limit } = paginationDto;

       try {



       /*  const totalCategories = await CategoryModel.countDocuments();
        const categories = await CategoryModel.find()
                .skip((page - 1) * limit)
                .limit(limit) */

        const [categories, totalCategories] = await Promise.all([
            CategoryModel.find()
                .skip((page - 1) * limit)
                .limit(limit),
            CategoryModel.countDocuments()
        ]);
        
        return {
            page,
            limit,
            totalCategories,
            next : `api/categories?page=${page + 1}&limit=${limit}`,
            previous: (page -1 > 0) ? `api/categories?page=${page - 1}&limit=${limit}` : null,
            categories: categories.map(category => ({
                id: category.id,
                name: category.name,
                available: category.available,
                user: category.user
            }))

        }
       } catch (error) {
              throw CustomError.internalServerError('Internal Server Error getting categories');
       }

    }



}