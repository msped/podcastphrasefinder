import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import apiClient from "@/api/apiClient";

// These two values should be a bit less than actual token lifetimes
const BACKEND_ACCESS_TOKEN_LIFETIME = 45 * 60;            // 45 minutes
const BACKEND_REFRESH_TOKEN_LIFETIME = 6 * 24 * 60 * 60;  // 6 days

const refreshTokenUrl = "auth/token/refresh";

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
            console.error("Sign in handler error: ", error);
            return false
        }
    },
};
const SIGN_IN_PROVIDERS = Object.keys(SIGN_IN_HANDLERS);

async function refreshAccessToken(token) {
    try {
        const response = await apiClient.post(refreshTokenUrl, {
            refresh: token.refresh_token,
        });
        const refreshedTokens = response.data;

        if (!refreshedTokens.access) {
            throw refreshedTokens;
        }

        return {
            ...token,
            access_token: refreshedTokens.access,
            refresh_token: refreshedTokens.refresh ?? token.refresh_token, // Fall back to old refresh token
            ref: Date.now() + BACKEND_ACCESS_TOKEN_LIFETIME * 1000, // Update the refresh time
        };
    } catch (error) {
        console.log(error);
        return {
            ...token,
            error: "RefreshAccessTokenError",
        };
    }
}

export const authOptions = {
    secret: process.env.AUTH_SECRET,
    session: {
        strategy: "jwt",
        maxAge: BACKEND_REFRESH_TOKEN_LIFETIME,
        cookie: {
            name: "pod-finder-session",
            secure: process.env.NODE_ENV === "production",
            httpOnly: true,
            sameSite: "lax",
            path: "/"
        }
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
                token["ref"] = Date.now() + BACKEND_ACCESS_TOKEN_LIFETIME * 1000;
                return token;
            }
            // Refresh the backend token if necessary
            if (Date.now() < token["ref"]) {
                return token;
            }
            return refreshAccessToken(token);
        },
        // Since we're using Django as the backend we have to pass the JWT
        // token to the client instead of the `session`.
        async session({token}) {
            return token;
        },
    }
};

export default NextAuth(authOptions);