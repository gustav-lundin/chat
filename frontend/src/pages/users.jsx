import { useEffect, useRef, useState } from "react";
import { Stack, Row, Col, Form, Button } from "react-bootstrap";
import { fetchJson } from "../fetch.js";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../App.jsx";

function Users(props) {
  const [users, setUsers] = useState([]);
  const [invitedUsers, setInvitedUsers] = useState(new Set());
  const searchRef = useRef();
  const { state } = useLocation();
  const chatId = state?.chatId ?? null;
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const userData = await fetchJson("users/all");
        if (userData.error) {
          // navigate("/error");
          return;
        }
        const users = userData.filter((u) => u.id != user.id);
        setUsers(users);
        if (chatId != null) {
          const data = await fetchJson(`chats/${chatId}`);
          console.log(data);
          if (data.error) {
            return;
          }
          const invitedUsers = data.chat.chatMembers.map((cm) => cm.id);
          setInvitedUsers(new Set(invitedUsers));
        }
      } catch (e) {
        console.log(e);
        // navigate("/error");
      }
    })();
  }, []);

  async function onSearch(e) {
    e.preventDefault();
    const searchKey = searchRef.current.value;
    try {
      const data = await fetchJson(`users/all?search_query=${searchKey}`);
      if (data.error) {
        return;
      }
      setUsers(data);
    } catch (e) {
      console.log(e);
    }
  }

  async function invite(userId) {
    try {
      const data = await fetchJson(`chatmembers/${chatId}/${userId}`, "POST");
      if (data.error) {
        return;
      }
      setInvitedUsers((s) => new Set(s.add(userId)));
      console.log(data);
    } catch (e) {
      console.log(e);
    }
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
