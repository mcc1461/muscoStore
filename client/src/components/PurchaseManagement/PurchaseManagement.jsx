// PurchaseManagement.jsx
import React, { useEffect, useState } from "react";
import apiUserClient from "../../services/apiUserClient";
import { FaEdit, FaTrashAlt, FaPlusCircle } from "react-icons/fa";
import PurchaseForm from "./PurchaseForm";
import PurchaseTable from "./PurchaseTable";
import ConfirmDialog from "./ConfirmDialog";
import apiClient from "../../services/apiClient";

export default function PurchaseManagement() {
  // State variables for data
  const [purchases, setPurchases] = useState([]);
  const [firms, setFirms] = useState([]);
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);

  // State variables for user information
  const [currentUserRole, setCurrentUserRole] = useState("");
  const [currentUserId, setCurrentUserId] = useState("");

  // State variables for UI
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPurchase, setEditingPurchase] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedPurchaseForDelete, setSelectedPurchaseForDelete] =
    useState(null);

  // State variables for dropdown selections
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedFirm, setSelectedFirm] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedProduct, setSelectedProduct] = useState("");

  // State variables for filtered lists
  const [filteredFirms, setFilteredFirms] = useState([]);
  const [filteredBrands, setFilteredBrands] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);

  useEffect(() => {
    const role = localStorage.getItem("userRole") || "";
    const userId = localStorage.getItem("currentUserId") || "";
    setCurrentUserRole(role);
    setCurrentUserId(userId);

    const fetchData = async () => {
      try {
        const [
          purchasesResponse,
          firmsResponse,
          brandsResponse,
          categoriesResponse,
          productsResponse,
          usersResponse,
        ] = await Promise.all([
          apiClient.get("/api/purchases", {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }),
          apiClient.get("/api/firms"),
          apiClient.get("/api/brands"),
          apiClient.get("/api/categories"),
          apiClient.get("/api/products"),
          apiUserClient.get("/api/users", {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }),
        ]);

        setPurchases(purchasesResponse.data?.data || []);
        setFirms(firmsResponse.data?.data || []);
        setBrands(brandsResponse.data?.data || []);
        setCategories(categoriesResponse.data?.data || []);
        setProducts(productsResponse.data?.data || []);
        setUsers(usersResponse.data?.data || []);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Error fetching data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter firms based on selected category
  useEffect(() => {
    if (selectedCategory) {
      const filtered = firms.filter((firm) =>
        products.some(
          (product) =>
            product.categoryId === selectedCategory &&
            product.firmId === firm._id
        )
      );
      setFilteredFirms(filtered);
    } else {
      setFilteredFirms(firms);
    }
    // Reset dependent selections
    setSelectedFirm("");
    setSelectedBrand("");
    setSelectedProduct("");
  }, [selectedCategory, firms, products]);

  // Filter brands based on selected category and firm
  useEffect(() => {
    if (selectedCategory && selectedFirm) {
      const filtered = brands.filter((brand) =>
        products.some(
          (product) =>
            product.categoryId === selectedCategory &&
            product.firmId === selectedFirm &&
            product.brandId === brand._id
        )
      );
      setFilteredBrands(filtered);
    } else {
      setFilteredBrands(brands);
    }
    // Reset dependent selections
    setSelectedBrand("");
    setSelectedProduct("");
  }, [selectedCategory, selectedFirm, brands, products]);

  // Filter products based on selected category, firm, and brand
  useEffect(() => {
    if (selectedCategory) {
      const filtered = products.filter((product) => {
        const matchesCategory = product.categoryId === selectedCategory;
        const matchesFirm = !selectedFirm || product.firmId === selectedFirm;
        const matchesBrand =
          !selectedBrand || product.brandId === selectedBrand;
        return matchesCategory && matchesFirm && matchesBrand;
      });
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts(products);
    }
    // Reset dependent selection
    setSelectedProduct("");
  }, [selectedCategory, selectedFirm, selectedBrand, products]);

  const handleSavePurchase = (purchaseData) => {
    if (editingPurchase) {
      setPurchases((prevPurchases) =>
        prevPurchases.map((purchase) =>
          purchase._id === editingPurchase._id ? purchaseData : purchase
        )
      );
    } else {
      setPurchases([...purchases, purchaseData]);
    }
    closeModal();
  };

  const openEditModal = (purchase) => {
    setEditingPurchase(purchase);
    setModalOpen(true);
  };

  const openAddNewModal = () => {
    setEditingPurchase(null);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingPurchase(null);
    // Reset all selections
    setSelectedCategory("");
    setSelectedFirm("");
    setSelectedBrand("");
    setSelectedProduct("");
  };

  const confirmDeletePurchase = (purchase) => {
    setSelectedPurchaseForDelete(purchase);
    setConfirmOpen(true);
  };

  const deletePurchase = async () => {
    try {
      await apiClient.delete(
        `/api/purchases/${selectedPurchaseForDelete._id}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setPurchases(
        purchases.filter(
          (purchase) => purchase._id !== selectedPurchaseForDelete._id
        )
      );
      setConfirmOpen(false);
    } catch (error) {
      console.error("Error deleting the purchase:", error);
      setError("Error deleting the purchase");
    }
  };

  if (loading) return <p>Loading purchases...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Purchase Management</h1>
        <button
          onClick={openAddNewModal}
          className="flex items-center px-4 py-2 text-white bg-green-500 rounded hover:bg-green-600"
        >
          <FaPlusCircle className="mr-2" /> Add New Purchase
        </button>
      </div>

      <PurchaseTable
        purchases={purchases}
        onEdit={openEditModal}
        onDelete={confirmDeletePurchase}
      />

      {modalOpen && (
        <PurchaseForm
          categories={categories}
          filteredFirms={filteredFirms}
          filteredBrands={filteredBrands}
          filteredProducts={filteredProducts}
          editingPurchase={editingPurchase}
          setEditingPurchase={setEditingPurchase}
          closeModal={closeModal}
          handleSavePurchase={handleSavePurchase}
          currentUserRole={currentUserRole}
          currentUserId={currentUserId}
          users={users}
          // Pass the selected states and their setters
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          selectedFirm={selectedFirm}
          setSelectedFirm={setSelectedFirm}
          selectedBrand={selectedBrand}
          setSelectedBrand={setSelectedBrand}
          selectedProduct={selectedProduct}
          setSelectedProduct={setSelectedProduct}
          // Pass the full lists for adding new entries
          allCategories={categories}
          allFirms={firms}
          allBrands={brands}
          allProducts={products}
        />
      )}

      <ConfirmDialog
        confirmOpen={confirmOpen}
        setConfirmOpen={setConfirmOpen}
        deleteProduct={deletePurchase}
      />
    </>
  );
}
