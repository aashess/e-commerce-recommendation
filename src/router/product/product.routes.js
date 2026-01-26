import { createCategories, getCategories } from '../../controller/product/catogries.controller.js';
import { createProduct,getAllProducts } from '../../controller/product/product.controller.js';
import { Router } from 'express';
import { getAllSubCategories,createSubcatogries } from '../../controller/product/subcatogries.controller.js';
import { createSubcatogries } from '../../controller/product/subcatogries.controller.js';
import { authenticateAdmin } from '../../middleware/admin.middleware.js';
import { authenticateUser } from '../../middleware/auth.middleware.js';


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




router.post("/create-product",authenticateUser,authenticateAdmin, createProduct);
router.post("/create-catogries", authenticateUser, authenticateAdmin, createCatogries);
router.get("/all-categories", authenticateAdmin, getCategories);
router.post("/create-subcatogries", authenticateAdmin, createSubcatogries);
router.get("/all-products", getAllProducts);

export default router;
