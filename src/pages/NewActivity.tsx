import React, { useState } from 'react';
import ImageUpload from '../components/forms/ImageUpload';
import CategorySelect from '../components/forms/CategorySelect';
import { useCreateActivity } from '../hooks/useCreateActivity';

const NewActivity = () => {
  const { createActivity, isLoading, error } = useCreateActivity();
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    date: '',
    startTime: '',
    endTime: '',
    details: ''
  });
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageAdd = (file: File) => {
    const previewUrl = URL.createObjectURL(file);
    setImageFiles(prev => [...prev, file]);
    setPreviewUrls(prev => [...prev, previewUrl]);
  };

  const handleImageRemove = (index: number) => {
    setImageFiles(prev => prev.filter((_, i) => i !== index));
    setPreviewUrls(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createActivity(formData, imageFiles);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">New Activity</h1>
        <p className="text-gray-600">Add details about your activity</p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <input
          type="text"
          name="title"
          placeholder="Enter a new Activity"
          value={formData.title}
          onChange={handleChange}
          className="w-full p-3 bg-white rounded-lg border border-gray-200 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
        />

        <CategorySelect
          type="activity"
          value={formData.category}
          onChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
        />

        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          className="w-full p-3 bg-white rounded-lg border border-gray-200 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
        />

        <div className="grid grid-cols-2 gap-4">
          <input
            type="time"
            name="startTime"
            value={formData.startTime}
            onChange={handleChange}
            className="w-full p-3 bg-white rounded-lg border border-gray-200 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
          />
          <input
            type="time"
            name="endTime"
            value={formData.endTime}
            onChange={handleChange}
            className="w-full p-3 bg-white rounded-lg border border-gray-200 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
          />
        </div>

        <textarea
          name="details"
          value={formData.details}
          onChange={handleChange}
          placeholder="Details"
          rows={4}
          className="w-full p-3 bg-white rounded-lg border border-gray-200 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow resize-none"
        />

        <ImageUpload
          images={previewUrls}
          onImageAdd={handleImageAdd}
          onImageRemove={handleImageRemove}
        />

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-400 shadow-sm hover:shadow-md transition-shadow"
        >
          {isLoading ? 'Submitting...' : 'Submit'}
        </button>
      </form>
    </div>
  );
};

export default NewActivity;
