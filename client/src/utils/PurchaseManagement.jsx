import React, { useEffect, useState } from "react";
import apiClient from "../services/apiClient"; // API client for requests
import { FaEdit, FaTrashAlt, FaPlusCircle } from "react-icons/fa";
import ConfirmDialog from "./ConfirmDialog"; // Confirm Dialog for delete actions

export default function PurchaseManagement() {
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPurchase, setEditingPurchase] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedPurchaseForDelete, setSelectedPurchaseForDelete] =
    useState(null);

  useEffect(() => {
    const fetchPurchases = async () => {
      try {
        const response = await apiClient.get("/api/purchases");
        setPurchases(response.data.data);
        setLoading(false);
      } catch (error) {
        setError("Error fetching purchases");
        setLoading(false);
      }
    };
    fetchPurchases();
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

      <table className="min-w-full bg-white border rounded-lg shadow">
        <thead>
          <tr>
            <th className="p-4 border">Date</th>
            <th className="p-4 border">Firm</th>
            <th className="p-4 border">Brand</th>
            <th className="p-4 border">Product</th>
            <th className="p-4 border">Quantity</th>
            <th className="p-4 border">Purchase Price</th>
            <th className="p-4 border">Total</th>
            <th className="p-4 border">Notes</th>
            <th className="p-4 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {purchases.map((purchase) => (
            <tr key={purchase._id} className="text-center">
              <td className="p-4 border">{purchase.date}</td>
              <td className="p-4 border">{purchase.firm}</td>
              <td className="p-4 border">{purchase.brand}</td>
              <td className="p-4 border">{purchase.product}</td>
              <td className="p-4 border">{purchase.quantity}</td>
              <td className="p-4 border">${purchase.purchasePrice}</td>
              <td className="p-4 border">${purchase.total}</td>
              <td className="p-4 border">{purchase.notes}</td>
              <td className="flex justify-center p-4 space-x-2 border">
                <button
                  onClick={() => openEditModal(purchase)}
                  className="text-blue-500"
                >
                  <FaEdit />
                </button>
                <button
                  onClick={() => confirmDeletePurchase(purchase)}
                  className="text-red-500"
                >
                  <FaTrashAlt />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

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
            <input
              type="text"
              name="firm"
              value={editingPurchase?.firm || ""}
              onChange={(e) =>
                setEditingPurchase({ ...editingPurchase, firm: e.target.value })
              }
              className="w-full p-2 mb-2 border rounded"
            />
            {/* Add additional fields for brand, product, quantity, price, etc. */}

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

      {/* Confirm Dialog for Deleting a Purchase */}
      <ConfirmDialog
        confirmOpen={confirmOpen}
        setConfirmOpen={setConfirmOpen}
        deleteProduct={deletePurchase}
      />
    </>
  );
}
