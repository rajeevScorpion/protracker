import React from 'react';
import { format } from 'date-fns';
import { Clock, Trash2, Download } from 'lucide-react';

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
            {activity.images.length > 0 && (
              <div className="flex -space-x-1">
                {activity.images.slice(0, 3).map((_, index) => (
                  <div
                    key={index}
                    className="h-6 w-6 rounded-full border-2 border-white bg-gray-200 flex items-center justify-center"
                  >
                    <span className="text-xs">{index + 1}</span>
                  </div>
                ))}
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
      </div>
      
      {isExpanded && (
        <div className="px-4 pb-4 pt-2 border-t">
          {activity.details && (
            <p className="text-gray-600 text-sm mb-4">{activity.details}</p>
          )}
          {activity.images.length > 0 && (
            <div className="grid grid-cols-3 gap-2">
              {activity.images.map((image, index) => (
                <div key={index} className="relative group">
                  <div className={`aspect-square rounded-lg bg-gray-100 ${
                    loadedImages.includes(image) ? '' : 'animate-pulse'
                  }`}>
                    <img
                      src={image}
                      alt={`Activity image ${index + 1}`}
                      className={`w-full h-full object-cover rounded-lg transition-opacity duration-200 ${
                        loadedImages.includes(image) ? 'opacity-100' : 'opacity-0'
                      }`}
                      loading="lazy"
                      onLoad={() => handleImageLoad(image)}
                    />
                  </div>
                  <button
                    onClick={(e) => handleDownload(image, e)}
                    className="absolute top-2 right-2 p-1.5 bg-white/90 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-sm hover:bg-white"
                    title="Download image"
                  >
                    <Download className="h-4 w-4 text-gray-700" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ActivityCard;
