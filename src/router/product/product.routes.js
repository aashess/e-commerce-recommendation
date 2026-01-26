import { createCatogries, getCategories } from '../../controller/product/catogries.controller.js';
import { createProduct,getAllProducts } from '../../controller/product/product.controller.js';
import { Router } from 'express';
import { createSubcatogries } from '../../controller/product/subcatogries.controller.js';
import { authenticateAdmin } from '../../middleware/admin.middleware.js';
import { authenticateUser } from '../../middleware/auth.middleware.js';


const router = Router();

router.post("/create-product",authenticateUser,authenticateAdmin, createProduct);
router.post("/create-catogries", authenticateUser, authenticateAdmin, createCatogries);
router.get("/all-categories", authenticateAdmin, getCategories);
router.post("/create-subcatogries", authenticateAdmin, createSubcatogries);
router.get("/all-products", getAllProducts);

export default router;
