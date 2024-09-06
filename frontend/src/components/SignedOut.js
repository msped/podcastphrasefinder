import { useSession } from "next-auth/react";

export default function SignedOut({ children }) {
    const { data: session } = useSession();

    if (session) {
        return;
    }

    return children;
}
