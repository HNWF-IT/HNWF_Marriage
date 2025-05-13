import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";
import Login from "../components/login/Login";
import Layout from "../components/commons/Layout";
import CandidateDashboard from "../components/candidate/CandidateDashboard";
import Dashboard from "../components/dashboard/Dashboard";
import isLoggedIn from "../utils";
import BookList from "../components/library/BookList";
import CandidateProfile from "../components/candidate/CandidateProfile";

let ROUTES = <></>;

if (isLoggedIn()) {
  // if (true) {
  ROUTES = <>
    <Route path="/" element={<Layout />}>
      <Route path="login" element={<Login />} />
      <Route path="dashboard" element={<Dashboard />} />
      <Route path="marriage" element={<CandidateDashboard />} />
      <Route path="/candidates/:id" element={<CandidateProfile />} />
      <Route path="library" element={<BookList />} />
    </Route>
  </>
} else {
  ROUTES = <><Route path="*" element={<Login />} /></>
}

const routes = createRoutesFromElements(ROUTES);
const router = createBrowserRouter(routes);

export default router;
