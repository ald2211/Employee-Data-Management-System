import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";
import NotFoundPage from "../pages/NotFoundPage";
import Dummy from "../components/EmployeesList";

const Routers = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<Dummy />} />
      <Route path="*" element={<NotFoundPage />} />
    </>
  )
);

export default Routers;
