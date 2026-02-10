
import { OAuth2Client } from "google-auth-library";

const c_id = process.env.GOOGLE_CLIENT_ID
const c_secret = process.env.GOOGLE_CLIENT_SECRET
const redirect_url = process.env.GOOGLE_REDIRECT_URI
export const oauthClient = new OAuth2Client(c_id,c_secret,redirect_url)