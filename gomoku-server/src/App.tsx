import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HomePage } from "./pages/HomePage";
import { GamePage } from "./pages/GamePage";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <h1 className="app-title">AlphaGomoku Server</h1>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/:gameId" element={<GamePage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
