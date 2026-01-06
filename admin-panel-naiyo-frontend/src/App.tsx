import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Partners from "./pages/Partners";
import Services from "./pages/Services";
import PricingPage from "./pages/Pricing";
import Clients from "./pages/Clients";
import OurProjects from "./pages/OurProjects";
import Testimonials from "./pages/Testimonials";
import Login from "./pages/Login";


export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={
              <Login />
          }
        />

        <Route
          path="/dashboard"
          element={
              <Dashboard />
          }
        />

        <Route
          path="/partners"
          element={
              <Partners />
          }
        />

        <Route
          path="/services"
          element={
              <Services />
          }
        />

        <Route
          path="/pricing"
          element={
              <PricingPage />
          }
        />

        <Route
          path="/ourprojects"
          element={
              <OurProjects />
          }
        />

        <Route
          path="/testimonials"
          element={
              <Testimonials />
          }
        />

        <Route
          path="/clients"
          element={
              <Clients />
          }
        />

        {/* DEFAULT */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
