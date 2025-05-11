import React from 'react';
import axios from 'axios';

export default function PlanDisplay({ sessions, profileData }) {
    if (!sessions || sessions.length === 0) {
        return <p className="mt-4 text-gray-500">No sessions to display.</p>;
    }

    const downloadPDF = async () => {
        try {
            const res = await axios.post(
                'http://127.0.0.1:8000/export',
                { plan: sessions, filename: profileData.name, fmt: 'pdf' },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/pdf'
                    },
                    responseType: 'blob'
                }
            );
            console.log(res)
            const url = window.URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }));
            window.open(url, '_blank');

        } catch (err) {
            console.error('PDF download error:', err);
        }
    };

    return (
        <div className="mt-6 space-y-6">
            <div className="flex justify-end mb-4">
                <button
                    onClick={downloadPDF}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                    Download PDF
                </button>
            </div>

            {sessions.map((s) => (
                <div key={s.session} className="bg-white p-4 rounded shadow">
                    <h2 className="font-bold text-lg">
                        Session {s.session} - {s.date}
                    </h2>

                    {Object.entries(s.sections)
                        .filter(([_, exercises]) => Array.isArray(exercises) && exercises.length > 0)
                        .map(([section, exercises]) => (
                            <div key={section} className="mt-2">
                                <h3 className="font-semibold capitalize">{section}</h3>
                                <ul className="list-disc list-inside">
                                    {exercises.map((ex, i) => (
                                        <li key={i}>
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
