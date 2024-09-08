import React, { useEffect, useState, useRef } from "react";
import { FaEdit, FaTrashAlt, FaPlusCircle } from "react-icons/fa";
import { Dialog, Transition } from "@headlessui/react";
import apiClient from "../services/apiClient";

export default function ProductsList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedBrand, setSelectedBrand] = useState("all");
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [filteredBrands, setFilteredBrands] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [isAddingNewProduct, setIsAddingNewProduct] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedProductForDelete, setSelectedProductForDelete] =
    useState(null);
  const [expandedProducts, setExpandedProducts] = useState({});
  const [filterStockStatus, setFilterStockStatus] = useState("all");

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

  const totalProducts = products.length;
  const outOfStockCount = products.filter((p) => p.quantity === 0).length;
  const lowStockCount = products.filter(
    (p) => p.quantity > 0 && p.quantity < 5
  ).length;
  const availableCount = totalProducts - outOfStockCount - lowStockCount;

  const allCategories = [...new Set(products.map((p) => p.categoryId?.name))];
  const allBrands = [...new Set(products.map((p) => p.brandId?.name))];

  useEffect(() => {
    if (selectedCategory === "all" && selectedBrand === "all") {
      setFilteredCategories(allCategories);
      setFilteredBrands(allBrands);
    } else {
      if (selectedCategory !== "all") {
        const brandsInCategory = [
          ...new Set(
            products
              .filter((p) => p.categoryId?.name === selectedCategory)
              .map((p) => p.brandId?.name)
          ),
        ];
        setFilteredBrands(brandsInCategory);
      } else {
        setFilteredBrands(allBrands);
      }

      if (selectedBrand !== "all") {
        const categoriesWithBrand = [
          ...new Set(
            products
              .filter((p) => p.brandId?.name === selectedBrand)
              .map((p) => p.categoryId?.name)
          ),
        ];
        setFilteredCategories(categoriesWithBrand);
      } else {
        setFilteredCategories(allCategories);
      }
    }
  }, [selectedCategory, selectedBrand, products]);

  const confirmDeleteProduct = (product) => {
    setSelectedProductForDelete(product);
    setConfirmOpen(true);
  };

  const deleteProduct = async () => {
    try {
      await apiClient.delete(`/api/products/${selectedProductForDelete._id}`);
      setProducts(
        products.filter(
          (product) => product._id !== selectedProductForDelete._id
        )
      );
      setConfirmOpen(false);
    } catch (error) {
      console.error("Error deleting the product:", error);
    }
  };

  const openEditModal = (product) => {
    setEditingProduct(product);
    setIsAddingNewProduct(false);
    setModalOpen(true);
  };

  const openAddNewModal = () => {
    setEditingProduct({
      name: "",
      brandId: "",
      categoryId: "",
      quantity: 0,
      price: 0,
      image: "",
      image2: "",
    });
    setIsAddingNewProduct(true);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingProduct(null);
  };

  const saveProductDetails = async () => {
    try {
      if (isAddingNewProduct) {
        const response = await apiClient.post("/api/products", editingProduct);
        setProducts([...products, response.data]);
      } else {
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
      closeModal();
    } catch (error) {
      console.error("Error saving the product:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditingProduct((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const toggleDetails = (id) => {
    setExpandedProducts((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const hideDetails = (id) => {
    setExpandedProducts((prev) => ({
      ...prev,
      [id]: false,
    }));
  };

  const filteredProducts = products
    .filter((product) =>
      selectedCategory === "all"
        ? true
        : product.categoryId?.name === selectedCategory
    )
    .filter((product) =>
      selectedBrand === "all" ? true : product.brandId?.name === selectedBrand
    )
    .filter((product) =>
      filterStockStatus === "all"
        ? true
        : filterStockStatus === "low"
        ? product.quantity > 0 && product.quantity < 5
        : filterStockStatus === "available"
        ? product.quantity >= 1
        : product.quantity === 0
    )
    .filter((product) =>
      product?.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

  if (loading) {
    return <p>Loading products...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <>
      {/* Sticky Header */}
      {/* <div className="sticky top-0 z-10 bg-blue-500 shadow-md transperent"> */}
      {/* <div className="sticky top-0 z-10 shadow-md bg-none transparent"> */}
      <div className="fixed top-0 z-10 w-full bg-blue-500 shadow-md">
        <div className="flex items-center justify-between px-4 py-4 text-white">
          <h1 className="text-3xl font-bold">Products ({totalProducts})</h1>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <aside className="fixed top-[5.7rem] left-0 w-1/4 h-[calc(100vh-5rem)] p-4 bg-gray-100 z-50">
          <h2 className="mb-4 text-xl font-bold">Filters</h2>

          <div className="mb-4">
            <label className="block text-sm font-semibold">Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg"
            >
              <option value="all">All Categories</option>
              {filteredCategories.map((category, index) => (
                <option key={index} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-semibold">Brand</label>
            <select
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg"
            >
              <option value="all">All Brands</option>
              {filteredBrands.map((brand, index) => (
                <option key={index} value={brand}>
                  {brand}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-semibold">Stock Status</label>
            <select
              value={filterStockStatus}
              onChange={(e) => setFilterStockStatus(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg"
            >
              <option value="all">All Stock Levels</option>
              <option value="available">Available</option>
              <option value="low">Low Stock</option>
              <option value="out">Out of Stock</option>
            </select>
          </div>

          <div className="mt-6">
            <h3 className="mb-2 text-lg font-bold">Stock Summary</h3>
            <p>Total Products: {totalProducts}</p>
            <p>Available: {availableCount}</p>
            <p>Low Stock: {lowStockCount}</p>
            <p>Out of Stock: {outOfStockCount}</p>
          </div>
        </aside>

        {/* Main Products Section */}
        <main className="w-3/4 h-screen overflow-y-auto ml-[25%]">
          <div className="fixed top-[5.7rem]  w-[75%] z-50 flex items-center justify-between p-3 mb-4 bg-gray-100">
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

          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 p-4 mt-40 sm:grid-cols-2 lg:grid-cols-3">
              {filteredProducts.map((product, index) => {
                let label = "";
                let labelStyle = "";
                let bgColor = "bg-gray-50"; // Light gray background for available products

                if (product.quantity === 0) {
                  label = "Out of Stock";
                  labelStyle = "text-red-500 font-bold";
                  bgColor = "bg-red-100"; // Light red background
                } else if (product.quantity < 5) {
                  label = "Low Stock";
                  labelStyle = "text-yellow-500 font-bold";
                  bgColor = "bg-yellow-100"; // Light yellow background
                }

                return (
                  <div
                    key={product._id}
                    className={`relative p-4 rounded-lg shadow-md transition-transform duration-300 transform hover:scale-105 ${bgColor}`}
                    onMouseLeave={() => hideDetails(product._id)}
                  >
                    <div className="absolute z-20 top-2 left-2">
                      <span
                        className={`px-2 py-1 rounded text-white ${labelStyle}`}
                        style={{
                          backgroundColor:
                            label === "Out of Stock"
                              ? "#FF4D4F" // Red for out of stock
                              : label === "Low Stock"
                              ? "#FFA500" // Orange for low stock
                              : // : "#4CAF50", // Green for normal stock
                                "", // Green for normal stock
                        }}
                      >
                        {label || "In Stock"}
                      </span>
                    </div>

                    <div className="relative flex items-center justify-center h-56 bg-white group">
                      <img
                        src={product?.image}
                        alt={product?.name}
                        className="object-contain w-full h-full p-4"
                      />
                      <div className="absolute bottom-0 hidden max-w-full p-2 overflow-hidden text-sm text-center text-white bg-gray-800 rounded-t-lg group-hover:block w-max text-ellipsis">
                        {product.name}
                      </div>
                    </div>

                    <div className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="relative w-full group">
                          <h3 className="text-lg font-semibold overflow-hidden whitespace-nowrap text-ellipsis max-w-[90%]">
                            {product.name}
                          </h3>
                          <div className="absolute left-0 right-0 z-10 hidden max-w-full p-2 overflow-hidden text-center bg-gray-200 rounded shadow-lg group-hover:block w-max text-ellipsis">
                            {product.name}
                          </div>
                        </div>
                      </div>

                      <p className="text-gray-600">
                        Quantity: {product.quantity}
                      </p>

                      <div className="flex justify-between mt-2">
                        <button
                          onClick={() => toggleDetails(product._id)}
                          className="text-indigo-500 hover:text-indigo-600"
                        >
                          {expandedProducts[product._id]
                            ? "Hide Details"
                            : "View Details"}
                        </button>

                        <div className="flex space-x-2">
                          <button
                            className="text-blue-500 hover:text-blue-700"
                            onClick={() => openEditModal(product)}
                          >
                            <FaEdit className="w-5 h-5" />
                          </button>
                          <button
                            className="text-red-500 hover:text-red-700"
                            onClick={() => confirmDeleteProduct(product)}
                          >
                            <FaTrashAlt className="w-5 h-5" />
                          </button>
                        </div>
                      </div>

                      {expandedProducts[product._id] && (
                        <div className="mt-4">
                          <p className="text-gray-600">
                            Brand: {product.brandId?.name}
                          </p>
                          <p className="text-gray-600">
                            Category: {product.categoryId?.name}
                          </p>
                          <p className="text-gray-600">
                            Price: ${product.price}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-center text-gray-600">
              No products found for your search.
            </p>
          )}
        </main>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="p-8 bg-white rounded-lg shadow-lg w-96">
            <h2 className="mb-4 text-2xl font-bold">
              {isAddingNewProduct ? "Add New Product" : "Edit Product"}
            </h2>

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

            <div className="mb-4">
              <label className="block mb-2 text-sm font-semibold">Price</label>
              <input
                type="number"
                name="price"
                value={editingProduct?.price || 0}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-indigo-200"
              />
            </div>

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

            <div className="mb-4">
              <label className="block mb-2 text-sm font-semibold">
                Category
              </label>
              <input
                type="text"
                name="categoryId"
                value={editingProduct?.categoryId || ""}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-indigo-200"
              />
            </div>

            <div className="mb-4">
              <label className="block mb-2 text-sm font-semibold">Brand</label>
              <input
                type="text"
                name="brandId"
                value={editingProduct?.brandId || ""}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-indigo-200"
              />
            </div>

            <div className="mb-4">
              <label className="block mb-2 text-sm font-semibold">Image</label>
              <input
                type="text"
                name="image"
                value={editingProduct?.image || ""}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-indigo-200"
              />
            </div>

            <div className="mb-4">
              <label className="block mb-2 text-sm font-semibold">
                Additional Image
              </label>
              <input
                type="text"
                name="image2"
                value={editingProduct?.image2 || ""}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-indigo-200"
              />
            </div>

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
