import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'sonner';

export default function PlanDisplay({ plan }) {
  const [downloading, setDownloading] = useState(false);
  
  if (!plan || !plan.plan || plan.plan.length === 0) {
    return (
      <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded mb-6">
        <p className="text-yellow-700">No sessions to display. Please generate a new plan.</p>
      </div>
    );
  }

  const downloadPDF = async () => {
    setDownloading(true);
    try {
      const res = await axios.post(
        'https://fitmate-workout-planner.onrender.com/download-plan', 
        plan,
        { responseType: 'blob' }
      );
  
      // PDF - open in new tab
      const blob = new Blob([res.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      window.open(url, '_blank');
  
      toast.success("PDF opened in new tab!");
    } catch (err) {
      console.error('PDF download error:', err);
      toast.error('Error opening PDF! Please try again later.');
    } finally {
      setDownloading(false);
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              {plan.user}'s Workout Plan
            </h2>
            <p className="text-gray-600">
              {plan.plan.length} sessions, generated on {new Date().toLocaleDateString()}
            </p>
          </div>
          
          <button
            onClick={downloadPDF}
            disabled={downloading}
            className={`flex items-center justify-center gap-2 px-6 py-3 rounded-lg ${
              downloading 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700 cursor-pointer'
            } text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition min-w-[180px]`}
          >
            {downloading ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Generating PDF...
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
                Download PDF
              </>
            )}
          </button>
        </div>
        
        <div className="grid grid-cols-1 gap-6">
          {plan.plan.map((session) => (
            <div key={session.session} className="border border-gray-200 rounded-lg overflow-hidden">
              <div className="bg-green-600 px-4 py-2">
                <h3 className="font-bold text-white">
                  Session {session.session} • {new Date(session.date).toLocaleDateString('en-US', {
                    weekday: 'long',
                    month: 'short',
                    day: 'numeric'
                  })}
                </h3>
              </div>
              
              <div className="p-4">
                {Object.entries(session.sections)
                  .filter(([sectionName, exercises]) => exercises && exercises.length > 0)
                  .map(([sectionName, exercises]) => (
                    <div key={sectionName} className="mb-4 last:mb-0">
                      <h4 className="font-semibold text-gray-700 uppercase text-sm tracking-wide mb-2">
                        {sectionName}
                      </h4>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {exercises.map((exercise, index) => (
                          <div key={index} className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                            <div className="flex justify-between items-start">
                              <span className="font-medium text-gray-800">{exercise.name}</span>
                              <div className="flex gap-2">
                                {exercise.sets && (
                                  <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                                    {exercise.sets} sets
                                  </span>
                                )}
                                {exercise.reps && (
                                  <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                                    {exercise.reps} reps
                                  </span>
                                )}
                              </div>
                            </div>
                            
                            <div className="flex flex-wrap gap-2 mt-2">
                              {exercise.tempo && (
                                <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">
                                  Tempo: {exercise.tempo}
                                </span>
                              )}
                              {exercise.rest && (
                                <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                                  Rest: {exercise.rest}
                                </span>
                              )}
                              {exercise.duration && (
                                <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">
                                  {exercise.duration}
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}