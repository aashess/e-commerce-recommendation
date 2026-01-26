export const authenticateAdmin = async (req, res, next) => {
    const role = req.user.role
    console.log(role);

    try {
        if (role === 'ADMIN') {
            next()
            
        }
        else {
            res.status(500).json({
                status: false, 
                messgae: "Not Authorised to Visit! Need ADMIN Account!!"
            })
        }
    } catch (error) {
        console.error("Something Went Wrong! inside admin.Middleware", error);
        res.status(501).json({
            status: false,
            message: "Something Went Wrong inside Middleware."
        })
            
    }
    
    
    
}