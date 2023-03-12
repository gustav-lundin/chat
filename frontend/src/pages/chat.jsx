import { useParams } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { fetchJson } from "../fetch";
import { Stack, Row, Col, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

function Chat(props) {
  const { chatId } = useParams();
  const navigate = useNavigate();
  const [chat, setChat] = useState({
    id: null,
    name: null,
    chatMessages: [],
    chatMembers: [],
  });
  const messageRef = useRef();

  function getChat() {
    return chat;
  }

  useEffect(() => {
    const listener = (event) => {
      if (event.code === "Enter" || event.code === "NumpadEnter") {
        event.preventDefault();
        const message = messageRef.current.value;
        messageRef.current.value = "";
        if (message.trim() === "") {
          return;
        }
        (async () => {
          try {
            const data = await fetchJson(`messages/${chatId}`, "POST", {
              content: message,
            });
          } catch (e) {
            console.log(e);
            navigate("/error");
          }
        })();
      }
    };
    document.addEventListener("keydown", listener);
    return () => {
      document.removeEventListener("keydown", listener);
    };
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const data = await fetchJson(`chats/${chatId}`);
        console.log(data);
        if (data.error) {
          navigate("/error");
          return;
        }
        setChat(data.chat);
      } catch (e) {
        console.log(e);
        navigate("/error");
      }
    })();
  }, []);

  useEffect(() => {
    let sse = new EventSource(`/api/sse/${chatId}`);

    sse.addEventListener("connect", (message) => {
      let data = JSON.parse(message.data);
      console.log("[connect]", data);
    });

    sse.addEventListener("disconnect", (message) => {
      let data = JSON.parse(message.data);
      console.log("[disconnect]", data);
    });

    sse.addEventListener("new-message", (message) => {
      let data = JSON.parse(message.data);
      console.log("[new-message]", data);
      setChat((preState) => {
        const chatMessages = [...preState.chatMessages, data];
        const newState = { ...preState, chatMessages };
        return newState;
      });
    });
  }, []);

  return (
    <Row className="justify-content-center">
      <Col xs={9} md={6}>
        <h1>{chat.name}</h1>
        <Stack
          style={{
            overflowY: "auto",
            maxHeight: "fit-content",
          }}
        >
          {chat.chatMessages?.map((m) => (
            <Row
              key={m.id}
              style={{
                backgroundColor: "#F5F5F5",
                borderRadius: "20px",
                marginBottom: "10px",
              }}
            >
              <Col>
                <p style={{ fontWeight: "bold" }}>
                  {`${new Date(m.createdAt).toLocaleString()} ${
                    m.User.firstName
                  } ${m.User.lastName}:`}
                </p>
                <p>{m.content}</p>
              </Col>
            </Row>
          ))}
        </Stack>
        <Form onSubmit={() => console.log("submit")}>
          <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
            <Form.Label>New message</Form.Label>
            <Form.Control as="textarea" rows={3} ref={messageRef} />
          </Form.Group>
        </Form>
      </Col>
    </Row>
  );
}

export default Chat;
