import { createContext, useContext, useState , useEffect} from "react";
import { loginUser, registerUser, getMe } from "../api/auth";

const AuthContext = createContext();

function getUserFromToken(token) {
  const payload = JSON.parse(atob(token.split(".")[1]));

  return {
    id: payload.id,
    token,
  };
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const token = localStorage.getItem("token");

    if (token) {
      return getUserFromToken(token) ;
    }

    return null;
  });

    useEffect(() => {
    async function loadUser() {
      const token = localStorage.getItem("token");
      if (token && !user?.id) {
        try {
          const me = await getMe();
          setUser(me);
        } catch (error) {
          console.error("Failed to load user:", error);
          localStorage.removeItem("token");
          setUser(null);
        }
      }
    }
    loadUser();
  }, []);

  async function register(userData) {
    const token = await registerUser(userData);
    localStorage.setItem("token", token);
    const me2 = await getMe();
    setUser(me2);
  }

  async function login(userData) {
    const token = await loginUser(userData);
    localStorage.setItem("token", token);
    const me = await getMe();
    setUser(me);
  }

  const logout = async () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  const value = {
    login,
    register,
    logout,
    user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
