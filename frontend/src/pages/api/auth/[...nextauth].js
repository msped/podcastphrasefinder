import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import apiClient from "@/api/apiClient";

// These two values should be a bit less than actual token lifetimes
const BACKEND_ACCESS_TOKEN_LIFETIME = 45 * 60;            // 45 minutes
const BACKEND_REFRESH_TOKEN_LIFETIME = 6 * 24 * 60 * 60;  // 6 days

const getCurrentEpochTime = () => {
    return Math.floor(new Date().getTime() / 1000);
};

const SIGN_IN_HANDLERS = {
    "google": async (user, account, profile, email, credentials) => {
        try {
            const response = await apiClient.post(
                'auth/google',
                {
                    access_token: account['id_token'] 
                }
            )
            account['meta'] = response.data;
            return true;
        } catch (error) {
            console.error(error);
            return false
        }
    },
};
const SIGN_IN_PROVIDERS = Object.keys(SIGN_IN_HANDLERS);

export const authOptions = {
    secret: process.env.AUTH_SECRET,
    session: {
        strategy: "jwt",
        maxAge: BACKEND_REFRESH_TOKEN_LIFETIME,
    },
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            authorization: {
                params: {
                    prompt: "consent",
                    access_type: "offline",
                    response_type: "code"
                }
            }
        }),
    ],
    callbacks: {
        async signIn({user, account, profile, email, credentials}) {
            if (!SIGN_IN_PROVIDERS.includes(account.provider)) return false;
                return SIGN_IN_HANDLERS[account.provider](
                    user, account, profile, email, credentials);
        },
        async jwt({user, token, account}) {
            // If `user` and `account` are set that means it is a login event
            if (user && account) {
                let backendResponse = account.provider === "credentials" ? user : account.meta;
                token["user"] = backendResponse.user;
                token["access_token"] = backendResponse.access;
                token["refresh_token"] = backendResponse.refresh;
                token["ref"] = getCurrentEpochTime() + BACKEND_ACCESS_TOKEN_LIFETIME;
                return token;
            }
            // Refresh the backend token if necessary
            if (getCurrentEpochTime() > token["ref"]) {
                const response = await apiClient.post(
                    "auth/token/refresh",
                    {
                        refresh: token["refresh_token"],
                    },
                );
                token["access_token"] = response.data.access;
                token["refresh_token"] = response.data.refresh;
                token["ref"] = getCurrentEpochTime() + BACKEND_ACCESS_TOKEN_LIFETIME;
            }
            return token;
        },
        // Since we're using Django as the backend we have to pass the JWT
        // token to the client instead of the `session`.
        async session({token}) {
            return token;
        },
    }
};

export default NextAuth(authOptions);