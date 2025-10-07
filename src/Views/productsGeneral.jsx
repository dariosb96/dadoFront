import { useDispatch, useSelector } from "react-redux";
import { getProducts } from "../Redux/actions/Products/get_products";
import { updateProduct } from "../Redux/actions/Products/edit_product";
import { deleteProduct } from "../Redux/actions/Products/delete_product";
import { Link } from "react-router-dom";
import React, { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import EditProductModal from "../components/editProd";
import Navbar from "../components/NavBar";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


const AllProductsPage = () => {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  const { products, loading, error } = useSelector((state) => state.products);

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    if (token) {
      dispatch(getProducts(token));
    }
  }, [dispatch, token]);

  const handleEdit = (product) => {
    setSelectedProduct(product);
    setModalOpen(true);
  };

  const handleDelete = (id) => {
    dispatch(deleteProduct(id, token));
    toast.success("Producto eliminado correctamente");
  };

  const handleSave = (id, formData) => {
    // formData es un FormData que incluye la imagen
    dispatch(updateProduct(id, formData));
    toast.success("Producto actualizado correctamente");
    setModalOpen(false);
    setSelectedProduct(null);
  };

  if (loading) return <p>Cargando productos...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;

  return (
    <div className="p-4">
       <Link to="/" aria-label="Volver al inicio">
        <div className="absolute top-4 left-4 z-10">
          <button
            type="button"
            className="bg-purple-800 hover:bg-gray-500 text-white font-medium px-3 py-1 rounded-md text-sm transition duration-600"
          >
            ← Inicio
          </button>
        </div>
      </Link>
      <ToastContainer />
      <Navbar />
      <h1 className="text-2xl font-bold mb-4 text-white">Todos los productos</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-black">
        {products?.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onEdit={handleEdit}
            onDelete={() => handleDelete(product.id)}
          />
        ))}
      </div>

      <EditProductModal
        product={selectedProduct}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
      />
    </div>
  );
};

export default AllProductsPage;
