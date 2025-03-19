import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";
import Login from "../components/login/Login";
import Layout from "../components/commons/Layout";
import CandidateDashboard from "../components/candidate/CandidateDashboard";
import CandidateProfile from "../components/candidate/CandidateProfile";
import CandidatesDisplay from "../components/candidate/CandidateDisplay";
import Dashboard from "../components/dashboard/Dashboard";
import isLoggedIn from "../utils";
import Library from "../components/library/Library";

let ROUTES = <></>;

if (isLoggedIn()) {
  ROUTES = <>
    <Route path="/" element={<Layout />}>
      <Route path="login" element={<Login />} />
      <Route path="dashboard" element={<Dashboard />} />
      <Route path="marriage" element={<CandidateDashboard />} />
      <Route path="candidateProfile" element={<CandidateProfile />} />
      <Route path="can" element={<CandidatesDisplay />} />
      <Route path="library" element={<Library />} />
    </Route>
  </>
} else {
  ROUTES = <><Route path="*" element={<Login />} /></>
}

const routes = createRoutesFromElements(ROUTES);
const router = createBrowserRouter(routes);

export default router;
