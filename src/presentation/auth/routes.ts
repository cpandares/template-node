import { Router } from 'express';
import { AuthController } from './controller';




export class AuthRoutes {


  static get routes(): Router {

    const router = Router();

    const authController = new AuthController();

    // Definir las rutas
     router.post('/register', authController.register );
     router.post('/login', authController.login );

     router.get('/validate-email/:token', authController.validateEmail );



    return router;
  }


}

