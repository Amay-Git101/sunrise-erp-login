import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import Index from "./pages/Index"; // <--- Import the Split Landing Page
import Dashboard from "./pages/Dashboard";
import MeasurementList from "./pages/Masters/MeasurementList";
import TailoringItemList from "./pages/Masters/TailoringItemList"; 

const App = () => {
  return (
    <Routes>
      <Route path="/login" element={<Index />} /> {/* <--- Route to Index */}
      
      <Route element={<Layout />}>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/measurements" element={<MeasurementList />} />
        <Route path="/tailoring-items" element={<TailoringItemList />} />
      </Route>
    </Routes>
  );
};

export default App;