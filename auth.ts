import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { expo } from "@better-auth/expo";
import { db } from "./helper/databaseConnection"; // import your db instance
import { user, account, session, verification } from "./modals/schema";

export const auth = betterAuth({
    plugins: [expo()],
    trustedOrigins: ["interiorai://"],
    emailAndPassword: {
        enabled: true,
    },
    session: {
        expiresIn: 60 * 60 * 24,          // session_token lasts 1 day
        refreshExpiresIn: 60 * 60 * 24*30,// refresh_token lasts 30 days
        checkSessionRevoked: true,        // always verify DB before trusting token
    },
    database: drizzleAdapter(db, {
        provider: "pg", // ✅ since you’re using postgres
        schema: {
            user,
            account,
            session,
            verification
        }
    }),
    socialProviders: {
        apple: {
          clientId: process.env.APPLE_SERVICE_ID as string,          // Service ID or App ID
          teamId: process.env.APPLE_TEAM_ID as string,              // Your Apple Team ID
          keyId: process.env.APPLE_KEY_ID as string,                // Apple Key ID
          privateKey: process.env.APPLE_PRIVATE_KEY as string,      // Private key (.p8 content)
          appBundleIdentifier: process.env.APPLE_APP_BUNDLE_ID as string, // iOS bundle ID
        },
      },
});