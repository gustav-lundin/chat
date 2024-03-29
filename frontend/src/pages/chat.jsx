import { useParams } from "react-router-dom";
import { useEffect, useState, useRef, useContext } from "react";
import { fetchJson } from "../fetch.js";
import {
  Stack,
  Row,
  Col,
  Form,
  Dropdown,
  DropdownButton,
  ButtonGroup,
  Button,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../App.jsx";

function Chat() {
  const { user } = useContext(UserContext);
  const isAdmin = user.userRole === "admin";
  const { chatId } = useParams();
  const navigate = useNavigate();
  const [chat, setChat] = useState({
    id: null,
    name: null,
    chatMessages: [],
    chatMembers: [],
  });
  const messageRef = useRef();
  const [isCreator, setIsCreator] = useState(false);
  const [hasChatAdminRights, setHasChatAdminRights] = useState(false);

  useEffect(() => {
    const listener = (event) => {
      if (event.code === "Enter" || event.code === "NumpadEnter") {
        event.preventDefault();
        const message = messageRef.current.value;
        messageRef.current.value = "";
        (async () => {
          const data = await fetchJson(`messages/${chatId}`, "POST", {
            content: message,
          });
          if (data.error) {
            setChat({ error: data.error });
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
      const data = await fetchJson(`chats/${chatId}`);
      if (data.error) {
        setChat({ error: data.error });
        return;
      }
      const chat = data.chat;
      const creator = chat.chatMembers.find(
        (member) => member.ChatMember.creator
      );
      console.assert(creator !== undefined);
      if (user.userRole == "admin") {
        setHasChatAdminRights(true);
      }
      if (user.id == creator.id) {
        setHasChatAdminRights(true);
        setIsCreator(true);
      }
      setChat(chat);
    })();
  }, []);

  useEffect(() => {
    let sse = new EventSource(`/api/sse/${chatId}`);

    sse.addEventListener("connect", (message) => {
      let data = JSON.parse(message.data);
    });

    sse.addEventListener("disconnect", (message) => {
      let data = JSON.parse(message.data);
    });

    sse.addEventListener("keep-alive", (message) => {
      let data = JSON.parse(message.data);
    });

    sse.addEventListener("new-message", (message) => {
      let data = JSON.parse(message.data);
      setChat((preState) => {
        const chatMessages = [...preState.chatMessages, data];
        const newState = { ...preState, chatMessages };
        return newState;
      });
    });

    sse.addEventListener("deleted-message", (message) => {
      let data = JSON.parse(message.data);
      setChat((preState) => {
        const chatMessages = [...preState.chatMessages].filter(
          (message) => message.id != data.id
        );
        return { ...preState, chatMessages };
      });
    });

    sse.addEventListener("user-blocked", (chatMember) => {
      let data = JSON.parse(chatMember.data);
      if (data.userId === user.id && data.blocked) {
        navigate("/");
      }
      setChat((preState) => {
        const chatMembers = preState.chatMembers.map((member) => {
          if (member.id === data.userId) {
            return { ...member, ChatMember: data };
          }
          return member;
        });
        return { ...preState, chatMembers };
      });
    });

    return () => sse.close();
  }, []);

  async function setBlocked(userId, blocked) {
    const data = await fetchJson(
      `chatmembers/block/${chat.id}/${userId}`,
      "PUT",
      { blocked }
    );
    if (data.error) {
      setChat({ error: data.error });
    }
  }

  async function deleteMessage(messageId) {
    const data = await fetchJson(`messages/${chat.id}/${messageId}`, "DELETE");
    if (data.error) {
      setChat({ error: data.error });
    }
  }

  if (chat.error) {
    return <h1>{chat.error}</h1>;
  }
  return (
    <Row className="justify-content-center">
      <Col xs={9} md={6}>
        <Row>
          <Col xs="auto">
            <h1>{chat.name}</h1>
          </Col>
          <Col xs="auto">
            {hasChatAdminRights ? (
              <DropdownButton
                as={ButtonGroup}
                variant="primary"
                title="Block member"
              >
                {chat.chatMembers
                  .filter((cm) => !cm.ChatMember.blocked)
                  .map((cm, i) => {
                    if (cm.ChatMember.creator) {
                      return "";
                    }
                    return (
                      <Dropdown.Item
                        eventKey={i}
                        onClick={() => setBlocked(cm.id, true)}
                        active={false}
                        key={cm.id}
                      >
                        {cm.firstName} {cm.lastName}
                      </Dropdown.Item>
                    );
                  })}
                <Dropdown.Divider />
                {chat.chatMembers
                  .filter((cm) => cm.ChatMember.blocked)
                  .map((cm, i) => {
                    if (cm.ChatMember.creator) {
                      return "";
                    }
                    return (
                      <Dropdown.Item
                        eventKey={i}
                        onClick={() => setBlocked(cm.id, false)}
                        active={false}
                        key={cm.id}
                        style={{ color: "red" }}
                      >
                        {cm.firstName} {cm.lastName}
                      </Dropdown.Item>
                    );
                  })}
              </DropdownButton>
            ) : (
              ""
            )}
            {isCreator ? (
              <Col xs="auto">
                <Button
                  onClick={() =>
                    navigate("/users", { state: { chatId: chat.id } })
                  }
                >
                  Invite
                </Button>
              </Col>
            ) : (
              ""
            )}
          </Col>
        </Row>

        <Stack
          style={{
            overflowY: "scroll",
            height: "60vh",
          }}
          ref={messageRef}
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
              <Row className="justify-content-stretch">
                <Col xs="auto">
                  <p style={{ fontWeight: "bold" }}>
                    {`${new Date(m.createdAt).toLocaleString()} ${
                      m.User.firstName
                    } ${m.User.lastName} `}
                    <span style={{ color: "red" }}>
                      {m.User.userRole === "admin" ? "Admin" : ""}
                    </span>
                    :
                  </p>
                </Col>
                {isAdmin ? (
                  <Col xs="auto">
                    <Button onClick={() => deleteMessage(m.id)}>Delete</Button>
                  </Col>
                ) : (
                  ""
                )}
              </Row>
              <Row>
                <p>{m.content}</p>
              </Row>
            </Row>
          ))}
        </Stack>
        <Form>
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
