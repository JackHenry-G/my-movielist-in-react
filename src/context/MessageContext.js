import {createContext, useContext, useState} from "react";

const MessageContext = createContext();

export const MessageProvider = ({ children }) => {
    const [message, setMessage] = useState('');
    const [isSuccess, setIsSuccess] = useState(false); // null = blue, false = red, true = green

    const updateMessage = (message, success) => {
        console.log("Updating message to: " + message);
        setMessage(message);
        setIsSuccess(success);
    };

    return (
        <MessageContext.Provider value={{ message, updateMessage, isSuccess }}>
            {children}
        </MessageContext.Provider>
    );
};

export const useMessageContext = () => useContext(MessageContext);