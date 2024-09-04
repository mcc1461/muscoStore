import React, { useEffect, useState } from "react";
import { FaEdit, FaTrashAlt, FaPlusCircle } from "react-icons/fa";
import { Dialog, Transition } from "@headlessui/react";
import apiClient from "../services/apiClient"; // apiClient

export default function FirmsList() {
  const [firms, setFirms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState(""); // Ensure searchTerm is initialized as an empty string
  const [editingFirm, setEditingFirm] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [isAddingNewFirm, setIsAddingNewFirm] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedFirmForDelete, setSelectedFirmForDelete] = useState(null);
  const [expandedFirms, setExpandedFirms] = useState({}); // Track expanded details

  useEffect(() => {
    const fetchFirms = async () => {
      try {
        const response = await apiClient.get("/api/firms");
        setFirms(response.data.data);
        setLoading(false);
      } catch (error) {
        setError("Error fetching firms");
        setLoading(false);
      }
    };

    fetchFirms();
  }, []);

  // Delete a firm with confirmation modal
  const confirmDeleteFirm = (firm) => {
    setSelectedFirmForDelete(firm);
    setConfirmOpen(true); // Open the confirm dialog
  };

  const deleteFirm = async () => {
    try {
      await apiClient.delete(`/api/firms/${selectedFirmForDelete._id}`);
      setFirms(firms.filter((firm) => firm._id !== selectedFirmForDelete._id)); // Remove deleted firm
      setConfirmOpen(false); // Close confirm modal
    } catch (error) {
      console.error("Error deleting the firm:", error);
    }
  };

  // Open modal to edit a firm
  const openEditModal = (firm) => {
    setEditingFirm(firm);
    setIsAddingNewFirm(false); // Ensure it's not in "Add New" mode
    setModalOpen(true); // Open the modal
  };

  // Open modal to add a new firm
  const openAddNewModal = () => {
    setEditingFirm({ name: "", image: "", phone: "", address: "" }); // Empty form for new firm
    setIsAddingNewFirm(true); // Switch to "Add New" mode
    setModalOpen(true);
  };

  // Close modal
  const closeModal = () => {
    setModalOpen(false);
    setEditingFirm(null);
  };

  // Save edited or new firm details
  const saveFirmDetails = async () => {
    try {
      if (isAddingNewFirm) {
        // POST request to add a new firm
        const response = await apiClient.post("/api/firms", editingFirm);
        setFirms([...firms, response.data]); // Add new firm to list without reload
      } else {
        // PUT request to update an existing firm
        await apiClient.put(`/api/firms/${editingFirm._id}`, editingFirm);
        setFirms((prevFirms) =>
          prevFirms.map((firm) =>
            firm._id === editingFirm._id ? editingFirm : firm
          )
        );
      }
      closeModal(); // Close modal after saving
    } catch (error) {
      console.error("Error saving the firm:", error);
    }
  };

  // Handle input change in the modal form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditingFirm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Toggle details on button click
  const toggleDetails = (id) => {
    setExpandedFirms((prev) => ({
      ...prev,
      [id]: !prev[id], // Toggle the state for the specific firm
    }));
  };

  // Hide details when mouse leaves the card
  const hideDetails = (id) => {
    setExpandedFirms((prev) => ({
      ...prev,
      [id]: false, // Set the state to false when mouse leaves
    }));
  };

  // Filter firms based on the search term, ensuring firm.name is defined
  const filteredFirms = firms.filter((firm) =>
    firm?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <p>Loading firms...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <>
      {/* Add New Firm Button */}
      <div className="flex items-center justify-between px-4 py-2">
        {/* Search Input */}
        <input
          type="text"
          placeholder="Search firms..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-1/2 px-4 py-2 border rounded-lg focus:ring focus:ring-indigo-200"
        />

        <button
          onClick={openAddNewModal}
          className="px-4 py-2 text-white bg-green-500 rounded-lg hover:bg-green-600"
        >
          <FaPlusCircle className="inline-block mr-2" /> Add New Firm
        </button>
      </div>

      {/* Firms List */}
      {filteredFirms.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 px-4 py-6 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
          {filteredFirms.map((firm) => (
            <div
              key={firm._id}
              className="overflow-hidden transition-transform duration-300 transform bg-gray-100 rounded-lg shadow-lg hover:scale-105"
              onMouseLeave={() => hideDetails(firm._id)} // Hide details on mouse leave
            >
              {/* Logo and Name */}
              <div className="flex items-center justify-center h-56 bg-white">
                <img
                  src={firm.image}
                  alt={firm.name}
                  className="object-contain w-full h-full p-4"
                />
              </div>
              <div className="p-6 text-center">
                {/* View Details Button */}
                <button
                  onClick={() => toggleDetails(firm._id)}
                  className="font-semibold text-indigo-500 hover:text-indigo-600"
                >
                  {expandedFirms[firm._id] ? "Hide Details" : "View Details"}
                </button>

                {/* Details Section (Visible only if expanded) */}
                {expandedFirms[firm._id] && (
                  <div className="mt-4">
                    <h3 className="text-2xl font-semibold text-gray-800">
                      {firm.name}
                    </h3>
                    <p className="text-gray-600">{firm.address}</p>
                    <p className="mt-4 font-medium text-gray-500">
                      Phone: {firm.phone}
                    </p>
                  </div>
                )}
              </div>

              {/* Edit and Delete Icons */}
              <div className="flex justify-center p-4">
                <button
                  className="mr-3 text-blue-500 hover:text-blue-700"
                  onClick={() => openEditModal(firm)} // Open modal to edit firm
                >
                  <FaEdit className="w-5 h-5" />
                </button>
                <button
                  className="text-red-500 hover:text-red-700"
                  onClick={() => confirmDeleteFirm(firm)} // Ask for confirmation before deleting
                >
                  <FaTrashAlt className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-600">
          No firms found for your search.
        </p>
      )}

      {/* Modal for Editing or Adding Firm */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="p-8 bg-white rounded-lg shadow-lg w-96">
            <h2 className="mb-4 text-2xl font-bold">
              {isAddingNewFirm ? "Add New Firm" : "Edit Firm"}
            </h2>

            {/* Logo Section */}
            <div className="mb-4">
              <label className="block mb-2 text-sm font-semibold">Logo</label>
              <div className="flex items-center justify-center mb-4">
                <img
                  src={editingFirm?.image}
                  alt={editingFirm?.name}
                  className="object-contain w-full h-32"
                />
              </div>
              <input
                type="text"
                name="image"
                value={editingFirm?.image || ""}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-indigo-200"
                placeholder="Enter logo URL"
              />
            </div>

            {/* Name */}
            <div className="mb-4">
              <label className="block mb-2 text-sm font-semibold">Name</label>
              <input
                type="text"
                name="name"
                value={editingFirm?.name || ""}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-indigo-200"
              />
            </div>

            {/* Phone */}
            <div className="mb-4">
              <label className="block mb-2 text-sm font-semibold">Phone</label>
              <input
                type="text"
                name="phone"
                value={editingFirm?.phone || ""}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-indigo-200"
              />
            </div>

            {/* Address */}
            <div className="mb-4">
              <label className="block mb-2 text-sm font-semibold">
                Address
              </label>
              <input
                type="text"
                name="address"
                value={editingFirm?.address || ""}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-indigo-200"
              />
            </div>

            {/* Save and Cancel Buttons */}
            <div className="flex justify-end space-x-4">
              <button
                onClick={saveFirmDetails}
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
                Are you sure you want to delete this firm? This action cannot be
                undone.
              </Dialog.Description>

              <div className="flex justify-end mt-4 space-x-4">
                <button
                  onClick={() => setConfirmOpen(false)}
                  className="px-4 py-2 text-white bg-gray-500 rounded-lg hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button
                  onClick={deleteFirm}
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
