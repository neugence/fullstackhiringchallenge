import mongoose from "mongoose";

export const dbConection = async()=>{
    try {
        const connetion = await mongoose.connect(process.env.MONGO_URI,{
            dbName : 'smart_blog_editor'
        })
        console.log(`Database connected : ${mongoose.connection.host}`)
    } catch (error) {
        console.log('Mongoose connection error : ',error)
        process.exit(1)
    }
}