import { createCatogries, getCategories } from '../../controller/product/catogries.controller.js';
import { createProduct,getAllProducts } from '../../controller/product/product.controller.js';
import { Router } from 'express';
import { createSubcatogries } from '../../controller/product/subcatogries.controller.js';


const router = Router();

router.post("/create-product",createProduct);
router.post("/create-catogries", createCatogries);
router.get("/all-categories", getCategories)
router.post("/create-subcatogries", createSubcatogries);
router.get("/all-products", getAllProducts);

export default router;