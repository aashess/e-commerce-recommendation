
import express from 'express'

const app = express() 
const PORT = 3000   
app.get("/", (req, res) => {
    res.json({"message": "Running!"})
})

app.listen(PORT, () => {
    console.log("Server is running...", PORT)
})