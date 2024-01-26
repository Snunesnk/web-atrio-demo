import { useEffect, useState } from "react";
import "./company.css";
import ApiService from "../../Services/api.service";
import { Autocomplete, TextField } from "@mui/material";

export const ShowEmployees = () => {
  const [users, setUsers] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [companyName, setCompanyName] = useState(null);

  useEffect(() => {
    ApiService.get("/job/companies")
      .then((res) => {
        setCompanies(res);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const getEmployees = () => {
    ApiService.get("/user?company=" + companyName)
      .then((res) => {
        setUsers(res);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {}, [companyName]);

  return (
    <div>
      <h1>ShowEmployees</h1>
      <Autocomplete
        options={companies}
        getOptionLabel={(option) => option}
        sx={{ width: 300 }}
        onChange={(e, value) => setCompanyName(value)}
        renderInput={(params) => (
          <TextField {...params} label="Company" placeholder="Company" />
        )}
      />
      <button onClick={getEmployees}>Get employees</button>
      <div className="users">
        {users.map((user) => (
          <div className="user-card" key={user.id}>
            <p>
              {user.firstName} {user.lastName}
            </p>
            <p>{user.birthDate}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
