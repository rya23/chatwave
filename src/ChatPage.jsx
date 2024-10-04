import React, { useEffect, useState } from "react";
import { Send } from "lucide-react";
import { Button, Input, Box, Typography } from "@mui/material";
import { db } from "./service/firebase"; // Import Firestore
import { collection, addDoc, onSnapshot, query, orderBy } from "firebase/firestore"; // Firestore methods

const ChatPage = ({ user, handleSignOut }) => {
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState("");

    useEffect(() => {
        const messagesCollection = collection(db, "messages");
        
        // Real-time listener to fetch messages from Firestore, ordered by timestamp
        const q = query(messagesCollection, orderBy("timestamp", "asc")); // Order by timestamp in ascending order
        
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const fetchedMessages = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setMessages(fetchedMessages);
        });

        return () => unsubscribe(); // Clean up the listener on component unmount
    }, []);

    const handleSendMessage = async () => {
        if (inputMessage.trim() !== "") {
            const newMessage = {
                text: inputMessage,
                sender: user.displayName || user.email, // Use user's display name or email
                timestamp: new Date(), // Add a timestamp
            };
            await addDoc(collection(db, "messages"), newMessage); // Send message to Firestore
            setInputMessage("");
        }
    };

    return (
        <Box className="flex flex-col h-screen bg-gray-100">
            <header className="bg-white shadow-sm py-4 px-6 flex justify-between">
                <Typography variant="h6">{user.displayName || user.email}</Typography>
                <Button onClick={handleSignOut} color="error">
                    Sign Out
                </Button>
            </header>
            <main className="flex-1 overflow-y-auto p-6">
                <Box className="max-w-3xl mx-auto space-y-4">
                    {messages.map((message) => (
                        <div
                            key={message.id}
                            className={`flex flex-col ${
                                message.sender === (user.displayName || user.email)
                                    ? "items-end"
                                    : "items-start"
                            }`}
                        >
                            <span className="text-xs text-gray-500 mb-1">
                                {message.sender}
                            </span>
                            <div
                                className={`max-w-sm rounded-lg p-4 ${
                                    message.sender === (user.displayName || user.email)
                                        ? "bg-blue-500 text-white"
                                        : "bg-white text-gray-800"
                                }`}
                            >
                                {message.text}
                            </div>
                        </div>
                    ))}
                </Box>
            </main>
            <footer className="bg-white p-4 shadow-md">
                <Box className="max-w-3xl mx-auto flex items-center space-x-4">
                    <Input
                        type="text"
                        placeholder="Type a message..."
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        onKeyPress={(e) => {
                            if (e.key === "Enter") {
                                handleSendMessage();
                            }
                        }}
                        className="flex-1"
                    />
                    <Button onClick={handleSendMessage} variant="contained" color="primary">
                        <Send className="h-4 w-4" />
                        <span className="sr-only">Send message</span>
                    </Button>
                </Box>
            </footer>
        </Box>
    );
};

export default ChatPage;