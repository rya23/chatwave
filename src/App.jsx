import React from "react"
import { useAuthState } from "react-firebase-hooks/auth"
import { auth, signInWithGoogle } from "./service/firebase" // Adjust the path if needed
import ChatPage from "./ChatPage" // Import updated ChatPage component
import { Button, CircularProgress, Box, Typography } from "@mui/material"
import { MessageSquare } from "lucide-react"

const App = () => {
    const [user, loading, error] = useAuthState(auth)

    const handleGoogleSignIn = async () => {
        try {
            await signInWithGoogle()
        } catch (error) {
            console.error("Google Sign-In failed:", error)
        }
    }

    const handleSignOut = () => {
        auth.signOut()
    }

    if (loading) {
        return (
            <Box
                display="flex"
                alignItems="center"
                justifyContent="center"
                height="100vh"
                bgcolor="gray.100"
            >
                <CircularProgress />
            </Box>
        )
    }

    if (error) {
        return (
            <Box
                display="flex"
                alignItems="center"
                justifyContent="center"
                height="100vh"
                bgcolor="gray.100"
            >
                <Typography variant="h6" color="error">
                    Error: {error.message}
                </Typography>
            </Box>
        )
    }

    return (
        <Box minHeight="100vh" bgcolor="gray.100">
            {!user ? (
                <Box
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                    justifyContent="center"
                    height="100vh"
                >
                    <Box
                        bgcolor="white"
                        p={4}
                        borderRadius={2}
                        boxShadow={3}
                        textAlign="center"
                    >
                        <MessageSquare className="w-16 h-16 text-blue-500 mx-auto mb-4" />
                        <Typography variant="h4" fontWeight="bold" gutterBottom>
                            Welcome to ChatApp
                        </Typography>
                        <Typography color="textSecondary" mb={4}>
                            Sign in with Google to start chatting
                        </Typography>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleGoogleSignIn}
                        >
                            Sign in with Google
                        </Button>
                    </Box>
                </Box>
            ) : (
                <ChatPage user={user} handleSignOut={handleSignOut} />
            )}
        </Box>
    )
}

export default App
