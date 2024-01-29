import { createBrowserRouter } from "react-router-dom";
import Root from "../Routes/Root/root";
import Error from "../Routes/Error/error";
import { AddUser, ShowUsers } from "../Routes/Users/users";
import { AddJob, ShowJobs } from "../Routes/Jobs/jobs";
import { ShowEmployees } from "../Routes/Company/company";
import Swagger from "../Components/Swagger/swagger";

const router = createBrowserRouter([
  {
    path: "/*",
    element: <Root />,
    errorElement: <Error />,
    children: [
      {
        path: "",
        element: <Swagger />,
      },
      { path: "addUser", element: <AddUser /> },
      {
        path: "showUsers",
        element: <ShowUsers />,
      },
      {
        path: "addJob",
        element: <AddJob />,
      },
      {
        path: "showJob",
        element: <ShowJobs />,
      },
      {
        path: "showEmployees",
        element: <ShowEmployees />,
      },
      {
        path: "*",
        element: <Error />,
      },
    ],
  },
]);

export default router;
