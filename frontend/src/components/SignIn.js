import React from 'react'
import { signIn, signOut, useSession } from "next-auth/react";
import {
    Stack,
    Typography,
    Button
} from "@mui/material";

export default function SignIn() {
    const { data: session, status } = useSession();

    if (session) {
        return (
            <Stack>
                <Typography>
                    Signed in as {session.user.email}
                </Typography>
                <Button onClick={() => signOut()}>
                    Sign out
                </Button>
            </Stack>
        )
    }

    return (
        <Button onClick={() => signIn('google')}>
            Sign in
        </Button>
    )
}
