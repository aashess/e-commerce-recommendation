import express from 'express'
import productRoute from './router/product/product.routes.js'
import cart from './router/cart/cart.routes.js'

const app = express() 
const PORT = 3000   

app.use(express.json())

app.use("/api/product", productRoute)
app.use("/api/cart", cart)





app.get("/", (req, res) => {
    res.json({"message": "Running!"})
})

// app.use("/api/user", userRoutes)



app.listen(PORT, () => {
    console.log("Server is running...", PORT)
})