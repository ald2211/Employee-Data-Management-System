import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";
import NotFoundPage from "../pages/NotFoundPage";
import EmployeeManagementPage from "../pages/EmployeeManagementPage";

const Routers = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<EmployeeManagementPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </>
  )
);

export default Routers;
