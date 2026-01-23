
import express from 'express'

const app = express() 
const PORT = 3000   
app.get("/", (req, res) => {
    res.json({"message": "Running!"})
})

app.use("/api/user", userRoutes)



app.listen(PORT, () => {
    console.log("Server is running...", PORT)
})