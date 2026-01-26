import prisma from "../../config/prisma.js"


export const getuser = async (req, res) => {
    try {
        const userGet = await prisma.user.findMany()
    
        if (!userGet) {
            console.log("Error Occured: ",error);
            res.status(500).json({
                success: false,
                message: "Failed to Fetch"
            })
        }
       const emailList = userGet.map(element => element.email);


            res.status(201).json({
                success: true,
                message: "User Fetched Successful.",
                data: emailList
            })
        
    } catch (error) {
        console.log(error);
        res.status(501).json({
            success: false,
            message: "failed to fetch"
        })
    }
}