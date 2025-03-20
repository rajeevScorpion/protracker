import React from 'react';
import { X, Upload } from 'lucide-react';

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
        className="w-full py-3 px-4 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2 bg-white"
        disabled={images.length >= 3}
      >
        <Upload className="h-5 w-5" />
        Add Images
      </button>
      <input
        id="image-upload"
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleImageChange}
      />
      <p className="text-xs text-gray-500 text-center">You may add up to 03 images</p>
      
      {images.length > 0 && (
        <div className="grid grid-cols-3 gap-3">
          {images.map((image, index) => (
            <div key={index} className="relative aspect-square">
              <img
                src={image}
                alt={`Upload ${index + 1}`}
                className="w-full h-full object-cover rounded-lg border border-gray-200 shadow-sm"
              />
              <button
                type="button"
                onClick={() => onImageRemove(index)}
                className="absolute -top-2 -right-2 p-1 bg-white rounded-full shadow-md hover:shadow-lg transition-shadow"
              >
                <X className="h-4 w-4 text-gray-500" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
