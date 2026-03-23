import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { HomePage } from "./pages/HomePage";
import { GamePage } from "./pages/GamePage";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <Link to="/" className="app-title-link"><h1 className="app-title">Alpha<span className="accent">Gomoku</span> Server</h1></Link>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/:gameId" element={<GamePage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
