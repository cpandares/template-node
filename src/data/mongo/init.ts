import mongoose from 'mongoose';



interface Options {
    mongoUrl: string;
    dbName: string;
}



export class MongoDatabase {


    static async connect(options: Options) {
        const { mongoUrl, dbName } = options;

        try {

            await mongoose.connect(mongoUrl, {
                dbName
            });
            //console.log('mongo connected');
            return true
        } catch (error) {
          //  console.log('mongo connection error: ', error);
            throw  Error('Error connecting to mongo');
        }


    }


    static async disconnect(){

        await mongoose.disconnect()

    }

}