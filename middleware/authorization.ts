import { Context, Next } from "hono";
import { auth } from "../auth";



export const authorization = async (c: Context, next: Next) => {
    try {
        const session = await auth.api.getSession({ headers: c.req.raw.headers });
        if (!session) {
            return c.json({
                success: false,
                error: "Unauthorized",
                message: "No valid session token found. Please send a valid Authorization header with Bearer token."
            }, 401);
        }
        c.set("session", session);
        await next(); // ✅ This must be awaited, and the called route MUST return a Response
    } catch (error) {
        console.error('❌ Authorization error:', error);
        return c.json({
            success: false,
            error: "Authorization failed",
            message: error instanceof Error ? error.message : "Invalid authentication data"
        }, 401);
    }
};

