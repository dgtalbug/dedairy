import React, { useContext } from "react";
import { Row, Col } from "reactstrap";
// import { FaRegStar, FaStar } from "react-icons/fa";
import { MdDelete, MdEdit } from "react-icons/md";
import firebase from "firebase/app";
import { ContactContext } from "../context/Context";
import { CONTACT_TO_UPDATE, SET_SINGLE_CONTACT } from "../context/action.types";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import { defaultAvatarUrl } from "../utils/config";
// import { defaultAvatar } from "./defaultAvatar.png";

const Contact = ({ contact, contactKey }) => {
  const { dispatch } = useContext(ContactContext);
  const defaultAvatar = defaultAvatarUrl;
  const history = useHistory();

  const deleteContact = () => {
    firebase
      .database()
      .ref(`/contacts/${contactKey}`)
      .remove()
      .then(() => {
        toast("Contact Deleted", { type: "success" });
      })
      .catch((err) => {
        console.error(err);
        toast("Cant Delete Now", { type: "error" });
      });
  };

  const updateContact = () => {
    dispatch({
      type: CONTACT_TO_UPDATE,
      payload: contact,
      key: contactKey,
    });
    history.push("/contact/add");
  };

  const viewSingleContact = (contact) => {
    dispatch({
      type: SET_SINGLE_CONTACT,
      payload: contact,
    });
    history.push("/contact/view");
  };

  const updatedAt = (contact) => {
    let diffForHumans = new Date(contact.updatedAt);
    return diffForHumans.toDateString();
  };

  return (
    <>
      <Row>
        <Col
          md="1"
          className="d-flex justify-content-center align-items-center"
        ></Col>
        <Col
          md="2"
          className="d-flex justify-content-center align-items-center"
        >
          <img
            src={contact.picture ? contact.picture : defaultAvatar}
            alt=""
            className="img-circle profile"
          />
        </Col>
        <Col md="6">
          <div className="text-primary">{contact.name}</div>

          <div className="text-secondary">{contact.phoneNumber}</div>
          <div className="text-secondary">{contact.email}</div>

          <div className="text-info">{updatedAt(contact)}</div>
        </Col>
        <Col
          md="2"
          className="d-flex justify-content-center align-items-center"
        >
          <MdDelete
            onClick={() => deleteContact()}
            color="danger"
            className="text-danger icon"
          />
          <MdEdit
            className="icon text-info ml-2"
            onClick={() => updateContact()}
          />
        </Col>
        <Col
          md="1"
          className="d-flex justify-content-center align-items-center"
        ></Col>
      </Row>
    </>
  );
};

export default Contact;
