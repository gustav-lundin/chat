import { useEffect, useRef, useState } from "react";
import { Stack, Row, Col, Form, Button } from "react-bootstrap";
import { fetchJson } from "../fetch";

function Users() {
  const [users, setUsers] = useState([]);
  const searchRef = useRef();

  useEffect(() => {
    (async () => {
      try {
        const data = await fetchJson("users/all");
        console.log(data);
        if (data.error) {
          navigate("/error");
          return;
        }
        setUsers(data);
      } catch (e) {
        console.log(e);
        navigate("/error");
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
          >
            {user.firstName} {user.lastName} {user.email}
          </Row>
        ))}
      </Col>
    </Row>
  );
}

export default Users;
