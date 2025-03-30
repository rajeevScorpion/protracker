import React, { useState } from 'react';
import { Plus, X, Edit2, Tags } from 'lucide-react';
import ConfirmationModal from '../modals/ConfirmationModal';
import { settingsService } from "../../services/settings.service";
import { auth } from "../../lib/firebase"; // Assuming you're using Firebase auth


interface Category {
  id: string;
  name: string;
}

interface CategorySettingsProps {
  title: string;
  categories: Category[];
  onAdd: (name: string) => void;
  onUpdate: (id: string, name: string) => void;
  onDelete: (id: string) => void;
}

const CategorySettings: React.FC<CategorySettingsProps> = ({
  title,
  categories,
  onAdd,
  onUpdate,
  onDelete
}) => {
  const [newCategory, setNewCategory] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);

  const handleAdd = () => {
    if (!newCategory.trim()) return;
    onAdd(newCategory.trim());
    setNewCategory('');
    setIsAdding(false);
  };

  const handleUpdate = (id: string) => {
    if (!editingName.trim()) return;
    onUpdate(id, editingName.trim());
    setEditingId(null);
    setEditingName('');
  };

  const handleDeleteClick = (category: Category) => {
    setCategoryToDelete(category);
  };



  
  const handleConfirmDelete = async () => {
  // const handleConfirmDelete = () => {
    if (categoryToDelete) {
       if (!auth.currentUser) {
        alert("User not authenticated!");
        return;
      }
      try {
          const userId = auth.currentUser.uid;
          const newCategory = await settingsService.deleteCategory(userId, "activity", categoryToDelete.id);
          // alert(`Category Deleted Successfully: ${categoryToDelete.name}`);
          window.location.reload();
        } catch (error) {
          console.error("Error Deleted Category:", error);
          alert("Failed to delete category");
        }
      
      // if (!user || !name.trim()) return;
      // onDelete(categoryToDelete.id);
      // setCategoryToDelete(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-medium">{title}</h3>
        <button
          onClick={() => setIsAdding(true)}
          className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
        >
          <Plus className="h-4 w-4" />
          Add New
        </button>
      </div>

      {isAdding && (
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleAdd();
              }
            }}
            placeholder="Category name"
            className="flex-1 px-3 py-2 border rounded-lg"
          />
          <button
            onClick={handleAdd}
            className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Add
          </button>
          <button
            onClick={() => {
              setIsAdding(false);
              setNewCategory('');
            }}
            className="p-2 text-gray-400 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      )}

      <div className="space-y-2">
        {categories.map((category) => (
          <div
            key={category.id}
            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
          >
            {editingId === category.id ? (
              <div className="flex items-center gap-2 flex-1">
                <input
                  type="text"
                  value={editingName}
                  onChange={(e) => setEditingName(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleUpdate(category.id);
                    }
                  }}
                  className="flex-1 px-3 py-2 border rounded-lg"
                />
                <button
                  onClick={() => handleUpdate(category.id)}
                  className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Update
                </button>
                <button
                  onClick={() => setEditingId(null)}
                  className="p-2 text-gray-400 hover:text-gray-600"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-2">
                  <Tags className="h-4 w-4 text-gray-400" />
                  <span>{category.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setEditingId(category.id);
                      setEditingName(category.name);
                    }}
                    className="p-2 text-blue-600 hover:text-blue-700"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteClick(category)}
                    className="p-2 text-red-600 hover:text-red-700"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      <ConfirmationModal
        isOpen={categoryToDelete !== null}
        onClose={() => setCategoryToDelete(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Category"
        message={`Are you sure you want to delete "${categoryToDelete?.name}"? This action cannot be undone.`}
      />
    </div>
  );
};

export default CategorySettings;
