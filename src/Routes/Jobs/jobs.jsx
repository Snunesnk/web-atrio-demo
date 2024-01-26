import { useEffect, useState } from "react";
import "./jobs.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ApiService from "../../Services/api.service";
import { Autocomplete, TextField } from "@mui/material";

export const AddJob = () => {
  const [formData, setFormData] = useState({
    userId: null,
    title: "",
    dateStarted: null,
    dateEnded: null,
    company: null,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [users, setUsers] = useState([]);
  const [companies, setCompanies] = useState([]);

  useEffect(() => {
    ApiService.get("/user")
      .then((res) => {
        setUsers(
          res.map((user) => ({
            label: user.firstName + " " + user.lastName,
            value: user.id,
          }))
        );
      })
      .catch((error) => {
        console.log(error);
      });

    ApiService.get("/job/companies")
      .then((res) => {
        setCompanies(res.map((company) => company));
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    ApiService.post("/job", formData)
      .then(() => {
        setLoading(false);
      })
      .catch(async (error) => {
        const res = await error.response.json();
        if (res.errors.UserId) setError(res.errors.UserId[0]);
        else if (res.errors.Title) setError(res.errors.Title[0]);
        else if (res.errors.DateStarted) setError(res.errors.DateStarted[0]);
        else if (res.errors.DateEnded) setError(res.errors.DateEnded[0]);
        else if (res.errors.Company) setError(res.errors.Company[0]);
        setLoading(false);
      });
  };

  const setUser = (e) => {
    const data = e.target.firstChild.data;
    const user = users.find((usr) => usr.label === data);

    if (!user || user === "") {
      setFormData({ ...formData, userId: null });
      return;
    }

    setFormData({ ...formData, userId: user.value });
  };

  const setCompany = (e) => {
    const data = e.target.value;
    if (!data || data === "") {
      setFormData({ ...formData, company: null });
      return;
    }

    setFormData({ ...formData, company: data });
  };

  return (
    <div>
      <h1>Add new job</h1>

      <div className="new-user-card">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="user">User</label>
            <Autocomplete
              id="user-autocomplete"
              name="user"
              options={users}
              renderInput={(params) => <TextField {...params} label="User" />}
              onChange={setUser}
            />
          </div>
          <div className="form-group">
            <label htmlFor="role">Role</label>
            <input
              type="text"
              name="role"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
            />
          </div>
          <div className="form-group">
            <label htmlFor="role">Company</label>
            <Autocomplete
              id="company-autocomplete"
              freeSolo
              name="company"
              options={companies}
              renderInput={(params) => (
                <TextField {...params} label="Company" />
              )}
              onKeyUp={setCompany}
            />
          </div>
          <div className="form-group">
            <label htmlFor="start-date">Start date</label>
            <DatePicker
              name="start-date"
              selected={formData.dateStarted}
              onChange={(date) =>
                setFormData({ ...formData, dateStarted: date })
              }
            />
          </div>
          <div className="form-group">
            <label htmlFor="end-date">End date</label>
            <DatePicker
              name="end-date"
              selected={formData.dateEnded}
              onChange={(date) => setFormData({ ...formData, dateEnded: date })}
            />
          </div>
          {loading ? <p>Loading...</p> : <button type="submit">Add job</button>}
          {error && <p className="error">{error}</p>}
          {success && <p className="success">User added successfully !</p>}
        </form>
      </div>
    </div>
  );
};

export const ShowJobs = () => {
  const [users, setUsers] = useState([]);
  const [user, setUser] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    ApiService.get("/user")
      .then((res) => {
        setUsers(
          res.map((user) => ({
            label: user.firstName + " " + user.lastName,
            value: user.id,
          }))
        );
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const setTargetUser = (e) => {
    const data = e.target.firstChild.data;
    const user = users.find((usr) => usr.label === data);

    if (!user || user === "") {
      setUser(null);
      return;
    }

    setUser(user.value);
  };

  const getJobs = () => {
    const startDateISO = startDate ? startDate.toISOString() : null;
    const endDateISO = endDate ? endDate.toISOString() : null;
    ApiService.get(`/job/user/${user}/${startDateISO}/${endDateISO}`)
      .then((res) => {
        setJobs(res);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div>
      <h1>Show jobs</h1>
      <Autocomplete
        id="user-autocomplete"
        name="user"
        options={users}
        renderInput={(params) => <TextField {...params} label="User" />}
        onChange={setTargetUser}
      />
      <div className="form-group">
        <label htmlFor="start-date">Start date</label>
        <DatePicker
          name="start-date"
          selected={startDate}
          onChange={(date) => setStartDate(date)}
        />
      </div>
      <div className="form-group">
        <label htmlFor="end-date">End date</label>
        <DatePicker
          name="end-date"
          selected={endDate}
          onChange={(date) => setEndDate(date)}
        />
      </div>
      <button onClick={getJobs}>Get jobs</button>
      <div className="users">
        {jobs.map((job) => (
          <div className="user-card" key={job.id}>
            <p>Title: {job.title}</p>
            <p>Company: {job.company}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
