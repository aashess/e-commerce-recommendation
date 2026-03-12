import prisma from "../../config/prisma.js"

export const createCategories = async (req, res) => {
    const {categories} = req.body

    try {
        const product = await prisma.Category.create({
            data: {
                name: categories
            }
        });

        console.log(product);
        
        res.status(201).json({
            success: true,
            message: "Categories created successfully",
            data: product.id
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

export const getCategories = async (req, res) => {
    const categories = await prisma.Category.findMany();
    res.status(200).json({
        success: true,
        message: "Categories fetched successfully",
        data: categories
    })
}

