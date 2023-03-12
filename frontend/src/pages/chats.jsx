import { useEffect, useRef, useState } from "react";
import { fetchJson } from "../fetch";
import {
  Stack,
  Container,
  Button,
  Row,
  Col,
  Alert,
  DropdownButton,
  Dropdown,
  ButtonGroup,
  Form,
} from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { validateChatName } from "../util/validations";

const sortByOptions = ["Name", "User activity", "Chat activity"];
const sortByRoutes = ["name", "useractivity", "chatactivity"];

function Chats(props) {
  const [chats, setChats] = useState({});
  const [sortByIndex, setSortByIndex] = useState(0);
  const chatNameRef = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const data = await fetchJson(
          `chats/all?orderby=${sortByRoutes[sortByIndex]}`
        );
        console.log(data);
        if (!data.error) {
          setChats(data);
        }
      } catch (e) {
        console.log(e);
      }
    })();
  }, [sortByIndex]);

  async function onSubmitNewChat(e) {
    e.preventDefault();
    const chatName = chatNameRef.current.value;
    const validationError = validateChatName(chatName);
    if (validationError !== "") {
      chatNameRef.current.value = "";
      chatNameRef.current.placeholder = validationError;
      return;
    }
    try {
      const data = await fetchJson("/chats", "POST", { name: chatName });
      if (data.error) {
        console.log("error");
        return;
      }
      navigate(`/chats/${data.chat.id}`);
    } catch (e) {
      console.log(e);
    }
  }

  return (
    <Row className="justify-content-center">
      <Col xs={9} md={6}>
        <Stack gap={3}>
          <Row>
            <Col xs="auto">
              <DropdownButton
                as={ButtonGroup}
                variant="primary"
                title="Sort by"
              >
                {sortByOptions.map((o, i) => (
                  <Dropdown.Item
                    eventKey={i}
                    onClick={() => setSortByIndex(i)}
                    active={i === sortByIndex}
                    key={i}
                  >
                    {o}
                  </Dropdown.Item>
                ))}
              </DropdownButton>
            </Col>
            <Col xs="auto">
              <Form onSubmit={onSubmitNewChat}>
                <Row>
                  <Col xs="auto">
                    <Form.Group>
                      <Form.Control
                        type="text"
                        placeholder="Enter chat name"
                        ref={chatNameRef}
                      />
                    </Form.Group>
                  </Col>
                  <Col xs="auto">
                    <Button type="submit">New chat</Button>
                  </Col>
                </Row>
              </Form>
            </Col>
          </Row>
          <Row>
            <h1>Active</h1>
          </Row>
          {chats.active?.length > 0 ? (
            chats.active?.map((chat) => (
              <Row key={chat.id}>
                <Link to={`/chats/${chat.id}`}>{chat.name}</Link>
              </Row>
            ))
          ) : (
            <h2>No chats found..</h2>
          )}
        </Stack>
        <Stack gap={3}>
          <Row>
            <h1>Invited</h1>
          </Row>
          {chats.invited?.length > 0 ? (
            chats.invited?.map((chat) => (
              <Row key={chat.id}>
                <Link to={`/chats/${chat.id}`}>{chat.name}</Link>
              </Row>
            ))
          ) : (
            <h2>No chats found..</h2>
          )}
        </Stack>
        <Stack gap={3}>
          <Row>
            <h1>Blocked</h1>
          </Row>
          {chats.blocked?.length > 0 ? (
            chats.blocked?.map((chat) => (
              <Row key={chat.id}>
                <Link to={`/chats/${chat.id}`}>{chat.name}</Link>
              </Row>
            ))
          ) : (
            <h4>No chats found..</h4>
          )}
        </Stack>
      </Col>
    </Row>
  );
}

export default Chats;
