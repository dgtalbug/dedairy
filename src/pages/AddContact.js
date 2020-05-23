import React, { useState, useContext, useEffect } from "react";
import firebase from "firebase/app";

import {
  Container,
  Form,
  FormGroup,
  Input,
  Button,
  Spinner,
  Row,
  Col,
} from "reactstrap";

// to compress image before uploading to the server
import { readAndCompressImage } from "browser-image-resizer";

// configs for image resizing
import { imageConfig } from "../utils/config";

import { v4 } from "uuid";

import { ContactContext } from "../context/Context";
import { CONTACT_TO_UPDATE } from "../context/action.types";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";

import validator from "validator";

const AddContact = () => {
  const { state, dispatch } = useContext(ContactContext);
  const { contactToUpdate, contactToUpdateKey } = state;
  const history = useHistory();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState(null);
  const [isUpdate, setIsUpdate] = useState(false);
  const defaultAvatar = useState(
    "gs://dedairy-b4d2b.appspot.com/images/default-avatar.png"
  );
  useEffect(() => {
    if (contactToUpdate) {
      setName(contactToUpdate.name);
      setEmail(contactToUpdate.email);
      setPhoneNumber(contactToUpdate.phoneNumber);
      setDownloadUrl(contactToUpdate.picture);

      setIsUpdate(true);
    }
  }, [contactToUpdate]);

  const imagePicker = async (e) => {
    try {
      const file = e.target.files[0];
      var metadata = {
        contentType: file.type,
      };
      let resizedImage = await readAndCompressImage(file, imageConfig);
      const storageRef = await firebase.storage().ref();
      var uploadTask = storageRef
        .child("images/" + file.name)
        .put(resizedImage, metadata);
      uploadTask.on(
        firebase.storage.TaskEvent.STATE_CHANGED,
        (snapshot) => {
          setIsUploading(true);
          var progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          switch (snapshot.state) {
            case firebase.storage.TaskState.PAUSED:
              setIsUploading(false);
              // console.log("Uploading is Paused");
              break;

            case firebase.storage.TaskState.RUNNING:
              // console.log("Uploading is in Progress");
              // toast(`Uploading ${progress} %`, { type: "info" });
              setIsUploading(true);
              break;

            default:
              break;
          }
          if (progress === 100) {
            setIsUploading(false);
          }
        },
        (error) => {
          toast("Something is wrong in state change", { type: "error" });
        },
        () => {
          uploadTask.snapshot.ref
            .getDownloadURL()
            .then((downloadURL) => {
              setDownloadUrl(downloadURL);
              // toast("Image Added", { type: "info" });
            })
            .catch((err) => console.error(err));
        }
      );
    } catch (error) {
      console.error(error);
      toast("Something went Wrong", { type: "error" });
    }
  };

  const addContact = async () => {
    try {
      firebase
        .database()
        .ref("contacts/" + v4())
        .set({
          name,
          email,
          phoneNumber,
          picture: downloadUrl,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        });
      toast("Contact Added ", { type: "success" });
    } catch (err) {
      console.error(err);
      toast("Cant Add Now", { type: "error" });
    }
  };

  const updateContact = async () => {
    try {
      firebase
        .database()
        .ref("contacts/" + contactToUpdateKey)
        .set({
          name,
          email,
          phoneNumber,
          picture: downloadUrl,
          updatedAt: Date.now(),
        });
      toast("Contact Updated ", { type: "success" });
    } catch (error) {
      console.error(error);
      toast("Cant update Now", { type: "error" });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !email || !phoneNumber) {
      toast("Please Fill in all Details", { type: "warning" });
      return;
    }
    if (!validator.isMobilePhone(phoneNumber)) {
      toast("Please Enter the valid Phone Number", { type: "warning" });
      return;
    }
    isUpdate ? updateContact() : addContact();

    dispatch({
      type: CONTACT_TO_UPDATE,
      payload: null,
      key: null,
    });

    history.push("/");
  };

  return (
    <Container fluid className="mt-5">
      <Row>
        <Col md="6" className="card offset-md-3">
          <h2 className="text-center text-secondary">Welcome to E-Dairy</h2>
          <Form onSubmit={handleSubmit}>
            <div className="text-center">
              <div>
                <label htmlFor="imagepicker" className="">
                  {downloadUrl ? (
                    <img src={downloadUrl} alt="" className="profile" />
                  ) : (
                    " "
                  )}
                </label>
              </div>
            </div>

            <FormGroup>
              <Input
                type="text"
                name="name"
                id="name"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </FormGroup>
            <FormGroup>
              <Input
                type="email"
                name="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
              />
            </FormGroup>
            <FormGroup>
              <Input
                type="text"
                name="number"
                id="honenumber"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="Phone Number"
              />
            </FormGroup>

            {isUploading ? (
              <Spinner type="grow" color="primary" />
            ) : !downloadUrl ? (
              <FormGroup>
                <Input
                  type="file"
                  name="image"
                  id="imagepicker"
                  multiple={false}
                  onChange={(e) => imagePicker(e)}
                />
              </FormGroup>
            ) : (
              ""
            )}
            <Button
              type="submit"
              color="primary"
              block
              className="text-uppercase"
            >
              {isUpdate ? "Update Contact" : "Add Contact"}
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default AddContact;
