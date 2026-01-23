import {Router} from 'express'
import { addToCart } from '../../controller/cart/addtocard.controller,js';

const router = Router();

// Define cart routes here

router.post("/add-to-cart", addToCart);

export default router;