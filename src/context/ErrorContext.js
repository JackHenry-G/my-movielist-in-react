import {createContext, useContext, useState} from "react";

const ErrorContext = createContext();

export const ErrorProvider = ({ children }) => {
    const [message, setMessage] = useState('');
    const [isSuccess, setIsSuccess] = useState(false); // null = blue, false = red, true = green

    const updateMessage = (message, success) => {
        console.log("UPdate message: " + message);
        setMessage(message);
        setIsSuccess(success);
    };

    return (
        <ErrorContext.Provider value={{ message, updateMessage, isSuccess }}>
            {children}
        </ErrorContext.Provider>
    );
};

export const useErrorContext = () => useContext(ErrorContext);