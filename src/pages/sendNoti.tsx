import { Button } from "@mui/material";
import { styled } from "@mui/system";
import React, { useState } from "react";
import { notificationOperations } from "../api";

const Container = styled("div")(({ theme }) => ({
  padding: theme.spacing(4),
}));

const Section = styled("div")(({ theme }) => ({
  marginTop: theme.spacing(3),
}));

const StyledButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(3),
}));

const SendNoti: React.FC = () => {
  const [notificationType, setNotificationType] = useState<
    "all" | "one" | "list"
  >("all");
  const [notificationTitle, setNotificationTitle] = useState("");
  const [notificationBody, setNotificationBody] = useState("");
  const [singleUser, setSingleUser] = useState("");

  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [newUser, setNewUser] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSendNotification = async () => {
    setIsLoading(true);
    setError(null);
    setSuccess(null);
    try {
      switch (notificationType) {
        case "all":
          await notificationOperations.sendToAllUsers(
            notificationTitle,
            notificationBody
          );
          setSuccess("Notification successfully sent to all users!");
          break;
        case "one":
          await notificationOperations.sendToSingleUser(
            singleUser,
            notificationTitle,
            notificationBody
          );
          setSuccess(`Notification successfully sent to user: ${singleUser}`);
          break;
        case "list":
          await notificationOperations.sendToUserList(
            selectedUsers,
            notificationTitle,
            notificationBody
          );
          setSuccess(
            `Notification successfully sent to ${selectedUsers.length} users!`
          );
          break;
      }
      // Reset form
      setNotificationTitle("");
      setNotificationBody("");
      setSingleUser("");
      setSelectedUsers([]);
      setNotificationType("all");
    } catch (err) {
      setError("Failed to send notification. Please try again.");
      console.error("Error sending notification:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddUser = () => {
    if (newUser && !selectedUsers.includes(newUser)) {
      setSelectedUsers([...selectedUsers, newUser]);
      setNewUser("");
    }
  };

  return (
    <div className="max-w-6xl mx-auto my-4 sm:my-12 p-4 sm:p-8 rounded-3xl relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl" />

      <div className="relative">
        <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-8 text-center bg-gradient-to-r from-violet-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
          Send Notification
        </h2>

        <div className="space-y-4 sm:space-y-6">
          <div className="space-y-2">
            <label className="block text-gray-200 font-medium">
              Notification Type
            </label>
            <select
              value={notificationType}
              onChange={(e) =>
                setNotificationType(e.target.value as "all" | "one" | "list")
              }
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl 
                text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500/50 
                focus:border-transparent transition-all duration-300"
            >
              <option value="all">All Users</option>
              <option value="one">Single User</option>
              <option value="list">List of Users</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="block text-gray-200 font-medium">
              Notification Title
            </label>
            <input
              type="text"
              value={notificationTitle}
              onChange={(e) => setNotificationTitle(e.target.value)}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl 
                text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 
                focus:ring-purple-500/50 focus:border-transparent transition-all duration-300"
              placeholder="Enter notification title"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-gray-200 font-medium">
              Notification Body
            </label>
            <textarea
              rows={4}
              value={notificationBody}
              onChange={(e) => setNotificationBody(e.target.value)}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl 
                text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 
                focus:ring-purple-500/50 focus:border-transparent transition-all duration-300"
              placeholder="Enter notification message"
            />
          </div>

          {notificationType === "one" && (
            <div className="space-y-2">
              <label className="block text-gray-200 font-medium">
                Username
              </label>
              <input
                type="text"
                value={singleUser}
                onChange={(e) => setSingleUser(e.target.value)}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl 
                  text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 
                  focus:ring-purple-500/50 focus:border-transparent transition-all duration-300"
                placeholder="Enter username"
              />
            </div>
          )}

          {notificationType === "list" && (
            <div className="space-y-3 sm:space-y-4">
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
                <input
                  type="text"
                  value={newUser}
                  onChange={(e) => setNewUser(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleAddUser()}
                  className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-xl 
                    text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 
                    focus:ring-purple-500/50 focus:border-transparent transition-all duration-300"
                  placeholder="Add user"
                />
                <button
                  onClick={handleAddUser}
                  className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-gray-200 
                    hover:bg-white/10 transition-all duration-300"
                >
                  Add User
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                {selectedUsers.map((user) => (
                  <span
                    key={user}
                    className="px-3 py-1 bg-purple-500/20 border border-purple-500/30 rounded-lg 
                      text-purple-200 flex items-center gap-2"
                  >
                    {user}
                    <button
                      onClick={() =>
                        setSelectedUsers(
                          selectedUsers.filter((u) => u !== user)
                        )
                      }
                      className="hover:text-purple-400 transition-colors"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}

          {error && (
            <div className="p-4 rounded-xl bg-red-500/20 border border-red-500/30 text-red-200">
              {error}
            </div>
          )}

          {success && (
            <div className="p-4 rounded-xl bg-green-500/20 border border-green-500/30 text-green-200">
              {success}
            </div>
          )}

          <button
            onClick={handleSendNotification}
            disabled={
              isLoading ||
              notificationTitle.trim() === "" ||
              notificationBody.trim() === "" ||
              (notificationType === "one" && singleUser.trim() === "") ||
              (notificationType === "list" && selectedUsers.length === 0)
            }
            className="w-full py-4 px-6 bg-gradient-to-r from-violet-500 via-purple-500 to-pink-500 
              rounded-xl text-white font-medium shadow-lg hover:shadow-purple-500/25 
              transition-all duration-300 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Sending..." : "Send Notification"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SendNoti;
