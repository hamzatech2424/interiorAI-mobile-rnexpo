import { successResponseHelper, errorResponseHelper } from '../utils/response';
import { user } from '../modals/schema';
import { eq } from 'drizzle-orm';
import { db } from '../helper/databaseConnection';
import { auth } from '../auth';

// Users collection
const syncUser = async (c: any) => {
  try {
    const session = c.get("session");
    console.log("🔍 Session object:", session);
    return successResponseHelper(c, {
      message: "User synced successfully",
      user: session.user,
    });
    // const clerkUser = c.get('clerkUser');
    // if (!clerkUser) {
    //   return c.json({
    //     success: false,
    //     error: {
    //       code: 401,
    //       message: "Unauthorized",
    //       description: "Authentication required"
    //     }
    //   }, 401);
    // }

    // Check if user exists in database
    // const existingUser = await db().select().from(user)
    //   .where(eq(user.betterAuthId, clerkUser.userId));
    // let user;

    // if (existingUser.length > 0) {
    //   // Update existing user
    //   user = await db().update(user)
    //     .set({
    //       email: clerkUser.userData.emailAddresses[0]?.emailAddress || '',
    //       first_name: clerkUser.userData.firstName || '',
    //       last_name: clerkUser.userData.lastName || '',
    //       raw: clerkUser.userData
    //     })
    //     .where(eq(user.betterAuthId, clerkUser.userId))
    //     .returning();
    // } else {
    //   // Create new user
    //   user = await db().insert(user).values({
    //     betterAuthId: clerkUser.userId,
    //     email: clerkUser.userData.emailAddresses[0]?.emailAddress || '',
    //     first_name: clerkUser.userData.firstName || '',
    //     last_name: clerkUser.userData.lastName || '',
    //     raw: clerkUser.userData
    //   }).returning();
    // }

    // return successResponseHelper(c, {
    //   message: "User synced successfully",
    //   user: user[0],
    //   auth: {
    //     userId: clerkUser.userId,
    //     authenticated: true
    //   }
    // });
  } catch (error) {
    console.log("Error in syncUser:", error);
    return errorResponseHelper(c, error);
  }
};

export { syncUser };