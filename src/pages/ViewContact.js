import React, { useContext } from "react";

import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  CardTitle,
  CardSubtitle,
} from "reactstrap";
import { FaEnvelope, FaPhone } from "react-icons/fa";
import { ContactContext } from "../context/Context";
import { defaultAvatarUrl } from "../utils/config";
const ViewContact = () => {
  const { state } = useContext(ContactContext);
  const { contact } = state;
  const defaultAvatar = defaultAvatarUrl;
  return (
    <Container>
      <Row className="mt-5 mb-5">
        <Col md="5" className="offset-md-3">
          <Card className="pt-3 pb-5">
            <CardBody className="text-center ">
              <img
                height="150"
                width="150"
                className="cardImg profile border-danger"
                src={contact.picture ? contact.picture : defaultAvatar}
                alt=""
              />
              <CardTitle className="text-primary mt-3">
                <h1>{contact?.name}</h1>
              </CardTitle>
              <CardSubtitle>
                <h3>
                  <FaPhone className="mr-2" />
                  {contact?.phoneNumber}
                </h3>
              </CardSubtitle>
              <a
                className="btn btn-primary btn-block"
                // eslint-disable-next-line react/jsx-no-target-blank
                target="_blank"
                href={`mailto:{contact?.email}`}
              >
                <FaEnvelope className="icon mr-2" />
                {contact?.email}
              </a>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ViewContact;
