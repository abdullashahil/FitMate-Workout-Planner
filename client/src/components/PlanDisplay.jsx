import React from 'react';
import axios from 'axios';
import { toast } from 'sonner';

export default function PlanDisplay({ sessions, profileData }) {
    if (!sessions || sessions.length === 0) {
        return <p className="mt-4 text-gray-500">No sessions to display.</p>;
    }

    const downloadPDF = async () => {
        try {
            const res = await axios.post(
                'https://fitmate-workout-planner.onrender.com/export',
                { plan: sessions, filename: profileData.name, fmt: 'pdf' },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/pdf'
                    },
                    responseType: 'blob'
                }
            );
            
            toast.success("PDF generated successfully!");
            const url = window.URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }));
            window.open(url, '_blank');

        } catch (err) {
            console.error('PDF download error:', err);
            toast.error('Error downloading PDF! Please try again later.');
        }
    };

    return (
        <div className="mt-6 space-y-6 max-w-3xl mx-auto">
            <div className="flex justify-end mb-4">
                <button
                    onClick={downloadPDF}
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg cursor-pointer hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                >
                    Download PDF
                </button>
            </div>
    
            {sessions.map((s) => (
                <div key={s.session} className="bg-white p-6 rounded-lg shadow-lg space-y-4">
                    <h2 className="font-bold text-lg">
                        Session {s.session} - {s.date}
                    </h2>
    
                    {Object.entries(s.sections)
                        .filter(([_, exercises]) => Array.isArray(exercises) && exercises.length > 0)
                        .map(([section, exercises]) => (
                            <div key={section} className="mt-4">
                                <h3 className="font-semibold capitalize text-lg">{section}</h3>
                                <ul className="list-disc list-inside">
                                    {exercises.map((ex, i) => (
                                        <li key={i} className="text-gray-700">
                                            {ex.name}
                                            {ex.sets !== null && ex.reps !== null ? `: ${ex.sets}x${ex.reps}` : ''}
                                            {ex.duration ? ` (${ex.duration})` : ''}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                </div>
            ))}
        </div>
    );
    
}
