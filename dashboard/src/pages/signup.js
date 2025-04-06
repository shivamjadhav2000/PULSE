import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { signup } from "../api/api";

const SignupPage = () => {
  const formik = useFormik({
    initialValues: {
      name: "",
      age: "",
      gender: "",
      departmentName: "",
      experience: "",
      userName: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Required"),
      age: Yup.number().required("Required").min(1, "Invalid age"),
      gender: Yup.string().required("Required"),
      departmentName: Yup.string().required("Required"),
      experience: Yup.number().required("Required").min(0, "Invalid experience"),
      userName: Yup.string().required("Required"),
      password: Yup.string().required("Required").min(6, "Min 6 characters"),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref("password"), null], "Passwords must match")
        .required("Required"),
    }),
    onSubmit: async (values) => {
      console.log("Submitted:", values);
      // You can call signup API here:
      const res=await signup(values);
      console.log("Response:", res);
      if (res.status===200){
        alert(res.message || "Signup successful")
        window.location.href = "/login";
        //reset form
        formik.resetForm();
      }
      else{
        // 
        alert(res.message || "Signup failed")
      }
      
      // redirect to login page or show success message
      // For example, you can use react-router to navigate to the login page:
    },
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <form
        onSubmit={formik.handleSubmit}
        className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-6 text-primary">Signup</h2>

        {/* Name */}
        <InputField label="Name" name="name" formik={formik} />

        {/* Age */}
        <InputField label="Age" name="age" type="number" formik={formik} />

        {/* Gender */}
        <div className="mb-4">
          <label className="block text-sm mb-1">Gender</label>
          <select
            name="gender"
            value={formik.values.gender}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="w-full border border-border rounded px-3 py-2"
          >
            <option value="">Select Gender</option>
            <option value={'male'}>Male</option>
            <option value={'female'}>Female</option>
            <option value={'other'}>Other</option>
          </select>
          {formik.touched.gender && formik.errors.gender && (
            <div className="text-red-500 text-sm mt-1">{formik.errors.gender}</div>
          )}
        </div>

        {/* DepartmentName */}
        <InputField label="Department Name" name="departmentName" formik={formik} />

        {/* Experience */}
        <InputField label="Experience (Years)" name="experience" type="number" formik={formik} />

        {/* Username */}
        <InputField label="Username" name="userName" formik={formik} />

        {/* Password */}
        <InputField label="Password" name="password" type="password" formik={formik} />

        {/* Confirm Password */}
        <InputField label="Confirm Password" name="confirmPassword" type="password" formik={formik} />

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

const InputField = ({ label, name, type = "text", formik }) => (
  <div className="mb-4">
    <label className="block text-sm mb-1">{label}</label>
    <input
      type={type}
      name={name}
      value={formik.values[name]}
      onChange={formik.handleChange}
      onBlur={formik.handleBlur}
      className="w-full border border-border rounded px-3 py-2"
    />
    {formik.touched[name] && formik.errors[name] && (
      <div className="text-red-500 text-sm mt-1">{formik.errors[name]}</div>
    )}
  </div>
);

export default SignupPage;
