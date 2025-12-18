import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import MeasurementList from "./pages/Masters/MeasurementList";
import TailoringItemList from "./pages/Masters/TailoringItemList";
import ContactList from "./pages/Contacts/ContactList"; // <--- 1. IMPORT
import CustomerList from "./pages/Masters/CustomerList";

const App = () => {
  return (
    <Routes>
      <Route path="/login" element={<Index />} />
      <Route element={<Layout />}>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/measurements" element={<MeasurementList />} />
        <Route path="/tailoring-items" element={<TailoringItemList />} />
        <Route path="/contacts" element={<ContactList />} /> {/* <--- 2. ADD ROUTE */}
        <Route path="/customers" element={<CustomerList />} />
      </Route>
    </Routes>
  );
};

export default App;