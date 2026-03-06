import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Discovery from "./pages/Discovery";
import Community from "./pages/Community";
import Vision from "./pages/Vision";
import Growth from "./pages/Growth";
import Profile from "./pages/Profile";

// Placeholder components for other routes
const Placeholder = ({ title }: { title: string }) => (
  <div className="flex flex-col items-center justify-center py-20 space-y-4">
    <h1 className="text-3xl font-display font-bold text-brand-dark">{title}</h1>
    <p className="text-slate-500">This module is coming soon to your journey.</p>
  </div>
);

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/vision" element={<Vision />} />
          <Route path="/discovery" element={<Discovery />} />
          <Route path="/growth" element={<Growth />} />
          <Route path="/community" element={<Community />} />
          <Route path="/events" element={<Placeholder title="Events & Workshops" />} />
          <Route path="/resources" element={<Placeholder title="Resources & Blog" />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<Placeholder title="Settings" />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}
