import { useEffect, useRef, useState } from "react";
import { Row, Col, Form, Button } from "react-bootstrap";
import { fetchJson } from "../fetch.js";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../App.jsx";

function Users() {
  const [users, setUsers] = useState([]);
  const [invitedUsers, setInvitedUsers] = useState(new Set());
  const searchRef = useRef();
  const { state } = useLocation();
  const chatId = state?.chatId ?? null;
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      const userData = await fetchJson("users/all");
      if (userData.error) {
        setUsers(userData);
        return;
      }
      const users = userData.filter((u) => u.id != user.id);
      setUsers(users);
      if (chatId != null) {
        const data = await fetchJson(`chats/${chatId}`);
        if (data.error) {
          setUsers(data);
          return;
        }
        const invitedUsers = data.chat.chatMembers.map((cm) => cm.id);
        setInvitedUsers(new Set(invitedUsers));
      }
    })();
  }, []);

  async function onSearch(e) {
    e.preventDefault();
    const searchKey = searchRef.current.value;
    const data = await fetchJson(`users/all?search_query=${searchKey}`);
    setUsers(data);
  }

  async function invite(userId) {
    const data = await fetchJson(`chatmembers/${chatId}/${userId}`, "POST");
    if (data.error) {
      setUsers(data);
      return;
    }
    setInvitedUsers((s) => new Set(s.add(userId)));
  }

  if (users.error) {
    return <h1>{users.error}</h1>;
  }
  return (
    <Row className="justify-content-center">
      <Col xs={9} md={6}>
        <Form onSubmit={onSearch}>
          <Form.Control placeholder="Search" ref={searchRef} type="text" />
        </Form>
        {users.map((user) => (
          <Row
            key={user.id}
            style={{
              backgroundColor: "#F5F5F5",
              borderRadius: "20px",
              marginBottom: "10px",
            }}
            className="justify-content-between"
          >
            <Col xs="auto">
              {user.firstName} {user.lastName} {user.email}
            </Col>
            {chatId && !invitedUsers.has(user.id) && (
              <Col xs="auto">
                <Button onClick={() => invite(user.id)}>Invite</Button>
              </Col>
            )}
          </Row>
        ))}
        {chatId && (
          <Button onClick={() => navigate(`/chats/${chatId}`)}>
            Go to chat
          </Button>
        )}
      </Col>
    </Row>
  );
}

export default Users;
