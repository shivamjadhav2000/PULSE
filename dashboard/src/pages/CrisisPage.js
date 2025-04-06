import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { createcrsis } from '../api/api';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { useNavigate } from 'react-router-dom';
import {noOfStaffRequired} from '../api/api'; // Adjust the import path as necessary
// Fix marker icon issue in Leaflet + Webpack
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const disasterOptions = [
  { label: 'Flood', value: 1 },
  { label: 'Tornado', value: 2 },
  { label: 'Hurricane', value: 3 },
  { label: 'Earthquake', value: 4 },
  { label: 'Wildfire', value: 5 },
  { label: 'Other', value: 6 }
];

const severityOptions = [
  { label: 'Advisory', value: 0 },
  { label: 'Severe', value: 1 },
  { label: 'Moderate', value: 2 },
  { label: 'Watch', value: 3 },
  { label: 'Minor', value: 4 }
];

const LocationSelector = ({ setFieldValue }) => {
  const [position, setPosition] = useState(null);

  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      setPosition({ lat, lng });
      setFieldValue('locationLat', lat);
      setFieldValue('locationLong', lng);
    },
  });

  return position ? <Marker position={position} /> : null;
};

const CreateCrisis = ({user}) => {
    const navigate = useNavigate();
    console.log("User in CreateCrisis:", user); // Log the user object to check its structure
  const initialValues = {
    crisisType: '',
    locationLat: '',
    locationLong: '',
    type: '',
    severityType: '',
    isActive: true,
    startedAt: ''
  };

  const validationSchema = Yup.object({
    crisisType: Yup.string().min(4).required('Required'),
    locationLat: Yup.number().required('Latitude is required'),
    locationLong: Yup.number().required('Longitude is required'),
    type: Yup.number().required('Disaster type is required'),
    severityType: Yup.number().required('Severity type is required'),
    startedAt: Yup.date().required('Start date is required'),
  });

  const handleSubmit = async (values, { resetForm }) => {
    const data = {
      crisisType: values.crisisType,
      location: {
        lat: values.locationLat,
        lng: values.locationLong
      },
      type: parseInt(values.type),
      severityType: parseInt(values.severityType),
      isActive: values.isActive,
      startedAt: values.startedAt
    };

    try {
      const res = await createcrsis(data,user.token);
      console.log("Response from createcrsis:", res); // Log the response to check its structure
      if (res.status !== 200) {
        throw new Error('Failed to create crisis');
      } 
      alert(res.message || 'Crisis created successfully');

      const aidata=await noOfStaffRequired({disaster_type_id:data.type, severity_type_id:data.severityType, location: data.location});
      console.log("No of staff required:",aidata);
      navigate('/dashboard'); // ✅ This should work now
      resetForm();
    } catch (err) {
      console.error('Error creating crisis:', err);
      console.error(err.response?.data || err.message);
    }
  };

  return (
    <div className="max-w-xl  mx-auto p-6 bg-white shadow-lg rounded-xl">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Create New Crisis</h2>
      <Formik
        initialValues={initialValues}
        onSubmit={handleSubmit}
        validationSchema={validationSchema}
      >
        {({ setFieldValue, values }) => (
          <Form className="space-y-4">
            <div>
              <label className="block text-sm font-medium">Crisis Type</label>
              <Field name="crisisType" className="w-full p-2 border rounded" />
              <ErrorMessage name="crisisType" className="text-red-500 text-sm" component="div" />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Pick Location (click map)</label>
              <MapContainer center={[32.7767, -96.7970]} zoom={5} style={{ height: '300px', width: '100%' }}>
                <TileLayer
                  attribution='&copy; OpenStreetMap contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <LocationSelector setFieldValue={setFieldValue} />
              </MapContainer>
              <div className="mt-2 text-sm text-gray-600">
                Selected: Lat: {values.locationLat || '-'} | Long: {values.locationLong || '-'}
              </div>
              <ErrorMessage name="locationLat" className="text-red-500 text-sm" component="div" />
              <ErrorMessage name="locationLong" className="text-red-500 text-sm" component="div" />
            </div>

            <div>
              <label className="block text-sm font-medium">Disaster Type</label>
              <Field as="select" name="type" className="w-full p-2 border rounded">
                <option value="">Select</option>
                {disasterOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </Field>
              <ErrorMessage name="type" className="text-red-500 text-sm" component="div" />
            </div>

            <div>
              <label className="block text-sm font-medium">Severity Type</label>
              <Field as="select" name="severityType" className="w-full p-2 border rounded">
                <option value="">Select</option>
                {severityOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </Field>
              <ErrorMessage name="severityType" className="text-red-500 text-sm" component="div" />
            </div>

            <div>
              <label className="block text-sm font-medium">Start Date</label>
              <Field name="startedAt" type="datetime-local" className="w-full p-2 border rounded" />
              <ErrorMessage name="startedAt" className="text-red-500 text-sm" component="div" />
            </div>

            <div className="flex items-center">
              <Field type="checkbox" name="isActive" className="mr-2" />
              <label className="text-sm font-medium">Is Active</label>
            </div>

            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded w-full"
            >
              Submit Crisis
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default CreateCrisis;
