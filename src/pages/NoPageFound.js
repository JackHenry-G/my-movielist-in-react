import {useMessageContext} from "../context/MessageContext";

export default function NoPageFound() {
    const { updateMessage } = useMessageContext();

    updateMessage("404 - the page you are looking for does not exist.", false);

    return (
        <div>
            <h1>What are you doing here?</h1>
            <p style={{ fontSize: '0.8em', fontStyle: 'italic' }}>Contact the admin if you think there should be something here</p>
        </div>
    );
}
