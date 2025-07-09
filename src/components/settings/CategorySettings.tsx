import React, { useState } from 'react';
import { Plus, X, Edit2, Tags } from 'lucide-react';
import ConfirmationModal from '../modals/ConfirmationModal';

interface Category {
  id: string;
  name: string;
}

interface CategorySettingsProps {
  title: string;
  categories: Category[];
  onAdd: (name: string) => Promise<void>;
  onUpdate: (id: string, name: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
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
  const [isLoading, setIsLoading] = useState(false);

  const handleAdd = async () => {
    if (!newCategory.trim() || isLoading) return;
    
    try {
      setIsLoading(true);
      await onAdd(newCategory.trim());
      setNewCategory('');
      setIsAdding(false);
    } catch (error) {
      console.error('Error adding category:', error);
      alert('Failed to add category');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdate = async (id: string) => {
    if (!editingName.trim() || isLoading) return;
    
    try {
      setIsLoading(true);
      await onUpdate(id, editingName.trim());
      setEditingId(null);
      setEditingName('');
    } catch (error) {
      console.error('Error updating category:', error);
      alert('Failed to update category');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteClick = (category: Category) => {
    setCategoryToDelete(category);
  };

  const handleConfirmDelete = async () => {
    if (!categoryToDelete || isLoading) return;
    
    try {
      setIsLoading(true);
      await onDelete(categoryToDelete.id);
      setCategoryToDelete(null);
    } catch (error) {
      console.error('Error deleting category:', error);
      alert('Failed to delete category');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-medium">{title}</h3>
        <button
          onClick={() => setIsAdding(true)}
          disabled={isLoading}
          className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1 disabled:opacity-50"
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
            disabled={isLoading}
            className="flex-1 px-3 py-2 border rounded-lg disabled:opacity-50"
          />
          <button
            onClick={handleAdd}
            disabled={isLoading || !newCategory.trim()}
            className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {isLoading ? 'Adding...' : 'Add'}
          </button>
          <button
            onClick={() => {
              setIsAdding(false);
              setNewCategory('');
            }}
            disabled={isLoading}
            className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50"
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
                  disabled={isLoading}
                  className="flex-1 px-3 py-2 border rounded-lg disabled:opacity-50"
                />
                <button
                  onClick={() => handleUpdate(category.id)}
                  disabled={isLoading || !editingName.trim()}
                  className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {isLoading ? 'Updating...' : 'Update'}
                </button>
                <button
                  onClick={() => {
                    setEditingId(null);
                    setEditingName('');
                  }}
                  disabled={isLoading}
                  className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50"
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
                    disabled={isLoading}
                    className="p-2 text-blue-600 hover:text-blue-700 disabled:opacity-50"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteClick(category)}
                    disabled={isLoading}
                    className="p-2 text-red-600 hover:text-red-700 disabled:opacity-50"
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
