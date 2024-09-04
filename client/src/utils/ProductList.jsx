import React, { useEffect, useState } from "react";
import { FaEdit, FaTrashAlt, FaPlusCircle } from "react-icons/fa";
import { Dialog, Transition } from "@headlessui/react";
import apiClient from "../services/apiClient";

export default function ProductsList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingProduct, setEditingProduct] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [isAddingNewProduct, setIsAddingNewProduct] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedProductForDelete, setSelectedProductForDelete] =
    useState(null);
  const [expandedProducts, setExpandedProducts] = useState({});

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await apiClient.get("/api/products");
        setProducts(response.data.data);
        setLoading(false);
      } catch (error) {
        setError("Error fetching products");
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Delete a product with confirmation modal
  const confirmDeleteProduct = (product) => {
    setSelectedProductForDelete(product);
    setConfirmOpen(true); // Open the confirm dialog
  };

  const deleteProduct = async () => {
    try {
      await apiClient.delete(`/api/products/${selectedProductForDelete._id}`);
      setProducts(
        products.filter(
          (product) => product._id !== selectedProductForDelete._id
        )
      ); // Remove deleted product
      setConfirmOpen(false); // Close confirm modal
    } catch (error) {
      console.error("Error deleting the product:", error);
    }
  };

  // Open modal to edit a product
  const openEditModal = (product) => {
    setEditingProduct(product);
    setIsAddingNewProduct(false); // Ensure it's not in "Add New" mode
    setModalOpen(true); // Open the modal
  };

  // Open modal to add a new product
  const openAddNewModal = () => {
    setEditingProduct({
      name: "",
      quantity: 0,
      brandId: { name: "" },
      categoryId: { name: "" },
    }); // Empty form for new product
    setIsAddingNewProduct(true); // Switch to "Add New" mode
    setModalOpen(true);
  };

  // Close modal
  const closeModal = () => {
    setModalOpen(false);
    setEditingProduct(null);
  };

  // Save edited or new product details
  const saveProductDetails = async () => {
    try {
      if (isAddingNewProduct) {
        // POST request to add a new product
        const response = await apiClient.post("/api/products", editingProduct);
        setProducts([...products, response.data]); // Add new product to list without reload
      } else {
        // PUT request to update an existing product
        await apiClient.put(
          `/api/products/${editingProduct._id}`,
          editingProduct
        );
        setProducts((prevProducts) =>
          prevProducts.map((product) =>
            product._id === editingProduct._id ? editingProduct : product
          )
        );
      }
      closeModal(); // Close modal after saving
    } catch (error) {
      console.error("Error saving the product:", error);
    }
  };

  // Handle input change in the modal form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditingProduct((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Toggle details on button click
  const toggleDetails = (id) => {
    setExpandedProducts((prev) => ({
      ...prev,
      [id]: !prev[id], // Toggle the state for the specific product
    }));
  };

  // Hide details when mouse leaves the card
  const hideDetails = (id) => {
    setExpandedProducts((prev) => ({
      ...prev,
      [id]: false, // Set the state to false when mouse leaves
    }));
  };

  // Filter products based on the search term
  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <p>Loading products...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <>
      {/* Add New Product Button */}
      <div className="flex items-center justify-between px-4 py-2">
        {/* Search Input */}
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-1/2 px-4 py-2 border rounded-lg focus:ring focus:ring-indigo-200"
        />

        <button
          onClick={openAddNewModal}
          className="px-4 py-2 text-white bg-green-500 rounded-lg hover:bg-green-600"
        >
          <FaPlusCircle className="inline-block mr-2" /> Add New Product
        </button>
      </div>

      {/* Products List */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 px-4 py-6 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
          {filteredProducts.map((product) => (
            <div
              key={product._id}
              className="overflow-hidden transition-transform duration-300 transform bg-gray-100 rounded-lg shadow-lg hover:scale-105"
              onMouseLeave={() => hideDetails(product._id)} // Hide details on mouse leave
            >
              {/* Product Name */}
              <div className="p-6 text-center">
                <h3 className="text-2xl font-semibold text-gray-800">
                  {product.name}
                </h3>

                {/* View Details Button */}
                <button
                  onClick={() => toggleDetails(product._id)}
                  className="font-semibold text-indigo-500 hover:text-indigo-600"
                >
                  {expandedProducts[product._id]
                    ? "Hide Details"
                    : "View Details"}
                </button>

                {/* Details Section (Visible only if expanded) */}
                {expandedProducts[product._id] && (
                  <div className="mt-4">
                    <p className="text-gray-600">
                      Brand: {product.brandId?.name || "N/A"}
                    </p>
                    <p className="text-gray-600">
                      Category: {product.categoryId?.name || "N/A"}
                    </p>
                    <p className="mt-4 font-medium text-gray-500">
                      Quantity: {product.quantity}
                    </p>
                  </div>
                )}
              </div>

              {/* Edit and Delete Icons */}
              <div className="flex justify-center p-4">
                <button
                  className="mr-3 text-blue-500 hover:text-blue-700"
                  onClick={() => openEditModal(product)} // Open modal to edit product
                >
                  <FaEdit className="w-5 h-5" />
                </button>
                <button
                  className="text-red-500 hover:text-red-700"
                  onClick={() => confirmDeleteProduct(product)} // Ask for confirmation before deleting
                >
                  <FaTrashAlt className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-600">
          No products found for your search.
        </p>
      )}

      {/* Modal for Editing or Adding Product */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="p-8 bg-white rounded-lg shadow-lg w-96">
            <h2 className="mb-4 text-2xl font-bold">
              {isAddingNewProduct ? "Add New Product" : "Edit Product"}
            </h2>

            {/* Name */}
            <div className="mb-4">
              <label className="block mb-2 text-sm font-semibold">Name</label>
              <input
                type="text"
                name="name"
                value={editingProduct?.name || ""}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-indigo-200"
              />
            </div>

            {/* Brand */}
            <div className="mb-4">
              <label className="block mb-2 text-sm font-semibold">Brand</label>
              <input
                type="text"
                name="brandId.name"
                value={editingProduct?.brandId?.name || ""}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-indigo-200"
              />
            </div>

            {/* Category */}
            <div className="mb-4">
              <label className="block mb-2 text-sm font-semibold">
                Category
              </label>
              <input
                type="text"
                name="categoryId.name"
                value={editingProduct?.categoryId?.name || ""}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-indigo-200"
              />
            </div>

            {/* Quantity */}
            <div className="mb-4">
              <label className="block mb-2 text-sm font-semibold">
                Quantity
              </label>
              <input
                type="number"
                name="quantity"
                value={editingProduct?.quantity || 0}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-indigo-200"
              />
            </div>

            {/* Save and Cancel Buttons */}
            <div className="flex justify-end space-x-4">
              <button
                onClick={saveProductDetails}
                className="px-4 py-2 text-white bg-green-500 rounded-lg hover:bg-green-600"
              >
                Save
              </button>
              <button
                onClick={closeModal}
                className="px-4 py-2 text-white bg-red-500 rounded-lg hover:bg-red-600"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Delete Modal */}
      <Transition show={confirmOpen} as={React.Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-10 overflow-y-auto"
          onClose={() => setConfirmOpen(false)}
        >
          <div className="flex items-center justify-center min-h-screen px-4 text-center sm:block sm:p-0">
            <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen">
              &#8203;
            </span>
            <div className="inline-block p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white rounded-lg shadow-xl">
              <Dialog.Title className="text-2xl font-bold text-gray-800">
                Confirm Deletion
              </Dialog.Title>
              <Dialog.Description className="mt-2 text-gray-600">
                Are you sure you want to delete this product? This action cannot
                be undone.
              </Dialog.Description>

              <div className="flex justify-end mt-4 space-x-4">
                <button
                  onClick={() => setConfirmOpen(false)}
                  className="px-4 py-2 text-white bg-gray-500 rounded-lg hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button
                  onClick={deleteProduct}
                  className="px-4 py-2 text-white bg-red-500 rounded-lg hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
