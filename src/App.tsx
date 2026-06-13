import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";
import Login from "./pages/Login";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import MeusSites from "./pages/MeusSites";
import CriarSite from "./pages/CriarSite";
import EditarSite from "./pages/EditarSite";
import Portfolio from "./pages/Portfolio";
import WABAs from "./pages/WABAs";
import Proxies from "./pages/Proxies";
import Listas from "./pages/Listas";
import Encurtador from "./pages/Encurtador";
import ChatWA from "./pages/ChatWA";

export default function App() {
  const [loggedIn, setLoggedIn] = useState(false);

  if (!loggedIn) {
    return <Login onLogin={() => setLoggedIn(true)} />;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout onLogout={() => setLoggedIn(false)} />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="sites" element={<MeusSites />} />
          <Route path="sites/new" element={<CriarSite />} />
          <Route path="sites/:slug/edit" element={<EditarSite />} />
          <Route path="portfolio" element={<Portfolio />} />
          <Route path="waba" element={<WABAs />} />
          <Route path="proxies" element={<Proxies />} />
          <Route path="listas" element={<Listas />} />
          <Route path="encurtador" element={<Encurtador />} />
          <Route path="chat" element={<ChatWA />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
