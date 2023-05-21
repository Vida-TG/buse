import { BrowserRouter, Routes, Route } from "react-router-dom"

// pages
import Scan from "./Pages/Scan"
import Home from "./Pages/Home"
import Send from "./Pages/Send"
import { WagmiConfig } from "wagmi";
import { config } from './Config/WagmiConfig'
import "./App.css";

export default function App() {
  return (
    <WagmiConfig config={config}>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/scan" element={<Scan />} />
        <Route path="/send" element={<Send />} />
      </Routes>
    </BrowserRouter>
    </WagmiConfig>
  )
}