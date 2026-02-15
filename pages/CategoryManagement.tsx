import React, { useEffect, useState } from "react";
import { Plus, Trash2, Loader2 } from "lucide-react";
import { api } from "../services/api";
import AddCategoryModal from "../components/AddCategoryModal";
import DeleteConfirmModal from "../components/DeleteConfirmModal";

// FIX: Added createdDate to the interface
interface CategoryData {
  id: number;
  name: string;
  isDeleted: boolean;
  createdDate: string;
}

export const CategoryManagement: React.FC = () => {
  const [categories, setCategories] = useState<CategoryData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [processingId, setProcessingId] = useState<number | null>(null);
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    category: CategoryData | null;
  }>({
    isOpen: false,
    category: null,
  });

  const fetchCategories = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await api.get("/categories");

      // Map API data to our UI format
      const mappedData = (Array.isArray(data) ? data : []).map((cat: any) => ({
        id: cat.id,
        name: cat.name,
        isDeleted: cat.isDeleted || false,
        createdDate: new Date().toLocaleDateString("en-US", {
          month: "short",
          day: "2-digit",
          year: "numeric",
        }),
      }));

      setCategories(mappedData);
    } catch (err: any) {
      console.error("Fetch categories error:", err);
      setError(err.message || "Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  const handleAddCategory = async (name: string) => {
    setIsCreating(true);
    try {
      await api.post("/categories", { name });
      await fetchCategories();
      setIsAddModalOpen(false);
    } catch (err: any) {
      console.error("Create category error:", err);
      alert(err.message || "Failed to create category");
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteCategory = async () => {
    if (!deleteModal.category) return;

    const id = deleteModal.category.id;
    setProcessingId(id);
    try {
      await api.put(`/categories/soft-delete/${id}`, {});
      await fetchCategories();
      setDeleteModal({ isOpen: false, category: null });
    } catch (err: any) {
      console.error("Delete category error:", err);
      alert(err.message || "Failed to delete category");
    } finally {
      setProcessingId(null);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">
          Category Management
        </h2>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center space-x-2 bg-green-500 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-green-600 transition-colors shadow-lg shadow-green-100"
        >
          <Plus size={20} />
          <span>Add Category</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="animate-spin text-[#721E94] mb-4" size={40} />
            <p className="text-gray-500 font-medium">Loading categories...</p>
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <p className="text-red-500 font-medium mb-4">{error}</p>
            <button
              onClick={() => fetchCategories()}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : categories.length === 0 ? (
          <div className="text-center py-20 text-gray-500 font-medium">
            No categories found
          </div>
        ) : (
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-50 bg-gray-50/50">
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Category Name
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Id
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Created Date
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {categories.map((cat) => (
                <tr key={cat.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-5">
                    <div className="flex items-center space-x-3">
                      <span className="font-semibold text-gray-900">
                        {cat.name}
                      </span>
                      {cat.isDeleted && (
                        <span className="px-2 py-0.5 text-[10px] font-bold bg-red-100 text-red-600 rounded-full uppercase">
                          Deleted
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className="font-bold text-gray-900">{cat.id}</span>
                  </td>
                  <td className="px-6 py-5 text-gray-500">{cat.createdDate}</td>
                  <td className="px-6 py-5">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() =>
                          setDeleteModal({ isOpen: true, category: cat })
                        }
                        disabled={processingId === cat.id || cat.isDeleted}
                        className={`p-2 text-gray-500 hover:text-red-500 transition-colors disabled:opacity-50 ${
                          processingId === cat.id || cat.isDeleted
                            ? "opacity-50 cursor-not-allowed"
                            : ""
                        }`}
                        title={
                          cat.isDeleted ? "Already Deleted" : "Delete Category"
                        }
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <DeleteConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, category: null })}
        onConfirm={handleDeleteCategory}
        title={deleteModal.category?.name || ""}
        isLoading={processingId !== null}
      />

      <AddCategoryModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onConfirm={handleAddCategory}
        isLoading={isCreating}
      />
    </div>
  );
};
