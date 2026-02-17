import express, { urlencoded } from "express"
import cors from "cors"
import dotenv from "dotenv"
import { dbConection } from "./db"
import cookieParser from "cookie-parser"
import userRoutes from "./routes/user.routes.js";
import postRoutes from "./routes/post.routes.js";
import editorSessionRoutes from "./routes/editorSession.routes.js"

dotenv.config()

const app = express();

await dbConection();

const port = process.env.PORT || 5000


app.use(cors());
app.use(express.json())
app.use(cookieParser())
app.use(urlencoded())


app.use('/api/users',userRoutes)
app.use('/api/posts',postRoutes)
app.use('/api/editor-session',editorSessionRoutes)

app.listen(port,()=>{
    console.log(`Server is listening on port : ${port}`)
})
