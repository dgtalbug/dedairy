import React, { useContext } from "react";

import { Container, ListGroup, ListGroupItem, Spinner } from "reactstrap";
import Contact from "../components/Contact";
import { ContactContext } from "../context/Context";
import AddContactComponent from "./AddContact";

const Contacts = (Searchkey) => {
  const { state } = useContext(ContactContext);

  const { contacts, isLoading } = state;

  if (isLoading) {
    return (
      <div className="Center">
        <Spinner color="primary" />
        <div className="text-primary">Loading...</div>
      </div>
    );
  }

  return (
    <Container className="mt-4">
      {contacts.length === 0 && !isLoading ? (
        <AddContactComponent />
      ) : (
        <ListGroup>
          {Object.entries(contacts).map(([key, value]) => (
            <ListGroupItem key={key}>
              <Contact contact={value} contactKey={key} />
            </ListGroupItem>
          ))}
        </ListGroup>
      )}
    </Container>
  );
};

export default Contacts;
