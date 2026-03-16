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

export const getProfile = async (req, res) => {
    try {
        const userDetails = {
            email: req.user.email,
            name: req.user.name,
            role: req.user.role,
            address: req.user.address,
            cart: req.user.cart,
            orders: req.user.orders,
            id: req.user.id,
            createdAt: req.user.createdAt,
        }
        console.log("User Details: ", userDetails);
        
        // const {email,  name, role, address, cart, orders, id, createdAt} = req.user

        // console.log("Email, Name, createdAT, role, address", email,  name, role, address, cart, orders, id, createdAt);

        res.status(200).json({
            success: true,
            message: "Successful Fetched.",
            data: userDetails

        })
        
    } catch (error) {
        console.error("Something went wrong in getProfile", error);
        res.status(400).json({
            success: false,
            message: "Something went wrong inside getProfile."
        })
        
    }
}
