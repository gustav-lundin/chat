import { useEffect, useState } from "react";
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
} from "react-bootstrap";
import { Link } from "react-router-dom";

const sortByOptions = ["Name", "User activity", "Chat activity"];
const sortByRoutes = ["name", "useractivity", "chatactivity"];

function Chats(props) {
  const [chats, setChats] = useState({});
  const [sortByIndex, setSortByIndex] = useState(0);

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
