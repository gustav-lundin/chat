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

function Chat(props) {
  const { user } = useContext(UserContext);
  const { chatId } = useParams();
  const navigate = useNavigate();
  const [chat, setChat] = useState({
    id: null,
    name: null,
    chatMessages: [],
    chatMembers: [],
  });
  const messageRef = useRef();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isCreator, setIsCreator] = useState(false);
  const [hasChatAdminRights, setHasChatAdminRights] = useState(false);
  const [blockedChatMemberIds, setBlockedChatMemberIds] = useState(new Set());

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
        if (data.error) {
          navigate("/error");
          return;
        }
        const chat = data.chat;
        const creator = chat.chatMembers.find(
          (member) => member.ChatMember.creator
        );
        console.log({ chat, user, creator });
        console.assert(creator !== undefined);
        if (user.userRole == "admin") {
          setHasChatAdminRights(true);
          setIsAdmin(true);
        }
        if (user.id == creator.id) {
          setHasChatAdminRights(true);
          setIsCreator(true);
        }
        const blockedMemberIds = new Set();
        for (const chatMember of chat.chatMembers) {
          if (chatMember.ChatMember.blocked) {
            blockedMemberIds.add(chatMember.id);
          }
        }
        setBlockedChatMemberIds(blockedMemberIds);
        setChat(chat);
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

    sse.addEventListener("keep-alive", (message) => {
      let data = JSON.parse(message.data);
      console.log("keepalive", data);
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
    return () => sse.close();
  }, []);

  async function setBlocked(userId, blocked) {
    try {
      const data = await fetchJson(
        `chatmembers/block/${chat.id}/${userId}`,
        "PUT",
        { blocked }
      );
      console.log(data);
      if (data.error) {
        return;
      }
      setBlockedChatMemberIds((pre) => {
        const newState = new Set(pre);
        if (blocked) {
          newState.add(userId);
        } else {
          newState.delete(userId);
        }
        return newState;
      });
    } catch (e) {
      console.log(e);
    }
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
                  .filter((cm) => !blockedChatMemberIds.has(cm.id))
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
                  .filter((cm) => blockedChatMemberIds.has(cm.id))
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
              <Col>
                <p style={{ fontWeight: "bold" }}>
                  {`${new Date(m.createdAt).toLocaleString()} ${
                    m.User.firstName
                  } ${m.User.lastName} `}
                  <span style={{ color: "red" }}>
                    {m.User.userRole === "admin" ? "Admin" : ""}
                  </span>
                  :
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
