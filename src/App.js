import React, { useReducer, useEffect } from "react";
import { Container } from "reactstrap";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import { firebaseConfig } from "./utils/config";
import firebase from "firebase/app";
import "firebase/database";
import "firebase/storage";
import AddContact from "./pages/AddContact";
import Contacts from "./pages/Contacts";
import Header from "./layout/Header";
import Footer from "./layout/Footer";
import ViewContact from "./pages/ViewContact";
import SearchContact from "./pages/SearchContact";
import PageNotFound from "./pages/PageNotFound";
import reducer from "./context/reducer";
import { ContactContext } from "./context/Context";
import { SET_CONTACT, SET_LOADING } from "./context/action.types";

firebase.initializeApp(firebaseConfig);

const initialState = {
  contacts: [],
  contact: {},
  contactToUpdate: null,
  contactToUpdateKey: null,
  isLoading: false,
};

const App = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const getContacts = async () => {
    dispatch({
      type: SET_LOADING,
      payload: true,
    });

    const contactsRef = await firebase.database().ref("/contacts");
    contactsRef.on("value", (snapshot) => {
      dispatch({
        type: SET_CONTACT,
        payload: snapshot.val(),
      });
      dispatch({
        type: SET_LOADING,
        payload: false,
      });
    });
  };

  useEffect(() => {
    getContacts();
  }, []);

  return (
    <Router>
      <ContactContext.Provider value={{ state, dispatch }}>
        <ToastContainer />
        <Header />
        <Container>
          <Switch>
            <Route exact path="/contact/add" component={AddContact} />
            <Route exact path="/contact/view" component={ViewContact} />
            <Route exact path="/contact/search" component={SearchContact} />
            <Route exact path="/" component={Contacts} />
            <Route exact path="*" component={PageNotFound} />
          </Switch>
        </Container>

        <Footer />
      </ContactContext.Provider>
    </Router>
  );
};

export default App;
