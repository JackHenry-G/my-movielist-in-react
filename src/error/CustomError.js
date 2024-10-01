import {AxiosError} from "axios";

class CustomError extends AxiosError {
    constructor(message, status) {
        super(message); // Call the parent constructor
        this.status = status; // Custom property for status
        this.name = 'CustomError'; // Set the error name
    }
}

export default CustomError;