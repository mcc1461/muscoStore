import React, { useState, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import {
  useAddProductMutation,
  useUpdateProductMutation,
} from "../features/api/apiSlice";

const ProductModal = ({
  isOpen,
  onClose,
  product = null, // If null, it's for adding a new product
}) => {
  const [editingProduct, setEditingProduct] = useState(product || {});
  const [addProduct, { isLoading: isAdding }] = useAddProductMutation();
  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();

  useEffect(() => {
    setEditingProduct(product || {});
  }, [product]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    // Handle nested objects for brandId and categoryId
    if (name.startsWith("brandId.")) {
      const key = name.split(".")[1];
      setEditingProduct((prev) => ({
        ...prev,
        brandId: { ...prev.brandId, [key]: value },
      }));
    } else if (name.startsWith("categoryId.")) {
      const key = name.split(".")[1];
      setEditingProduct((prev) => ({
        ...prev,
        categoryId: { ...prev.categoryId, [key]: value },
      }));
    } else {
      setEditingProduct((prev) => ({
        ...prev,
        [name]:
          name === "quantity" || name === "price" ? parseFloat(value) : value,
      }));
    }
  };

  const saveProductDetails = async () => {
    try {
      if (!editingProduct._id) {
        await addProduct(editingProduct).unwrap();
      } else {
        await updateProduct(editingProduct).unwrap();
      }
      onClose();
    } catch (error) {
      console.error("Error saving product:", error);
      // Optionally, handle errors (e.g., display notification)
    }
  };

  return (
    <Transition show={isOpen} as={React.Fragment}>
      <Dialog
        as="div"
        className="fixed inset-0 z-50 overflow-y-auto"
        onClose={onClose}
      >
        <div className="flex items-center justify-center min-h-screen px-4 text-center">
          <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />
          <span
            className="inline-block h-screen align-middle"
            aria-hidden="true"
          >
            &#8203;
          </span>
          <div className="inline-block p-8 my-8 overflow-hidden text-left align-middle transition-all transform bg-white rounded-lg shadow-xl w-96">
            <Dialog.Title className="mb-4 text-2xl font-bold">
              {editingProduct._id ? "Edit Product" : "Add New Product"}
            </Dialog.Title>
            <div className="space-y-4">
              {/* Name */}
              <div>
                <label className="block mb-2 text-sm font-semibold">Name</label>
                <input
                  type="text"
                  name="name"
                  value={editingProduct.name || ""}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-indigo-200"
                  required
                />
              </div>

              {/* Price */}
              <div>
                <label className="block mb-2 text-sm font-semibold">
                  Price ($)
                </label>
                <input
                  type="number"
                  name="price"
                  value={editingProduct.price || 0}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-indigo-200"
                  min="0"
                  step="0.01"
                  required
                />
              </div>

              {/* Quantity */}
              <div>
                <label className="block mb-2 text-sm font-semibold">
                  Quantity
                </label>
                <input
                  type="number"
                  name="quantity"
                  value={editingProduct.quantity || 0}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-indigo-200"
                  min="0"
                  required
                />
              </div>

              {/* Category */}
              <div>
                <label className="block mb-2 text-sm font-semibold">
                  Category
                </label>
                <input
                  type="text"
                  name="categoryId.name"
                  value={editingProduct.categoryId?.name || ""}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-indigo-200"
                  placeholder="e.g., Electronics"
                  required
                />
              </div>

              {/* Brand */}
              <div>
                <label className="block mb-2 text-sm font-semibold">
                  Brand
                </label>
                <input
                  type="text"
                  name="brandId.name"
                  value={editingProduct.brandId?.name || ""}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-indigo-200"
                  placeholder="e.g., Samsung"
                  required
                />
              </div>

              {/* Image URL */}
              <div>
                <label className="block mb-2 text-sm font-semibold">
                  Image URL
                </label>
                <input
                  type="url"
                  name="image"
                  value={editingProduct.image || ""}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-indigo-200"
                  placeholder="https://example.com/image.jpg"
                  required
                />
              </div>

              {/* Additional Image URL (Optional) */}
              <div>
                <label className="block mb-2 text-sm font-semibold">
                  Additional Image URL (Optional)
                </label>
                <input
                  type="url"
                  name="image2"
                  value={editingProduct.image2 || ""}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-indigo-200"
                  placeholder="https://example.com/image2.jpg"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end mt-6 space-x-4">
              <button
                onClick={saveProductDetails}
                disabled={isAdding || isUpdating}
                className={`px-4 py-2 text-white rounded-lg ${
                  editingProduct._id
                    ? "bg-blue-500 hover:bg-blue-600"
                    : "bg-green-500 hover:bg-green-600"
                } ${
                  isAdding || isUpdating ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {isAdding || isUpdating
                  ? editingProduct._id
                    ? "Updating..."
                    : "Adding..."
                  : editingProduct._id
                  ? "Update"
                  : "Add"}
              </button>
              <button
                onClick={onClose}
                className="px-4 py-2 text-white bg-red-500 rounded-lg hover:bg-red-600"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default ProductModal;
