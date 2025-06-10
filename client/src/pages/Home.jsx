import React, { useState } from 'react';
import axios from 'axios';
import ProfileForm from '../components/ProfileForm';
import PlanDisplay from '../components/PlanDisplay';
import { toast } from 'sonner';

export default function Home() {
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerate = async (data) => {
    setLoading(true);
    setError('');
    setPlan(null);
    
    try {
      const response = await axios.post(
        'https://fitmate-workout-planner.onrender.com/generate-plan', 
        data
      );
      setPlan(response.data);
      toast.success("Workout plan generated successfully!");
    } catch (err) {

      try {
        const retryResponse = await axios.post(
          'https://fitmate-workout-planner.onrender.com/generate-plan', 
          data
        );
        setPlan(retryResponse.data);
        toast.success("Workout plan generated successfully!");
      } catch (retryErr) {
        // Both attempts failed
        const message = retryErr.response?.data?.detail || retryErr.message;
        setError(message);
        toast.error(`Error: ${message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <header className="bg-green-600 text-white py-4 shadow-md">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl font-bold">FitMate</h1>
          <p className="text-sm opacity-80">Grok AI-Powered Personalized Workout Plans</p>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-6 flex-grow">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Create Your Profile</h2>
            <ProfileForm onSubmit={handleGenerate} />
          </div>
          
          {loading && (
            <div className="flex flex-col items-center py-8">
              <div className="w-12 h-12 border-4 border-green-600 border-dashed rounded-full animate-spin mb-4" />
              <p className="text-gray-600">Generating your personalized workout plan...</p>
            </div>
          )}
          
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded">
              <p className="text-red-700 font-medium">Error</p>
              <p className="text-red-600">{error}</p>
            </div>
          )}
          
          {plan && <PlanDisplay plan={plan} />}
        </div>
      </main>
      
      <footer className="bg-gray-200 text-center py-4 mt-auto">
        <p className="text-sm text-gray-600">&copy; {new Date().getFullYear()} FitMate - AI Fitness Assistant</p>
      </footer>
    </div>
  );
}