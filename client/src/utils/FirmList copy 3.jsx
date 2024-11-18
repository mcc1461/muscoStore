import React, { useEffect, useState } from "react";
import { FaEdit, FaTrashAlt, FaPlusCircle } from "react-icons/fa";
import { Dialog, Transition } from "@headlessui/react";
import apiClient from "../services/apiClient";

export default function FirmsList() {
  const [firms, setFirms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingFirm, setEditingFirm] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [isAddingNewFirm, setIsAddingNewFirm] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedFirmForDelete, setSelectedFirmForDelete] = useState(null);
  const [expandedFirms, setExpandedFirms] = useState({});
  const [formError, setFormError] = useState(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(6); // Default items per page

  // Define estimated card width and height (in pixels)
  const CARD_WIDTH = 300; // Approximate width of each card in pixels
  const CARD_HEIGHT = 400; // Approximate height of each card in pixels (including spacing)

  // Header height (you might have this value based on your layout)
  const HEADER_HEIGHT = 100; // Adjust this based on your actual header size

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

    // Function to calculate itemsPerPage based on screen size
    const calculateItemsPerPage = () => {
      const screenWidth = window.innerWidth;
      const screenHeight = window.innerHeight - HEADER_HEIGHT; // Subtract the height of the header

      // Calculate how many cards fit in a row based on the screen width
      const cardsPerRow = Math.floor(screenWidth / CARD_WIDTH);

      // Calculate how many rows fit on the screen based on the remaining height
      const rowsPerPage = Math.floor(screenHeight / CARD_HEIGHT);

      // Total items per page (cards per row * rows per page)
      const totalItems = cardsPerRow * rowsPerPage;

      setItemsPerPage(totalItems > 0 ? totalItems : 1); // Ensure at least one item is shown
    };

    // Initial setting of itemsPerPage
    calculateItemsPerPage();

    // Add event listener for window resize to adjust itemsPerPage dynamically
    window.addEventListener("resize", calculateItemsPerPage);

    // Cleanup the event listener on component unmount
    return () => window.removeEventListener("resize", calculateItemsPerPage);
  }, []);

  const confirmDeleteFirm = (firm) => {
    setSelectedFirmForDelete(firm);
    setConfirmOpen(true);
  };

  const deleteFirm = async () => {
    try {
      await apiClient.delete(`/api/firms/${selectedFirmForDelete._id}`);
      setFirms((prevFirms) =>
        prevFirms.filter((firm) => firm._id !== selectedFirmForDelete._id)
      );
      setConfirmOpen(false);
    } catch (error) {
      console.error("Error deleting the firm:", error);
    }
  };

  const openEditModal = (firm) => {
    setEditingFirm(firm);
    setIsAddingNewFirm(false);
    setModalOpen(true);
    setFormError(null);
  };

  const openAddNewModal = () => {
    setEditingFirm({ name: "", image: "", phone: "", address: "" });
    setIsAddingNewFirm(true);
    setModalOpen(true);
    setFormError(null);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingFirm(null);
    setFormError(null);
  };

  const saveFirmDetails = async () => {
    try {
      if (!editingFirm.name || !editingFirm.image) {
        setFormError("Firm name and image are required.");
        return;
      }

      if (isAddingNewFirm) {
        // POST request to add a new firm
        const response = await apiClient.post("/api/firms", editingFirm);
        setFirms([...firms, response.data.data]); // Add new firm to the list
      } else {
        // PUT request to update an existing firm
        const updateResponse = await apiClient.put(
          `/api/firms/${editingFirm._id}`,
          editingFirm
        );

        // If update was successful, update the firm in the state
        if (updateResponse.status === 202 || updateResponse.status === 200) {
          setFirms((prevFirms) =>
            prevFirms.map((firm) =>
              firm._id === editingFirm._id ? { ...editingFirm } : firm
            )
          );
        } else {
          throw new Error("Failed to update the firm.");
        }
      }

      closeModal(); // Close the modal after saving
    } catch (error) {
      console.error("Error saving the firm:", error);
      setFormError(
        error.response?.data?.message ||
          "Error saving the firm. Please try again."
      );
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditingFirm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const toggleDetails = (id) => {
    setExpandedFirms((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const hideDetails = (id) => {
    setExpandedFirms((prev) => ({
      ...prev,
      [id]: false,
    }));
  };

  const filteredFirms = firms.filter((firm) =>
    firm?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination logic
  const indexOfLastFirm = currentPage * itemsPerPage;
  const indexOfFirstFirm = indexOfLastFirm - itemsPerPage;
  const currentFirms = filteredFirms.slice(indexOfFirstFirm, indexOfLastFirm);
  const totalPages = Math.ceil(filteredFirms.length / itemsPerPage);

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  if (loading) {
    return <p>Loading firms...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <>
      <div className="sticky top-0 z-10 bg-blue-500 shadow-md">
        <div className="flex items-center justify-between px-4 py-4 text-white">
          <h1 className="text-3xl font-bold">Firms ({filteredFirms.length})</h1>
        </div>

        <div className="flex items-center justify-between px-4 py-2 bg-blue-500">
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
      </div>

      {/* Pagination Controls at the Top */}
      <nav
        aria-label="Pagination"
        className="flex items-center justify-between px-4 py-3 bg-white border-b border-gray-200 sm:px-6"
      >
        <div className="hidden sm:block">
          <p className="text-sm text-gray-700">
            Showing <span className="font-medium">{indexOfFirstFirm + 1}</span>{" "}
            to{" "}
            <span className="font-medium">
              {indexOfLastFirm > filteredFirms.length
                ? filteredFirms.length
                : indexOfLastFirm}
            </span>{" "}
            of <span className="font-medium">{filteredFirms.length}</span>{" "}
            results
          </p>
        </div>
        <div className="flex justify-between flex-1 sm:justify-end">
          <button
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
            className="relative inline-flex items-center px-3 py-2 text-sm font-semibold text-gray-900 bg-white rounded-md ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus-visible:outline-offset-0"
          >
            Previous
          </button>
          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className="relative inline-flex items-center px-3 py-2 ml-3 text-sm font-semibold text-gray-900 bg-white rounded-md ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus-visible:outline-offset-0"
          >
            Next
          </button>
        </div>
      </nav>

      {currentFirms.length > 0 ? (
        <>
          <div
            className="grid gap-6 px-4 py-6"
            style={{
              gridTemplateColumns: `repeat(auto-fit, minmax(${CARD_WIDTH}px, 1fr))`, // Automatically fit the cards in the row
            }}
          >
            {currentFirms.map((firm) => (
              <div
                key={firm._id}
                className="overflow-hidden transition-transform duration-300 transform bg-gray-100 rounded-lg shadow-lg hover:scale-105"
                onMouseLeave={() => hideDetails(firm._id)}
              >
                <div className="flex items-center justify-center h-56 bg-white">
                  <img
                    src={firm.image}
                    alt={firm.name}
                    className="object-contain w-full h-full p-4"
                  />
                </div>
                <div className="p-6 text-center">
                  <button
                    onClick={() => toggleDetails(firm._id)}
                    className="font-semibold text-indigo-500 hover:text-indigo-600"
                  >
                    {expandedFirms[firm._id] ? "Hide Details" : "View Details"}
                  </button>

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

                <div className="flex justify-center p-4">
                  <button
                    className="mr-3 text-blue-500 hover:text-blue-700"
                    onClick={() => openEditModal(firm)}
                  >
                    <FaEdit className="w-5 h-5" />
                  </button>
                  <button
                    className="text-red-500 hover:text-red-700"
                    onClick={() => confirmDeleteFirm(firm)}
                  >
                    <FaTrashAlt className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <p className="text-center text-gray-600">
          No firms found for your search.
        </p>
      )}

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="p-8 bg-white rounded-lg shadow-lg w-96">
            <h2 className="mb-4 text-2xl font-bold">
              {isAddingNewFirm ? "Add New Firm" : "Edit Firm"}
            </h2>

            {formError && <p className="mb-4 text-red-500">{formError}</p>}

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
