import "./dropdownList.css";
import { Link } from "react-router-dom";

const DropdownList = ({ list }) => {
  return (
    <div className="dropdown-list">
      {list.map((item, index) => (
        <Link to={item.value} key={index}>
          {item.label}
        </Link>
      ))}
    </div>
  );
};

export default DropdownList;
