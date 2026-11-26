import { useState } from "react";

import { useAuth } from "../context/AuthContext";

import {
  updateProfile,
  changePassword,
  deleteAccount,
} from "../services/settingsService";

import { User, Lock, Shield, Trash2 } from "lucide-react";

import "./Settings.css";

const Settings = () => {
  const { user, updateUser, logout } = useAuth();

  const [profile, setProfile] = useState({
    name: user?.name || "",
    email: user?.email || "",
  });

  const [password, setPassword] = useState({
    current_password: "",
    new_password: "",
  });

  const [profileMessage, setProfileMessage] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");
  const [error, setError] = useState("");

  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  const handleProfile = async (e) => {
    e.preventDefault();

    setSavingProfile(true);
    setProfileMessage("");
    setError("");

    try {
      const updated = await updateProfile(profile);

      updateUser(updated);

      setProfileMessage("Profile updated successfully.");
    } catch (err) {
      setError(err.response?.data?.detail || "Unable to update profile.");
    } finally {
      setSavingProfile(false);
    }
  };

  const handlePassword = async (e) => {
    e.preventDefault();

    setSavingPassword(true);
    setPasswordMessage("");
    setError("");

    try {
      await changePassword(password);

      setPassword({
        current_password: "",
        new_password: "",
      });

      setPasswordMessage("Password changed successfully.");
    } catch (err) {
      setError(err.response?.data?.detail || "Unable to change password.");
    } finally {
      setSavingPassword(false);
    }
  };

  const handleDelete = async () => {
    const confirmed = window.confirm(
      "Are you absolutely sure? This permanently deletes your account, categories and transactions.",
    );

    if (!confirmed) return;

    try {
      await deleteAccount();
      logout();
      window.location.href = "/";
    } catch (err) {
      setError(err.response?.data?.detail || "Unable to delete account.");
    }
  };

  return (
    <div className="settings-page">
      <div className="settings-header">
        <h1>Settings</h1>
        <p>Manage your account and security.</p>
      </div>

      {error && <div className="settings-error">{error}</div>}

      <section className="settings-panel">
        <div className="settings-section-heading">
          <User size={21} />
          <div>
            <h3>Profile Information</h3>
            <p>Update your personal details.</p>
          </div>
        </div>

        <form onSubmit={handleProfile}>
          <label>Full Name</label>

          <input
            type="text"
            value={profile.name}
            onChange={(e) => setProfile({ ...profile, name: e.target.value })}
            required
          />

          <label>Email Address</label>

          <input
            type="email"
            value={profile.email}
            onChange={(e) => setProfile({ ...profile, email: e.target.value })}
            required
          />

          <button disabled={savingProfile}>
            {savingProfile ? "Saving..." : "Save Changes"}
          </button>

          {profileMessage && (
            <p className="settings-success">{profileMessage}</p>
          )}
        </form>
      </section>

      <section className="settings-panel">
        <div className="settings-section-heading">
          <Lock size={21} />
          <div>
            <h3>Change Password</h3>
            <p>Keep your account secure.</p>
          </div>
        </div>

        <form onSubmit={handlePassword}>
          <label>Current Password</label>

          <input
            type="password"
            value={password.current_password}
            onChange={(e) =>
              setPassword({
                ...password,
                current_password: e.target.value,
              })
            }
            required
          />

          <label>New Password</label>

          <input
            type="password"
            minLength={8}
            value={password.new_password}
            onChange={(e) =>
              setPassword({
                ...password,
                new_password: e.target.value,
              })
            }
            required
          />

          <button disabled={savingPassword}>
            {savingPassword ? "Updating..." : "Change Password"}
          </button>

          {passwordMessage && (
            <p className="settings-success">{passwordMessage}</p>
          )}
        </form>
      </section>

      <section className="settings-panel">
        <div className="settings-section-heading">
          <Shield size={21} />
          <div>
            <h3>Account Information</h3>
            <p>Your ExpenseFlow account details.</p>
          </div>
        </div>

        <div className="account-information">
          <p>
            Account ID: <strong>{user?.id}</strong>
          </p>
          <p>
            Account Name: <strong>{user?.name}</strong>
          </p>
          <p>
            Email: <strong>{user?.email}</strong>
          </p>
        </div>
      </section>

      <section className="settings-panel danger-panel">
        <div className="settings-section-heading">
          <Trash2 size={21} />
          <div>
            <h3>Delete Account</h3>
            <p>Permanently delete your ExpenseFlow account and data.</p>
          </div>
        </div>

        <button className="delete-account-button" onClick={handleDelete}>
          Delete My Account
        </button>
      </section>
    </div>
  );
};

export default Settings;
