import Tokens from "csrf";

const csrf_token_check = new Tokens();

export const csrfMiddleware = async (req, res, next) => {
    console.log("Controller reached in middleware!!");
    
    try {
    const csrf_secret = req.session.csrfSecret;
    console.log("csrf_secret:: ",csrf_secret);
    
    const csrf_token = req.headers.csrf_token;
    console.log("csrf_TOken:: ",csrf_token);
    
    const valid_csrf_token = csrf_token_check.verify(csrf_secret, csrf_token);
    console.log("IsValidORNOT:: ",valid_csrf_token);

    if (valid_csrf_token) {
      next();
    }
  } catch (error) {
    console.error("Something went wrong in CSRF Checking!!", error);
    res.status(501).json({
      success: false,
      message: "CSRF Token is invalid.",
    });
  }
};
