import React, { useState, useContext } from "react";
import firebase from "firebase/app";

import { Container, Row, Col, Form, Input, Button, Spinner } from "reactstrap";
import Contacts from "../pages/Contacts";
import { toast } from "react-toastify";

import { SET_SEARCH_RESULT } from "../context/action.types";
import { ContactContext } from "../context/Context";
const ViewContact = () => {
  const { state, dispatch } = useContext(ContactContext);
  const { contacts } = state;
  const [searchKey, setSearchKey] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const searchHandler = async () => {
    try {
      firebase
        .database()
        .ref("contacts")
        .orderByChild("phoneNumber")
        .equalTo(searchKey)
        .on("value", function (snapshot) {
          if (snapshot.val() === null) {
            toast("Contact Not Found", { type: "warning" });
          } else {
            dispatch({
              type: SET_SEARCH_RESULT,
              payload: snapshot.val(),
            });
            toast("Populating Results", { type: "warning" });
          }
          setIsLoading(false);
        });
    } catch (error) {
      console.error(error);
      toast("Something Wrong", { type: "error" });
    }
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!searchKey) {
      toast("Please Enter Search Term To Proceed", { type: "warning" });
      return;
    }
    setIsLoading(true);
    searchHandler();
  };
  return (
    <Container fluid className="">
      <Row>
        <Col md="6" className="card offset-md-3">
          <Form onSubmit={handleSubmit}>
            <Input
              type="text"
              name="searchKey"
              id="name"
              placeholder="Search"
              value={searchKey}
              onChange={(e) => setSearchKey(e.target.value)}
              style={{ width: "80%", display: "unset" }}
            />
            <Button
              color="primary"
              type="submit"
              className="text-uppercase"
              style={{ float: "right" }}
            >
              Search
            </Button>
          </Form>
        </Col>
      </Row>
      {isLoading ? <Spinner type="grow" color="primary" /> : <Contacts />}
    </Container>
  );
};

export default ViewContact;
