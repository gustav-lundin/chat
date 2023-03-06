import { useParams } from "react-router-dom";

function Chat(props) {
  const { chatId } = useParams();
  return <h1>Chat Page {chatId}</h1>;
}

export default Chat;
