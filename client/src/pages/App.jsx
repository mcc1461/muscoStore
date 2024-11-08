// src/pages/App.jsx

import React from "react";
import { Route, Routes } from "react-router-dom";

// Import your components
import Home from "../components/Home";
import Login from "./Login";
import Register from "./Register";
import Dashboard from "./Dashboard";
import Board from "./Board";
import Products from "./Products";
import Issues from "./Issues";
import Settings from "./Settings";
import Profile from "./Profile";
import Updateprofile from "./Updateprofile";
import Addproducts from "./Addproducts";
import ForgotPassword from "./ForgotPassword";
import ResetPassword from "./ResetPassword";
import Editproduct from "./Editproduct";
import PrivateRoute from "../components/PrivateRoute";
import Deleteproducts from "./Deleteproducts";
import FirmsList from "../utils/FirmsList";
import BrandsList from "../utils/BrandsList";
import ProductsList from "../utils/ProductsList";
import PurchaseManagement from "../components/PurchaseManagement/PurchaseManagement";

// Import the NotFound component
import NotFound from "./NotFound"; // Adjust the path if necessary

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/forgotPassword" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      {/* Dashboard Routes */}
      <Route path="/dashboard" element={<Dashboard />}>
        {/* Default Dashboard Page */}
        <Route index element={<Board />} />
        <Route path="board" element={<Board />} />

        {/* Private Routes within Dashboard */}
        <Route element={<PrivateRoute />}>
          {/* Nested Routes */}
          <Route path="profile" element={<Profile />} />
          <Route path="update" element={<Updateprofile />} />
          <Route path="addproducts" element={<Addproducts />} />
          <Route path="products/:id" element={<Products />} />
          <Route path="editproduct/:id" element={<Editproduct />} />
          <Route path="deleteproduct/:id" element={<Deleteproducts />} />

          {/* New Nested Routes */}
          <Route path="firms" element={<FirmsList />} />
          <Route path="brands" element={<BrandsList />} />
          <Route path="products" element={<ProductsList />} />
          <Route path="purchases" element={<PurchaseManagement />} />
        </Route>

        {/* Public Routes within Dashboard */}
        <Route path="issues" element={<Issues />} />
        <Route path="settings" element={<Settings />} />
      </Route>

      {/* Catch-all Route for 404 Not Found */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
