import React from 'react'
import { signIn, useSession } from "next-auth/react";
import {
    Button
} from "@mui/material";

import AccountMenu from '@/components/AccountMenu';

export default function SignIn() {
    const { data: session, status } = useSession();

    if (session) {
        return (
            <AccountMenu />
        )
    }

    return (
        <Button onClick={() => signIn('google', { callbackUrl: '/dashboard' })}>
            Sign in
        </Button>
    )
}
