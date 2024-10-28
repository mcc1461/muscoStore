import React, { useEffect, useState } from "react";
import apiClient from "../services/apiClient";
import { FaEdit, FaTrashAlt, FaPlusCircle } from "react-icons/fa";
import ConfirmDialog from "./ProductListConfirm";

export default function PurchaseManagement() {
  const [purchases, setPurchases] = useState([]);
  const [firms, setFirms] = useState([]);
  const [brands, setBrands] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPurchase, setEditingPurchase] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedPurchaseForDelete, setSelectedPurchaseForDelete] =
    useState(null);

  useEffect(() => {
    // Fetch data for purchases, firms, brands, and users
    const fetchData = async () => {
      try {
        const [
          purchasesResponse,
          firmsResponse,
          brandsResponse,
          usersResponse,
        ] = await Promise.all([
          apiClient.get("/api/purchases"),
          apiClient.get("/api/firms"),
          apiClient.get("/api/brands"),
          apiClient.get("/api/users"),
        ]);
        setPurchases(purchasesResponse.data.data);
        setFirms(firmsResponse.data.data);
        setBrands(brandsResponse.data.data);
        setUsers(usersResponse.data.data);
        setLoading(false);
      } catch (error) {
        setError("Error fetching data");
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const openEditModal = (purchase) => {
    setEditingPurchase(purchase);
    setModalOpen(true);
  };

  const openAddNewModal = () => {
    setEditingPurchase({
      date: "",
      firm: "",
      brand: "",
      product: "",
      productImage: "",
      purchasedBy: "",
      quantity: 0,
      purchasePrice: 0,
      total: 0,
      notes: "",
    });
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingPurchase(null);
  };

  const savePurchaseDetails = async () => {
    try {
      if (editingPurchase._id) {
        await apiClient.put(
          `/api/purchases/${editingPurchase._id}`,
          editingPurchase
        );
        setPurchases((prevPurchases) =>
          prevPurchases.map((purchase) =>
            purchase._id === editingPurchase._id ? editingPurchase : purchase
          )
        );
      } else {
        const response = await apiClient.post(
          "/api/purchases",
          editingPurchase
        );
        setPurchases([...purchases, response.data]);
      }
      closeModal();
    } catch (error) {
      console.error("Error saving the purchase:", error);
    }
  };

  const confirmDeletePurchase = (purchase) => {
    setSelectedPurchaseForDelete(purchase);
    setConfirmOpen(true);
  };

  const deletePurchase = async () => {
    try {
      await apiClient.delete(`/api/purchases/${selectedPurchaseForDelete._id}`);
      setPurchases(
        purchases.filter(
          (purchase) => purchase._id !== selectedPurchaseForDelete._id
        )
      );
      setConfirmOpen(false);
    } catch (error) {
      console.error("Error deleting the purchase:", error);
    }
  };

  if (loading) return <p>Loading purchases...</p>;
  if (error) return <p>{error}</p>;

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Purchase Management</h1>
        <button
          onClick={openAddNewModal}
          className="px-4 py-2 text-white bg-green-500 rounded"
        >
          <FaPlusCircle className="inline-block mr-2" /> Add New Purchase
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {[
                "Date",
                "Firm",
                "Brand",
                "Product",
                "Image",
                "Purchased By",
                "Quantity",
                "Purchase Price",
                "Total",
                "Notes",
                "Actions",
              ].map((header) => (
                <th
                  key={header}
                  scope="col"
                  className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {purchases.map((purchase) => (
              <tr key={purchase._id}>
                <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                  {purchase.date}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                  {purchase.firm}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                  {purchase.brand}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                  {purchase.product}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                  <img
                    src={purchase.productImage}
                    alt={purchase.product}
                    className="w-10 h-10"
                  />
                </td>
                <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                  {purchase.purchasedBy}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                  {purchase.quantity}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                  ${purchase.purchasePrice}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                  ${purchase.total}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                  {purchase.notes}
                </td>
                <td className="flex px-6 py-4 space-x-2 text-sm font-medium whitespace-nowrap">
                  <button
                    onClick={() => openEditModal(purchase)}
                    className="text-indigo-600 hover:text-indigo-900"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => confirmDeletePurchase(purchase)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <FaTrashAlt />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="p-8 bg-white rounded shadow-lg w-96">
            <h2 className="mb-4 text-xl font-bold">
              {editingPurchase?._id ? "Edit Purchase" : "Add New Purchase"}
            </h2>

            {/* Form Fields */}
            <label>Date</label>
            <input
              type="date"
              name="date"
              value={editingPurchase?.date || ""}
              onChange={(e) =>
                setEditingPurchase({ ...editingPurchase, date: e.target.value })
              }
              className="w-full p-2 mb-2 border rounded"
            />

            <label>Firm</label>
            <select
              value={editingPurchase?.firm || ""}
              onChange={(e) =>
                setEditingPurchase({ ...editingPurchase, firm: e.target.value })
              }
              className="w-full p-2 mb-2 border rounded"
            >
              <option value="">Select a Firm</option>
              {firms.map((firm) => (
                <option key={firm._id} value={firm.name}>
                  {firm.name}
                </option>
              ))}
              <option value="Other">Other</option>
            </select>

            <label>Brand</label>
            <select
              value={editingPurchase?.brand || ""}
              onChange={(e) =>
                setEditingPurchase({
                  ...editingPurchase,
                  brand: e.target.value,
                })
              }
              className="w-full p-2 mb-2 border rounded"
            >
              <option value="">Select a Brand</option>
              {brands.map((brand) => (
                <option key={brand._id} value={brand.name}>
                  {brand.name}
                </option>
              ))}
              <option value="Other">Other</option>
            </select>

            <label>Purchased By</label>
            <select
              value={editingPurchase?.purchasedBy || ""}
              onChange={(e) =>
                setEditingPurchase({
                  ...editingPurchase,
                  purchasedBy: e.target.value,
                })
              }
              className="w-full p-2 mb-2 border rounded"
            >
              <option value="">Select User</option>
              {users.map((user) => (
                <option key={user._id} value={user.username}>
                  {user.username}
                </option>
              ))}
              <option value="Other">Other</option>
            </select>

            {/* Add more form fields for other attributes like quantity, price, etc. */}
            <div className="flex justify-end mt-4 space-x-2">
              <button
                onClick={savePurchaseDetails}
                className="px-4 py-2 text-white bg-green-500 rounded"
              >
                Save
              </button>
              <button
                onClick={closeModal}
                className="px-4 py-2 text-white bg-red-500 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <ConfirmDialog
        confirmOpen={confirmOpen}
        setConfirmOpen={setConfirmOpen}
        deleteProduct={deletePurchase}
      />
    </>
  );
}
