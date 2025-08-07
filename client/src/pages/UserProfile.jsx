import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar.jsx";
import axios from "axios";
import Button from "../components/Button.jsx"

function UserProfile() {
  const [firstname, setFirstName] = useState("");
  const [lastname, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [profilePhoto, setProfilePhoto] = useState("");
  const [previewPhoto, setPreviewPhoto] = useState(null);
  const [profilePhotoFile, setProfilePhotoFile] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    async function getDetails() {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}/api/auth/user-profile`,
          { token }
        );

        if (!response.data) return;

        setProfilePhoto(response.data.profilephoto);
        setEmail(response.data.email);
        setFirstName(response.data.firstname);
        setLastName(response.data.lastname);
      } catch (err) {
        console.log(err);
      }
    }
    getDetails();
  }, []);

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file && (file.type === "image/jpeg" || file.type === "image/png")) {
      setPreviewPhoto(URL.createObjectURL(file));
      setProfilePhotoFile(file);
    } else {
      alert("Only JPEG or PNG images are allowed.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();

      formData.append("firstname", firstname);
      formData.append("lastname", lastname);
      formData.append("email", email);
      formData.append("token", token);
      if (profilePhotoFile) {
        formData.append("profilePhoto", profilePhotoFile);
      }

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/user-profile-update`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200) {
        alert("Profile updated successfully");
      }
    } catch (error) {
      console.error("Profile update failed:", error);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/delete-account`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        localStorage.removeItem("token");
        localStorage.removeItem("registered");
        alert("Your account has been deleted successfully.");
        window.location.href = "/signup";
      } else {
        alert("Failed to delete account.");
      }
    } catch (error) {
      console.error("Error deleting account:", error);
      alert("An error occurred.");
    }
  };

  return (
    <div className="bg-gradient-to-br from-blue-100 via-indigo-100 to-pink-100 min-h-screen px-4 py-16 flex justify-center items-start relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-48 -right-48 w-[30rem] h-[30rem] bg-gradient-to-br from-purple-300 to-blue-200 rounded-full opacity-25 blur-[140px]" />
        <div className="absolute -bottom-40 -left-40 w-[28rem] h-[28rem] bg-gradient-to-tr from-pink-300 to-yellow-200 rounded-full opacity-25 blur-[120px]" />
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-br from-indigo-200 to-cyan-200 rounded-full opacity-15 blur-[100px]" />
        <div className="absolute bottom-1/3 right-1/4 w-60 h-60 bg-gradient-to-br from-teal-200 to-blue-200 rounded-full opacity-10 blur-[90px]" />
      </div>

      <form
        onSubmit={handleSubmit}
        encType="multipart/form-data"
        className="bg-gradient-to-br from-blue-200/50 via-purple-100/40 to-pink-200/50 backdrop-blur-xl p-10 md:p-16 shadow-xl border border-white/20 rounded-3xl w-full max-w-5xl z-10"
      >
        <h2 className="text-3xl font-bold text-center text-purple-700 mb-10">Update Profile</h2>
        <div className="flex flex-col md:flex-row gap-8 items-center">
          {/* Upload photo */}
          <label htmlFor="profileUpload" className="relative cursor-pointer group">
            <div className="w-32 h-32 rounded-full bg-blue-300 text-white text-sm flex items-center justify-center overflow-hidden border-4 border-white shadow-lg group-hover:opacity-80 transition-all">
              {previewPhoto || profilePhoto ? (
                <img
                  src={previewPhoto || profilePhoto}
                  alt="Profile Preview"
                  className="object-cover w-full h-full"
                />
              ) : (
                <span className="text-xs text-center px-2">Upload Photo</span>
              )}
            </div>
            <input
              type="file"
              id="profileUpload"
              accept="image/jpeg, image/png"
              onChange={handlePhotoChange}
              className="hidden"
            />
          </label>

          {/* Info inputs */}
          <div className="flex flex-col gap-4 w-full">
            <div className="flex flex-col sm:flex-row gap-4 w-full">
              <input
                type="text"
                placeholder="First Name"
                className="rounded-xl text-black text-center w-full py-2 px-4 shadow-md bg-white/80"
                value={firstname}
                onChange={(e) => setFirstName(e.target.value)}
              />
              <input
                type="text"
                placeholder="Last Name"
                className="rounded-xl text-black text-center w-full py-2 px-4 shadow-md bg-white/80"
                value={lastname}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>
            <input
              type="email"
              placeholder="Email"
              className="rounded-xl text-black text-center py-2 px-4 shadow-md bg-white/80 w-full"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>

        {/* Confirm button */}
<div className="mt-10 flex justify-center">
  <button
    type="submit"
    className="px-10 py-4 text-lg bg-purple-600 hover:bg-purple-700 text-white rounded-xl shadow-lg transition-all duration-300"
  >
     Confirm Changes
  </button>
</div>

{/* Divider */}
<div className="my-10 border-t-2 border-dashed border-purple-300" />

{/* Delete Account Section */}
<div className="mt-4 p-6 bg-red-100/60 border border-red-400 rounded-xl shadow-inner max-w-2xl mx-auto">
  <h3 className="text-lg font-semibold text-red-700 mb-2 flex items-center gap-2">
    <svg
      className="w-5 h-5 text-red-700"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M20 12H4m16 0l-4 4m4-4l-4-4"
      />
    </svg>
    Delete Account
  </h3>
  <p className="text-sm text-red-700 mb-4">
    This action is <strong>irreversible</strong>. Once deleted, your data cannot be recovered.
  </p>
  <div className="flex justify-center">
    <Button setShowDeleteModal={setShowDeleteModal}/>
  </div>
</div>

      </form>

      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-lg font-bold text-red-600 mb-4">Delete Account</h2>
            <p className="text-sm text-gray-700 dark:text-gray-300 mb-6">
              Are you sure you want to delete your account? This action is irreversible.
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 rounded border text-gray-700 dark:text-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserProfile;

