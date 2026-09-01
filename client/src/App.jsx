import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Layout from "./Components/Layout";
import { Route, Routes } from "react-router";
import CreateEvent from "./pages/CreateEvent";
import Event from "./pages/EventDetails";
import Events from "./pages/Events";
import EventDetails from "./pages/EventDetails";
import Profile from "./pages/Profile";
import EditEvent from "./pages/EditEvent";
import MyOrders from "./pages/MyTickets";
import MyEvents from "./pages/MyEvents";
import ManageEvent from "./pages/ManageEvent";

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/events/:id" element={<Event />} />
        <Route path="/register" element={<Register />} />
        <Route path="/account" element={<Profile />} />
        <Route path="/login" element={<Login />} />
        <Route path="/events/create" element={<CreateEvent />} />
        <Route path="/events" element={<Events />} />
        <Route path="/events/:id" element={<EventDetails />} />
        <Route path="/events/:id/edit" element={<EditEvent />} />
        <Route path="/orders" element={<MyOrders />} />
        <Route path="/my-events" element={<MyEvents />} />
        <Route path="/events/:id/manage" element={<ManageEvent />} />
      </Route>
    </Routes>
  );
}

export default App;
