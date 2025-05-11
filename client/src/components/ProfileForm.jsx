import React, { useState } from 'react';

const initial = {
    name: '', age: '', gender: 'male', goal: 'muscle_gain', experience: 'beginner', equipment: [], days_per_week: '3', custom_section_type: ''
};

export default function ProfileForm({ onSubmit }) {
    const [form, setForm] = useState(initial);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        if (name === 'equipment') {
            setForm(f => {
                const copy = { ...f };
                if (checked) copy.equipment.push(value);
                else copy.equipment = copy.equipment.filter(e => e !== value);
                return copy;
            });
        } else {
            setForm(f => ({ ...f, [name]: value }));
        }
    };

    const submit = (e) => {
        e.preventDefault();
        const payload = {
            ...form,
            age: Number(form.age),
            days_per_week: Number(form.days_per_week),
            equipment: form.equipment.length ? form.equipment : ['none'],
            custom_section_type: form.custom_section_type || null
        };
        onSubmit(payload);
    };

    return (
        <form onSubmit={submit} className="bg-white p-6 rounded-lg shadow-lg space-y-6 max-w-3xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <input name="name" onChange={handleChange} value={form.name}
                    placeholder="Name" required
                    className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition" />
                <input name="age" onChange={handleChange} value={form.age} type="number"
                    placeholder="Age" required
                    className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <select name="gender" onChange={handleChange} value={form.gender}
                    className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition">
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                </select>
                <select name="goal" onChange={handleChange} value={form.goal}
                    className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition">
                    <option value="muscle_gain">Muscle Gain</option>
                    <option value="weight_loss">Weight Loss</option>
                    <option value="endurance">Endurance</option>
                </select>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <select name="experience" onChange={handleChange} value={form.experience}
                    className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition">
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                </select>
                <input name="days_per_week" type="number" onChange={handleChange}
                    value={form.days_per_week} min="1" max="7"
                    className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition" placeholder="Days/Week" />
            </div>
            <fieldset className="space-y-4">
                <legend className="font-semibold text-lg">Equipment (choose all that apply)</legend>
                {['bodyweight', 'dumbbell', 'resistance_band', 'none'].map(eq => (
                    <label key={eq} className="inline-flex items-center text-gray-700">
                        <input type="checkbox" name="equipment" value={eq}
                            onChange={handleChange} className="mr-1 w-4 h-4 text-blue-600 focus:ring-blue-500" />
                        <span className="capitalize mr-4">{eq.replace('_', ' ')}</span>
                    </label>
                ))}
            </fieldset>
            <div className='flex flex-col md:flex-row gap-4'>
                <select name="custom_section_type" onChange={handleChange}
                    value={form.custom_section_type} className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition">
                    <option value="">No Custom Section</option>
                    <option value="circuit">Circuit</option>
                    <option value="superset">Superset</option>
                </select>
                <button type="submit" className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition cursor-pointer">
                    Generate Plan
                </button>
            </div>
        </form>

    );
}