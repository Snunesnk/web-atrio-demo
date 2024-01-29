import { useEffect, useState } from "react";
import "./navbar.css";
import DropdownList from "../DropdownList/dropdownList";

const ITEMS = {
  Users: "Users",
  Jobs: "Jobs",
  Company: "Company",
};

const USER_LIST = [
  { label: "Add user", value: "addUser" },
  { label: "Show users", value: "showUsers" },
];
const JOB_LIST = [
  { label: "Add new job", value: "addJob" },
  { label: "Show Jobs", value: "showJob" },
];
const COMPANY_LIST = [{ label: "Show employees", value: "showEmployees" }];

const Navbar = () => {
  const [itemClicked, setItemClicked] = useState("");

  useEffect(() => {
    const handleClick = (e) => {
      if (e.target.tagName !== "LI") {
        setItemClicked("");
      }
    };
    document.addEventListener("click", handleClick);
    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, []);

  return (
    <div id="navbar">
      <a href="/" className="main-icon">
        React app
      </a>
      <ul>
        <li onClick={() => setItemClicked(ITEMS.Users)}>
          Users
          {itemClicked === ITEMS.Users && <DropdownList list={USER_LIST} />}
        </li>
        <li onClick={() => setItemClicked(ITEMS.Jobs)}>
          Jobs
          {itemClicked === ITEMS.Jobs && <DropdownList list={JOB_LIST} />}
        </li>
        <li onClick={() => setItemClicked(ITEMS.Company)}>
          Company
          {itemClicked === ITEMS.Company && (
            <DropdownList list={COMPANY_LIST} />
          )}
        </li>
      </ul>
    </div>
  );
};

export default Navbar;
