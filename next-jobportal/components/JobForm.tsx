'use client';

import { useState } from 'react';
import { createJobSchema, getZodErrors } from '@/lib/validations';

interface JobFormProps {
  onJobCreated: () => void;
}

export default function JobForm({ onJobCreated }: JobFormProps) {
  const [formData, setFormData] = useState({
    title: '',
    location: '',
    salaryMin: '',
    salaryMax: '',
    type: 'ONSITE' as 'ONSITE' | 'REMOTE' | 'HYBRID',
    description: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setFieldErrors({});

    try {
      const submitData = {
        title: formData.title,
        location: formData.location,
        salaryRange: `${formData.salaryMin}-${formData.salaryMax} LPA`,
        type: formData.type,
        description: formData.description,
      };

      const validation = createJobSchema.safeParse(submitData);
      if (!validation.success) {
        setFieldErrors(getZodErrors(validation.error));
        setLoading(false);
        return;
      }

      const res = await fetch('http://localhost:3002/jobs', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(submitData),
      });

      if (!res.ok) throw new Error('Failed to create job');

      setFormData({ title: '', location: '', salaryMin: '', salaryMax: '', type: 'ONSITE', description: '' });
      onJobCreated();
    } catch (err) {
      setError('Failed to create job. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="bg-white dark:bg-linear-to-b rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Post a New Job</h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 rounded">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Job Title
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-linear-to-t-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
            placeholder="e.g. Senior Developer"
          />
          {fieldErrors.title && <p className="mt-1 text-sm text-red-400">{fieldErrors.title}</p>}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Location
          </label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-linear-to-t-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
            placeholder="e.g. New York, NY or Remote"
          />
          {fieldErrors.location && <p className="mt-1 text-sm text-red-400">{fieldErrors.location}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Min Salary (LPA)
          </label>
          <input
            type="number"
            name="salaryMin"
            value={formData.salaryMin}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-linear-to-t-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
            placeholder="e.g. 15"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Max Salary (LPA)
          </label>
          <input
            type="number"
            name="salaryMax"
            value={formData.salaryMax}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-linear-to-t-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
            placeholder="e.g. 25"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Job Type
          </label>
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
          >
            <option value="ONSITE">Onsite</option>
            <option value="REMOTE">Remote</option>
            <option value="HYBRID">Hybrid</option>
          </select>
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Description
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-linear-to-t-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
          placeholder="Describe the job responsibilities and requirements..."
        />
        {fieldErrors.description && <p className="mt-1 text-sm text-red-400">{fieldErrors.description}</p>}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-2 px-4 rounded-md transition-colors"
      >
        {loading ? 'Creating...' : 'Post Job'}
      </button>
    </form>
  );
}
