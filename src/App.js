import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Movies from "./pages/Movies";
import Search from "./pages/Search";
import NoPageFound from "./pages/NoPageFound";

export default function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <div className="top-section">
          <Header />
        </div>

        <div className="bottom-section">
          <Routes>
            <Route index element={<Home />} /> {/* Default route */}
            <Route path="/login" element={<Login/>} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/home" element={<Home />} />
            <Route path="/movies" element={<Movies />} />
            <Route path="/search" element={<Search />} />
            <Route path="*" element={<NoPageFound />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}
