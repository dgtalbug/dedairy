import React from "react";
import { Navbar, NavbarBrand, NavbarText, NavItem } from "reactstrap";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <Navbar color="primary" light>
      <NavbarBrand tag={Link} to="/" className="text-white">
        E-Dairy
      </NavbarBrand>
      <NavbarText className="text-white float-right">
        <NavItem tag={Link} to="/contact/search" className="text-white p-2">
          Home
        </NavItem>

        <NavItem tag={Link} to="/contact/add" className="text-white p-2">
          Add
        </NavItem>
      </NavbarText>
    </Navbar>
  );
};

export default Header;
