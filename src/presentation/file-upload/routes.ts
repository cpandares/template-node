import { Router } from 'express';
import { FileUploadController } from '../file-upload/controller'
import { FileUploadService } from '../services/file-upload.service';
import { FileUploadMiddleware } from '../middleware/file-upload.middleware';
import { TypeMiddleware } from '../middleware/type.middleware';





export class FileUploadRoutes {


  static get routes(): Router {

    const router = Router();

    const fileUploadService = new FileUploadService();
     const controller = new FileUploadController( fileUploadService );

     router.use( FileUploadMiddleware.containsFile );
     router.use( TypeMiddleware.validTypes(['users', 'categories','products']) );

     router.post('/single/:type',  controller.fileUpload);
     router.post('/multiple/:type' , controller.uploadMultipleFiles);


    return router;
  }


}

