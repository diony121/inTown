import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

import { Link, useNavigate } from "react-router";
import { getMe } from "../api/auth";

export default function Profile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState();
  const [error, setError] = useState(null);

  if (!user) {
    return <p>You are not signed in.</p>;
  }
  if (error) {
    return <p>{error}</p>;
  }
  return (
    <div id="profile">
      <h1>
        {" "}
        Welcome, {user.name} {user.last_name}
      </h1>
      <p>Your email on file with us is {user.email}</p>
      <p>Your user id is {user.id}</p>
      <p>
        Click <Link to={"/orders/"}>here</Link> to go to your orders.
      </p>
    </div>
  );
}
