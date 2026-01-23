import { createCategories, getCategories } from '../../controller/product/catogries.controller.js';
import { createProduct,getAllProducts } from '../../controller/product/product.controller.js';
import { Router } from 'express';
import { getAllSubCategories,createSubcatogries } from '../../controller/product/subcatogries.controller.js';


const router = Router();

// Product Routes
router.get("/all-products", getAllProducts);
router.post("/create-product",createProduct);

// Categories Routes
router.get("/all-categories", getCategories);
router.post("/create-categories", createCategories);

// Sub-Categories Routes
router.get("/all-subcategories", getAllSubCategories);
router.post("/create-subcatogries", createSubcatogries);





export default router;