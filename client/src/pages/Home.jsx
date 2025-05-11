import React, { useState } from 'react';
import axios from 'axios';
import ProfileForm from '../components/ProfileForm';
import PlanDisplay from '../components/PlanDisplay';
import { toast } from 'sonner';

export default function Home() {
  const [plan, setPlan] = useState(null);
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerate = async (data) => {
    setLoading(true);
    setError('');
    try {
      setProfileData(data);
      const response = await axios.post('https://fitmate-workout-planner.onrender.com/generate', data);
      setPlan(response.data.plan);
      toast.success("Workout plan generated successfully!");
    } catch (err) {
      setError(err.response?.data?.detail || err.message);
      toast.error(`Error: ${err.response?.data?.detail || err.message}`);

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <header className="bg-green-600 text-white py-4 shadow-md">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl font-bold">FitMate</h1>
        </div>
      </header>
      <main className="container mx-auto px-4 py-6 flex-grow">
        <ProfileForm onSubmit={handleGenerate} />

        {loading && (
          <div className="flex justify-center mt-4">
            <div className="w-8 h-8 border-4 border-green-600 border-dashed rounded-full animate-spin" />
          </div>
        )}

        {error && <p className="mt-4 text-red-500">{error}</p>}

        {plan && (
          <PlanDisplay
            sessions={plan}
            profileData={profileData}
          />
        )}
      </main>
      <footer className="bg-gray-200 text-center py-4 mt-auto">
        <p className="text-sm">&copy; {new Date().getFullYear()} FitMate</p>
      </footer>
    </div>
  );
}
