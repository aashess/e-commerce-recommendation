import prisma from "../../config/prisma.js"

export const createSubcatogries = async (req, res) => {
    const {name, categoriesId} = req.body;

    try {
        const response = await prisma.Subcategory.create({
            data: {
                name: name,
                categoryId: categoriesId
            }
        });

        res.status(201).json({
            success: true,
            message: "Subcategories created successfully",
            data: response
        })  
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

export const getAllSubCategories = async (req,res) => {
    
    try {
        const response = await prisma.subcategory.findMany();
        res.status(200).json({
            success: true,
            data: response
        })
        console.log(response);
        
        
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: error.message,
        })
        
    }
}