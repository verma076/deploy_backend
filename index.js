const express=require("express")
const { connection } = require("./db")
const {userRouter} = require("./routes/user.routes")
const { postRouter } = require("./routes/post.routes")
const app=express()
app.use(express.json())

app.get("/",(req,res)=>{
    res.status(200).send({"msg":"welcome to the home page"})
})

app.use("/users",userRouter)

app.use("/posts",postRouter)


app.listen(8080,async(req,res)=>{
    try {
        await connection
        console.log("connected to the database")
        console.log("server is running in the port 8080")
    } catch (error) {
        console.log(error)
    }
   
})