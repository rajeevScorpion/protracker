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
    await createActivity(
      {
        ...formData,
        images: [] // This will be replaced with uploaded image URLs
      },
      imageFiles
    );
  };

  return (
    <div className="max-w-md mx-auto p-4">
      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="title"
          placeholder="Enter a new Activity"
          value={formData.title}
          onChange={handleChange}
          className="w-full p-3 bg-gray-100 rounded-md"
        />

        <CategorySelect
          value={formData.category}
          onChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
        />

        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          className="w-full p-3 bg-gray-100 rounded-md"
        />

        <div className="grid grid-cols-2 gap-4">
          <input
            type="time"
            name="startTime"
            value={formData.startTime}
            onChange={handleChange}
            className="w-full p-3 bg-gray-100 rounded-md"
          />
          <input
            type="time"
            name="endTime"
            value={formData.endTime}
            onChange={handleChange}
            className="w-full p-3 bg-gray-100 rounded-md"
          />
        </div>

        <textarea
          name="details"
          value={formData.details}
          onChange={handleChange}
          placeholder="Details"
          rows={4}
          className="w-full p-3 bg-gray-100 rounded-md resize-none"
        />

        <ImageUpload
          images={previewUrls}
          onImageAdd={handleImageAdd}
          onImageRemove={handleImageRemove}
        />

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:bg-blue-400"
        >
          {isLoading ? 'Submitting...' : 'Submit'}
        </button>
      </form>
    </div>
  );
};

export default NewActivity;
