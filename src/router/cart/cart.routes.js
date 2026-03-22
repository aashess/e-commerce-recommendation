import {Router} from 'express'
import { addToCart, getCartItems } from '../../controller/cart/addtocard.controller.js';
import { updateCartQuantity } from '../../controller/cart/updateCartQuantity.controller.js';
import { reduceCartQuantity } from '../../controller/cart/reduceCartQuantity.controller.js';
import { removeCartItem } from '../../controller/cart/removeCartIteam.controller.js';
import { authenticateUser } from '../../middleware/auth.middleware.js';
import { csrfVerify } from '../../middleware/csrf.middleware.js';
const router = Router();

// Define cart routes here

router.post("/addToCart",authenticateUser, csrfVerify,addToCart);  //user
router.get("/getAllCartItems",authenticateUser,csrfVerify, getCartItems);  //user
router.put("/add-quantity", authenticateUser, csrfVerify, updateCartQuantity); //user
router.put("/reduce-quantity", authenticateUser,csrfVerify, reduceCartQuantity); //user
router.post("/remove-item", authenticateUser, csrfVerify, removeCartItem); //user

export default router;