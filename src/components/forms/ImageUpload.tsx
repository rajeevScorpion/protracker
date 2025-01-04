import React from 'react';
import { X } from 'lucide-react';

interface ImageUploadProps {
  images: string[];
  onImageAdd: (file: File) => void;
  onImageRemove: (index: number) => void;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ images, onImageAdd, onImageRemove }) => {
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && images.length < 3) {
      onImageAdd(file);
    }
  };

  return (
    <div className="space-y-4">
      <button
        type="button"
        onClick={() => document.getElementById('image-upload')?.click()}
        className="w-full py-2 px-4 border border-gray-300 rounded-md text-sm text-gray-600 hover:bg-gray-50"
        disabled={images.length >= 3}
      >
        Add Images
      </button>
      <input
        id="image-upload"
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleImageChange}
      />
      <p className="text-xs text-gray-500">You may add up to 03 images</p>
      
      <div className="grid grid-cols-3 gap-2">
        {images.map((image, index) => (
          <div key={index} className="relative aspect-square">
            <img
              src={image}
              alt={`Upload ${index + 1}`}
              className="w-full h-full object-cover rounded-md"
            />
            <button
              type="button"
              onClick={() => onImageRemove(index)}
              className="absolute -top-2 -right-2 p-1 bg-white rounded-full shadow-md"
            >
              <X className="h-4 w-4 text-gray-500" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageUpload;
