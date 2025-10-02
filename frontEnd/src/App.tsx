import { RouterProvider } from "react-router-dom";
import Routers from "./routers/Routers";

const App = () => {
  return <RouterProvider router={Routers} />;
};

export default App;
