import express from 'express'
import productRoute from './router/product/product.routes.js'
import cart from './router/cart/cart.routes.js'
import checkoutRoute from './router/checkout/checkout.routes.js'
import userRoute from "./router/user/user.routes.js"
import cookieParser from 'cookie-parser'



const app = express() 
const PORT = 3000   
app.use(cookieParser())
app.use(express.json())

app.use("/api/product", productRoute)
app.use("/api/cart", cart)
app.use("/api/checkout", checkoutRoute)





app.get("/", (req, res) => {
    res.json({"message": "Running!"})
})

// app.use("/api/user", userRoutes)
app.use("/api/user", userRoute)




app.listen(PORT, () => {
    console.log("Server is running...", PORT)
})