import jwt from 'jsonwebtoken'

export async function oauthJWTLogic(payload) {
    // const {email, profile} = payload

      const appJWT = jwt.sign(
      { email: payload.email, name: payload.name },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "1h" }
    );
    // const token = await jwt.signin
    // console.log(payload);
    
    return appJWT


}