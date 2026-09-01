import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router";

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const userData = {
      name: formData.get("name"),
      last_name: formData.get("lastName"),
      email: formData.get("email"),
      password: formData.get("password"),
    };

    try {
      await register(userData);
      navigate("/");
    } catch (error) {
      console.error("Registration failed:", error);
    }
  };

  return (
    <div className="form-section">
      <h3>Register for an account</h3>
      <form onSubmit={handleSubmit}>
        <label>
          Name:
          <input type="text" name="name" required />
        </label>
        <label>
          Last Name:
          <input type="text" name="lastName" required />
        </label>
        <label>
          Email:
          <input type="text" name="email" required />
        </label>
        <label>
          Password:
          <input type="password" name="password" required />
        </label>
        <button type="submit">Submit</button>
      </form>
      <p>
        Already have an account? <Link to="/login">Log in here.</Link>
      </p>
    </div>
  );
};

export default Register;
