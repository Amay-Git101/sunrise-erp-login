import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import LoginForm from "./components/LoginForm";
import Dashboard from "./pages/Dashboard";
import UserList from "./pages/Users/UserList";
import MeasurementList from "./pages/Masters/MeasurementList"; // <--- Imported the new page

const App = () => {
  return (
    <Routes>
      {/* Public Route: Login */}
      <Route path="/login" element={<LoginForm />} />
      
      {/* Protected Routes (Wrapped in Layout with Sidebar & TopBar) */}
      <Route element={<Layout />}>
        {/* Default Redirect: Go to Dashboard */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        
        {/* Main Pages */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/users" element={<UserList />} />
        
        {/* Master Pages */}
        <Route path="/measurements" element={<MeasurementList />} />
      </Route>
    </Routes>
  );
};

export default App;