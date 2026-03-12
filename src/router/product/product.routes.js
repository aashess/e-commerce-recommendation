import { createCategories, getCategories } from '../../controller/product/catogries.controller.js';
import { createProduct,getAllProducts } from '../../controller/product/product.controller.js';
import { Router } from 'express';
import { getAllSubCategories,createSubcatogries } from '../../controller/product/subcatogries.controller.js';
import { authenticateAdmin } from '../../middleware/admin.middleware.js';
import { authenticateUser } from '../../middleware/auth.middleware.js';


const router = Router();

// Product Routes
// router.get("/all-products", getAllProducts);
// router.post("/create-product",createProduct);


router.post("/create-product",authenticateUser,authenticateAdmin, createProduct);   
router.post("/create-categories", authenticateUser, authenticateAdmin, createCategories);
router.get("/all-categories", getCategories);
router.get("/all-subcategories", authenticateUser, authenticateAdmin, getAllSubCategories);
router.post("/create-subcatogries", authenticateUser , authenticateAdmin, createSubcatogries);
router.get("/all-products", getAllProducts);

export default router;
