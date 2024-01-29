import { useEffect, useState } from "react";
import "./users.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ApiService from "../../Services/api.service";

const ERRORS = {
  empty: "At least one field is missing",
  invalid: "Invalid input",
  tooOld: "Sorry, user is too old",
};

export const AddUser = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    birthDate: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!formData.birthDate || !formData.firstName || !formData.lastName) {
      setError(ERRORS.empty);
      setLoading(false);
      return;
    }

    if (formData.birthDate.getFullYear() <= new Date().getFullYear() - 150) {
      setError(ERRORS.tooOld);
      setLoading(false);
      return;
    }

    ApiService.post("/user", formData)
      .then(() => {
        setLoading(false);
      })
      .catch(async (error) => {
        const res = await error.response.json();
        if (res.errors.BirthDate) setError(res.errors.BirthDate[0]);
        else if (res.errors.FirstName) setError(res.errors.FirstName[0]);
        else if (res.errors.LastName) setError(res.errors.LastName[0]);
        setLoading(false);
      });
  };

  return (
    <div>
      <h1>Add new user</h1>
      <div className="new-user-card">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="first-name">First name</label>
            <input
              type="text"
              name="first-name"
              value={formData.firstName}
              onChange={(e) =>
                setFormData({ ...formData, firstName: e.target.value })
              }
            />
          </div>
          <div className="form-group">
            <label htmlFor="last-name">Last name</label>
            <input
              type="text"
              name="last-name"
              value={formData.lastName}
              onChange={(e) =>
                setFormData({ ...formData, lastName: e.target.value })
              }
            />
          </div>
          <div className="form-group">
            <label htmlFor="birth-date">Birth date</label>
            <DatePicker
              name="birth-date"
              selected={formData.birthDate}
              onChange={(date) => setFormData({ ...formData, birthDate: date })}
            />
          </div>
          {loading ? (
            <p>Loading...</p>
          ) : (
            <button type="submit">Add user</button>
          )}
          {error && <p className="error">{error}</p>}
          {success && <p className="success">User added successfully !</p>}
        </form>
      </div>
    </div>
  );
};

export const ShowUsers = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    ApiService.get("/user/jobs")
      .then((res) => {
        setUsers(res);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  function calculateAge(birthDateString) {
    console.log(birthDateString);
    const birthDate = new Date(birthDateString);
    const today = new Date();

    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();
    const dayDifference = today.getDate() - birthDate.getDate();

    if (monthDifference < 0 || (monthDifference === 0 && dayDifference < 0)) {
      age--;
    }

    return age;
  }

  function formatDate(date) {
    const d = new Date(date);
    const day = ("0" + d.getDate()).slice(-2); // Adds leading zero and gets last two characters
    const month = ("0" + (d.getMonth() + 1)).slice(-2); // Adds leading zero and gets last two characters
    const year = d.getFullYear();

    return `${day}/${month}/${year}`;
  }

  return (
    <div>
      <h1>All employees</h1>
      <div className="jobs-container">
        {users.map((user) => (
          <div className="job-card" key={user.id}>
            <h3>
              {user.firstName} {user.lastName}, {calculateAge(user.birthDate)}yo
            </h3>
            <p></p>
            {user.jobs &&
              user.jobs.map((job) => {
                return (
                  <div className="job" key={job.id}>
                    <p>Job: {job.title}</p>
                    <p>Company: {job.company}</p>
                    <p>
                      {formatDate(job.dateStarted)} -{" "}
                      {job.dateEnded ? formatDate(job.dateEnded) : "now"}
                    </p>
                  </div>
                );
              })}
          </div>
        ))}
      </div>
    </div>
  );
};
