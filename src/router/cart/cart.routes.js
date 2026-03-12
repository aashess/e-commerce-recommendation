import {Router} from 'express'
import { addToCart, getCartItems } from '../../controller/cart/addtocard.controller.js';
import { updateCartQuantity } from '../../controller/cart/updateCartQuantity.controller.js';
import { reduceCartQuantity } from '../../controller/cart/reduceCartQuantity.controller.js';
import { removeCartItem } from '../../controller/cart/removeCartIteam.controller.js';
import { authenticateUser } from '../../middleware/auth.middleware.js';
import { csrfMiddleware } from '../../middleware/csrf.middleware.js';
const router = Router();

// Define cart routes here

router.post("/addToCart",authenticateUser, csrfMiddleware,addToCart);  //user
router.get("/getAllCartItems",authenticateUser, getCartItems);  //user
router.put("/add-quantity", authenticateUser, csrfMiddleware, updateCartQuantity); //user
router.put("/reduce-quantity", authenticateUser,csrfMiddleware, reduceCartQuantity); //user
router.delete("/remove-item", authenticateUser, csrfMiddleware, removeCartItem); //user

export default router;