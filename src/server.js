import express from 'express'
import productRoute from './router/product/product.routes.js'
import userRoute from "./router/user/user.routes.js"


const app = express() 
const PORT = 3000   

app.use(express.json())

app.use("/api/product", productRoute)
app.get("/", (req, res) => {
    res.json({"message": "Running!"})
})

app.use("/api/user", userRoute)




app.listen(PORT, () => {
    console.log("Server is running...", PORT)
})