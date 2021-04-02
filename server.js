require('dotenv').config()
const cors = require("cors")
const express = require("express")
const app = express()  

//routes
const auth_router = require("./routes/auth_route")
const students_router = require("./routes/students_route")

app.use(express.json())
app.use(cors({ origin: false }))

//mount routes
app.use("/auth", auth_router)
app.use("/students", students_router)

app.listen(process.env.SERVER_PORT, ()=> console.log("server running on port 3000"))