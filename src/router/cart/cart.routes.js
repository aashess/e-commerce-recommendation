import {Router} from 'express'
import { addToCart, getCartItems } from '../../controller/cart/addtocard.controller.js';
import { updateCartQuantity } from '../../controller/cart/updateCartQuantity.controller.js';
import { reduceCartQuantity } from '../../controller/cart/reduceCartQuantity.controller.js';
import { removeCartItem } from '../../controller/cart/removeCartIteam.controller.js';
import { authDummy } from '../../middleware/authDummy.js';
const router = Router();

// Define cart routes here

router.post("/addToCart",authDummy ,addToCart);
router.get("/getAllCartItems",authDummy, getCartItems);
router.put("/add-quantity", updateCartQuantity);
router.put("/reduce-quantity", reduceCartQuantity);
router.delete("/remove-item", removeCartItem);

export default router;