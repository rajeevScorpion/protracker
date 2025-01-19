import React from 'react';
import { format } from 'date-fns';
import { Clock, Trash2, Download, Image } from 'lucide-react';
import { cn } from '../../lib/utils';

interface ActivityCardProps {
  activity: {
    id: string;
    title: string;
    category: string;
    startTime: Date;
    endTime: Date;
    duration: number;
    images: string[];
    details?: string;
  };
  onDelete: (id: string) => Promise<void>;
}

const ActivityCard: React.FC<ActivityCardProps> = ({ activity, onDelete }) => {
  const [isExpanded, setIsExpanded] = React.useState(false);
  const [loadedImages, setLoadedImages] = React.useState<string[]>([]);

  const handleImageLoad = (imageUrl: string) => {
    setLoadedImages(prev => [...prev, imageUrl]);
  };

  const handleDownload = async (imageUrl: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const link = document.createElement('a');
      link.href = imageUrl;
      link.target = '_blank';
      link.download = `activity-image-${Date.now()}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error downloading image:', error);
    }
  };

  // Ensure images is always an array
  const images = Array.isArray(activity.images) ? activity.images : [];

  return (
    <div 
      className="bg-white rounded-lg shadow-sm border mb-4 cursor-pointer"
      onClick={() => setIsExpanded(!isExpanded)}
    >
      <div className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="inline-block px-3 py-1 text-sm bg-gray-100 rounded-full">
                {activity.category}
              </span>
              <span className="text-sm text-gray-500">
                Duration: {activity.duration} min
              </span>
            </div>
            
            <h3 className="mt-2 text-gray-900">
              {activity.title}
            </h3>
            
            <div className="mt-2 flex items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{format(activity.startTime, 'HH:mm')}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{format(activity.endTime, 'HH:mm')}</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {images.length > 0 && (
              <div className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded-full">
                <Image className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-600">{images.length}</span>
              </div>
            )}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(activity.id);
              }}
              className="p-1 text-gray-400 hover:text-red-500 rounded-full hover:bg-gray-100"
            >
              <Trash2 className="h-5 w-5" />
            </button>
          </div>
        </div>

        {activity.details && (
          <p className="mt-2 text-sm text-gray-600">{activity.details}</p>
        )}
      </div>
      
      {isExpanded && images.length > 0 && (
        <div className="px-4 pb-4 border-t pt-4">
          <div className="grid grid-cols-3 gap-4">
            {images.map((image, index) => (
              <div key={index} className="relative group aspect-square">
                <div className={cn(
                  "w-full h-full rounded-lg overflow-hidden bg-gray-100",
                  !loadedImages.includes(image) && "animate-pulse"
                )}>
                  <img
                    src={image}
                    alt={`Activity ${index + 1}`}
                    className={cn(
                      "w-full h-full object-cover transition-opacity duration-200",
                      loadedImages.includes(image) ? "opacity-100" : "opacity-0"
                    )}
                    onLoad={() => handleImageLoad(image)}
                  />
                </div>
                <button
                  onClick={(e) => handleDownload(image, e)}
                  className="absolute top-2 right-2 p-1.5 bg-white/90 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-sm hover:bg-white"
                >
                  <Download className="h-4 w-4 text-gray-700" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ActivityCard;
