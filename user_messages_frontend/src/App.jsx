import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import MessageList from "./components/MessageList";
import MessageForm from "./components/MessageForm";
import Profile from "./components/Profile";
import Register from "./components/Register";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/messages" element={<MessageList />} />
        <Route path="/messages/send" element={<MessageForm />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
