import { Search, Bell, UserCircle } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import "./Topbar.css";
const Topbar = () => {
  const { user } = useAuth();

  return (
    <header className="topbar">
      <div className="topbar-left">
        <div>
          <h2>Expense Manager</h2>
          <p>Manage your finances efficiently</p>
        </div>
      </div>

      <div className="topbar-right">
        <button className="notification-button">
          <Bell size={20} />
        </button>

        <div className="user-profile">
          <UserCircle size={34} />

          <div className="user-info">
            <span className="user-name">
              {user?.name || user?.username || user?.email || "User"}
            </span>
            <span className="user-role">Personal Account</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
