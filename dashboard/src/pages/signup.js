import React, { useState } from "react";

const SignupPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    gender: "",
    department: "",
    experience: "",
    username: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    console.log("Submitted:", formData);
    // You can send formData to backend here
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-6 text-primary">Signup</h2>

        {/* Name */}
        <div className="mb-4">
          <label className="block text-sm mb-1">Name</label>
          <input
            type="text"
            name="name"
            required
            value={formData.name}
            onChange={handleChange}
            className="w-full border border-border rounded px-3 py-2"
          />
        </div>

        {/* Age */}
        <div className="mb-4">
          <label className="block text-sm mb-1">Age</label>
          <input
            type="number"
            name="age"
            required
            value={formData.age}
            onChange={handleChange}
            className="w-full border border-border rounded px-3 py-2"
          />
        </div>

        {/* Gender */}
        <div className="mb-4">
          <label className="block text-sm mb-1">Gender</label>
          <select
            name="gender"
            required
            value={formData.gender}
            onChange={handleChange}
            className="w-full border border-border rounded px-3 py-2"
          >
            <option value="">Select Gender</option>
            <option>Male</option>
            <option>Female</option>
            <option>Other</option>
          </select>
        </div>

        {/* Department */}
        <div className="mb-4">
          <label className="block text-sm mb-1">Department Name</label>
          <input
            type="text"
            name="department"
            required
            value={formData.department}
            onChange={handleChange}
            className="w-full border border-border rounded px-3 py-2"
          />
        </div>

        {/* Experience */}
        <div className="mb-4">
          <label className="block text-sm mb-1">Experience (Years)</label>
          <input
            type="number"
            name="experience"
            required
            value={formData.experience}
            onChange={handleChange}
            className="w-full border border-border rounded px-3 py-2"
          />
        </div>

        {/* Username */}
        <div className="mb-4">
          <label className="block text-sm mb-1">Username</label>
          <input
            type="text"
            name="username"
            required
            value={formData.username}
            onChange={handleChange}
            className="w-full border border-border rounded px-3 py-2"
          />
        </div>

        {/* Password */}
        <div className="mb-4">
          <label className="block text-sm mb-1">Password</label>
          <input
            type="password"
            name="password"
            required
            value={formData.password}
            onChange={handleChange}
            className="w-full border border-border rounded px-3 py-2"
          />
        </div>

        {/* Confirm Password */}
        <div className="mb-6">
          <label className="block text-sm mb-1">Confirm Password</label>
          <input
            type="password"
            name="confirmPassword"
            required
            value={formData.confirmPassword}
            onChange={handleChange}
            className="w-full border border-border rounded px-3 py-2"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-primary hover:bg-primary-light text-white font-semibold py-2 px-4 rounded"
        >
          Register
        </button>
      </form>
    </div>
  );
};

export default SignupPage;
