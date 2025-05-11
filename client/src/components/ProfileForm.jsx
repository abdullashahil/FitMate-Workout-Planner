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
        <form onSubmit={submit} className="bg-white p-6 rounded-lg shadow-md space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input name="name" onChange={handleChange} value={form.name}
                    placeholder="Name" required
                    className="p-2 border rounded" />
                <input name="age" onChange={handleChange} value={form.age} type="number"
                    placeholder="Age" required
                    className="p-2 border rounded" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <select name="gender" onChange={handleChange} value={form.gender}
                    className="p-2 border rounded">
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                </select>
                <select name="goal" onChange={handleChange} value={form.goal}
                    className="p-2 border rounded">
                    <option value="muscle_gain">Muscle Gain</option>
                    <option value="weight_loss">Weight Loss</option>
                    <option value="endurance">Endurance</option>
                </select>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <select name="experience" onChange={handleChange} value={form.experience}
                    className="p-2 border rounded">
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                </select>
                <input name="days_per_week" type="number" onChange={handleChange}
                    value={form.days_per_week} min="1" max="7"
                    className="p-2 border rounded" placeholder="Days/Week" />
            </div>
            <fieldset className="space-y-2">
                <legend className="font-semibold">Equipment (choose all that apply)</legend>
                {['bodyweight', 'dumbbell', 'resistance_band', 'none'].map(eq => (
                    <label key={eq} className="inline-flex items-center mr-4">
                        <input type="checkbox" name="equipment" value={eq}
                            onChange={handleChange} className="mr-1" /> {eq.replace('_', ' ')}
                    </label>
                ))}
            </fieldset>
            <div className='flex flex-col md:flex-row gap-3'>
                <select name="custom_section_type" onChange={handleChange}
                    value={form.custom_section_type} className="p-2 border rounded">
                    <option value="">No Custom Section</option>
                    <option value="circuit">Circuit</option>
                    <option value="superset">Superset</option>
                </select>
                <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
                    Generate Plan
                </button>
            </div>
        </form>
    );
}