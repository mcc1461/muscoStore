// PurchaseForm.jsx
import React, { useEffect } from "react";
import DropdownWithAddNew from "./DropdownWithAddNew";
import apiClient from "../../services/apiClient";

export default function PurchaseForm({
  categories,
  filteredFirms,
  filteredBrands,
  filteredProducts,
  editingPurchase,
  setEditingPurchase,
  closeModal,
  handleSavePurchase,
  currentUserRole,
  currentUserId,
  users,
  selectedCategory,
  setSelectedCategory,
  selectedFirm,
  setSelectedFirm,
  selectedBrand,
  setSelectedBrand,
  selectedProduct,
  setSelectedProduct,
  allCategories,
  allFirms,
  allBrands,
  allProducts,
}) {
  // State variables for adding new entries
  const [isAddingNewCategory, setIsAddingNewCategory] = React.useState(false);
  const [newCategoryName, setNewCategoryName] = React.useState("");

  const [isAddingNewFirm, setIsAddingNewFirm] = React.useState(false);
  const [newFirmName, setNewFirmName] = React.useState("");

  const [isAddingNewBrand, setIsAddingNewBrand] = React.useState(false);
  const [newBrandName, setNewBrandName] = React.useState("");

  const [isAddingNewProduct, setIsAddingNewProduct] = React.useState(false);
  const [newProductName, setNewProductName] = React.useState("");
  const [newProductImage, setNewProductImage] = React.useState(null);

  // Handlers for adding new entries
  const handleAddNewCategory = async () => {
    if (newCategoryName.trim() === "") return;

    try {
      const response = await apiClient.post("/api/categories", {
        name: newCategoryName,
      });
      const newCategory = response.data?.data;
      if (newCategory) {
        setSelectedCategory(newCategory._id);
        setIsAddingNewCategory(false);
        setNewCategoryName("");
        // Optionally update categories list
        // allCategories.push(newCategory);
      }
    } catch (error) {
      console.error("Error adding new category:", error);
      alert("Failed to add new category.");
    }
  };

  const handleAddNewFirm = async () => {
    if (newFirmName.trim() === "") return;

    try {
      const response = await apiClient.post("/api/firms", {
        name: newFirmName,
      });
      const newFirm = response.data?.data;
      if (newFirm) {
        setSelectedFirm(newFirm._id);
        setIsAddingNewFirm(false);
        setNewFirmName("");
      }
    } catch (error) {
      console.error("Error adding new firm:", error);
      alert("Failed to add new firm.");
    }
  };

  const handleAddNewBrand = async () => {
    if (newBrandName.trim() === "") return;

    try {
      const response = await apiClient.post("/api/brands", {
        name: newBrandName,
      });
      const newBrand = response.data?.data;
      if (newBrand) {
        setSelectedBrand(newBrand._id);
        setIsAddingNewBrand(false);
        setNewBrandName("");
      }
    } catch (error) {
      console.error("Error adding new brand:", error);
      alert("Failed to add new brand.");
    }
  };

  const handleAddNewProduct = async () => {
    if (newProductName.trim() === "") return;

    try {
      const formData = new FormData();
      formData.append("name", newProductName);
      if (newProductImage) {
        formData.append("image", newProductImage);
      }

      const response = await apiClient.post("/api/products", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const newProduct = response.data?.data;
      if (newProduct) {
        setSelectedProduct(newProduct._id);
        setIsAddingNewProduct(false);
        setNewProductName("");
        setNewProductImage(null);
      }
    } catch (error) {
      console.error("Error adding new product:", error);
      alert("Failed to add new product.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Handle adding new entries first
    if (isAddingNewCategory) {
      await handleAddNewCategory();
    }

    if (isAddingNewFirm) {
      await handleAddNewFirm();
    }

    if (isAddingNewBrand) {
      await handleAddNewBrand();
    }

    if (isAddingNewProduct) {
      await handleAddNewProduct();
    }

    // Now, handle saving the purchase
    const purchaseData = {
      categoryId: selectedCategory,
      firmId: selectedFirm,
      brandId: selectedBrand,
      productId: selectedProduct,
      quantity: editingPurchase?.quantity || 0,
      price: editingPurchase?.price || 0,
      amount: (editingPurchase?.quantity || 0) * (editingPurchase?.price || 0),
      notes: editingPurchase?.notes || "",
      purchasedById:
        currentUserRole === "user"
          ? currentUserId
          : editingPurchase?.purchasedById,
    };

    handleSavePurchase(purchaseData);
  };

  // Initialize selections if editing
  useEffect(() => {
    if (editingPurchase) {
      setSelectedCategory(editingPurchase.categoryId || "");
      setSelectedFirm(editingPurchase.firmId || "");
      setSelectedBrand(editingPurchase.brandId || "");
      setSelectedProduct(editingPurchase.productId || "");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editingPurchase]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-2xl max-h-full p-8 overflow-y-auto bg-white rounded shadow-lg">
        <h2 className="mb-4 text-2xl font-bold">
          {editingPurchase ? "Edit Purchase" : "Add New Purchase"}
        </h2>

        <form onSubmit={handleSubmit}>
          {/* Category Dropdown */}
          <DropdownWithAddNew
            label="Category"
            options={categories}
            value={selectedCategory}
            onChange={setSelectedCategory}
            isAddingNew={isAddingNewCategory}
            setIsAddingNew={setIsAddingNewCategory}
            newEntryName={newCategoryName}
            setNewEntryName={setNewCategoryName}
          />

          {/* Add New Category Button */}
          {isAddingNewCategory && (
            <button
              type="button"
              onClick={handleAddNewCategory}
              className="px-4 py-2 mt-2 text-white bg-blue-500 rounded hover:bg-blue-600"
            >
              Add Category
            </button>
          )}

          {/* Firm Dropdown */}
          <DropdownWithAddNew
            label="Firm"
            options={filteredFirms}
            value={selectedFirm}
            onChange={setSelectedFirm}
            isAddingNew={isAddingNewFirm}
            setIsAddingNew={setIsAddingNewFirm}
            newEntryName={newFirmName}
            setNewEntryName={setNewFirmName}
            disabled={!selectedCategory}
          />

          {/* Add New Firm Button */}
          {isAddingNewFirm && (
            <button
              type="button"
              onClick={handleAddNewFirm}
              className="px-4 py-2 mt-2 text-white bg-blue-500 rounded hover:bg-blue-600"
            >
              Add Firm
            </button>
          )}

          {/* Brand Dropdown */}
          <DropdownWithAddNew
            label="Brand"
            options={filteredBrands}
            value={selectedBrand}
            onChange={setSelectedBrand}
            isAddingNew={isAddingNewBrand}
            setIsAddingNew={setIsAddingNewBrand}
            newEntryName={newBrandName}
            setNewEntryName={setNewBrandName}
            disabled={!selectedFirm}
          />

          {/* Add New Brand Button */}
          {isAddingNewBrand && (
            <button
              type="button"
              onClick={handleAddNewBrand}
              className="px-4 py-2 mt-2 text-white bg-blue-500 rounded hover:bg-blue-600"
            >
              Add Brand
            </button>
          )}

          {/* Product Dropdown */}
          <DropdownWithAddNew
            label="Product"
            options={filteredProducts}
            value={selectedProduct}
            onChange={setSelectedProduct}
            isAddingNew={isAddingNewProduct}
            setIsAddingNew={setIsAddingNewProduct}
            newEntryName={newProductName}
            setNewEntryName={setNewProductName}
            disabled={!selectedBrand}
          />

          {/* Add New Product Button */}
          {isAddingNewProduct && (
            <button
              type="button"
              onClick={handleAddNewProduct}
              className="px-4 py-2 mt-2 text-white bg-blue-500 rounded hover:bg-blue-600"
            >
              Add Product
            </button>
          )}

          {/* Purchased By Dropdown */}
          <div className="mb-4">
            <label className="block mb-2 font-semibold">Purchased By</label>
            <select
              value={
                currentUserRole === "user"
                  ? currentUserId
                  : editingPurchase?.purchasedById || ""
              }
              onChange={(e) => {
                const value = e.target.value;
                setEditingPurchase({
                  ...editingPurchase,
                  purchasedById: value,
                });
              }}
              className="w-full p-2 border rounded"
              disabled={currentUserRole === "user"}
            >
              {currentUserRole !== "user" && (
                <option value="">All Users</option>
              )}
              {users.map((user) => (
                <option key={user._id} value={user._id}>
                  {user.username} ({user.role || "user"})
                </option>
              ))}
            </select>
          </div>

          {/* Quantity Field */}
          <div className="mb-4">
            <label className="block mb-2 font-semibold">Quantity</label>
            <input
              type="number"
              name="quantity"
              value={editingPurchase?.quantity || ""}
              onChange={(e) =>
                setEditingPurchase({
                  ...editingPurchase,
                  quantity: e.target.value,
                })
              }
              className="w-full p-2 border rounded"
              min="0"
            />
          </div>

          {/* Price Field */}
          <div className="mb-4">
            <label className="block mb-2 font-semibold">Price</label>
            <input
              type="number"
              name="price"
              value={editingPurchase?.price || ""}
              onChange={(e) =>
                setEditingPurchase({
                  ...editingPurchase,
                  price: e.target.value,
                })
              }
              className="w-full p-2 border rounded"
              min="0"
              step="0.01"
            />
          </div>

          {/* Amount Field (Read-only) */}
          <div className="mb-4">
            <label className="block mb-2 font-semibold">Amount</label>
            <input
              type="number"
              name="amount"
              value={editingPurchase?.amount || 0}
              readOnly
              className="w-full p-2 bg-gray-100 border rounded"
            />
          </div>

          {/* Notes Field */}
          <div className="mb-4">
            <label className="block mb-2 font-semibold">Notes</label>
            <textarea
              name="notes"
              value={editingPurchase?.notes || ""}
              onChange={(e) =>
                setEditingPurchase({
                  ...editingPurchase,
                  notes: e.target.value,
                })
              }
              className="w-full p-2 border rounded"
              rows="3"
            ></textarea>
          </div>

          {/* Modal Buttons */}
          <div className="flex justify-end space-x-2">
            <button
              type="submit"
              className="px-4 py-2 text-white bg-green-500 rounded hover:bg-green-600"
            >
              Save
            </button>
            <button
              type="button"
              onClick={closeModal}
              className="px-4 py-2 text-white bg-red-500 rounded hover:bg-red-600"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
