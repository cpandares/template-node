import { Router } from 'express';
import { CategoryController } from './controller';
import { AuthMiddleware } from '../middleware/auth.middleware';
import { CategoryService } from '../services/auth/category.service';





export class CategoryRoutes {


  static get routes(): Router {

    const router = Router();

      const categoryService = new CategoryService();
     const controller = new CategoryController(categoryService);
   

     router.get('/',  controller.getCategories);
     router.post('/',[ AuthMiddleware.validateJWT ] ,controller.createCategory);


    return router;
  }


}

