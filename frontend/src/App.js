import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function ProductDashboard() {
  const [products, setProducts] = useState([]);
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [category, setCategory] = useState(''); // New category input
  const [editingProductId, setEditingProductId] = useState(null);
  const [editedName, setEditedName] = useState('');
  const [editedQuantity, setEditedQuantity] = useState('');
  const [editedCategory, setEditedCategory] = useState(''); // Edited category
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All'); // Category filter

  const [currentPage, setCurrentPage] = useState(1);
  const PRODUCTS_PER_PAGE = 5;

  useEffect(() => {
    fetch('/api/products/')
      .then(res => res.json())
      .then(data => setProducts(data));
  }, []);

  const showToast = (message, type = 'success') => {
    toast[type](message, { position: 'top-right', autoClose: 2000 });
  };

  const addProduct = () => {
    fetch('/api/products/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, quantity: Number(quantity), category }),
    })
      .then(res => res.json())
      .then(newProduct => {
        setProducts([...products, newProduct]);
        setName('');
        setQuantity('');
        setCategory('');
        showToast('Product added!');
      });
  };

  const deleteProduct = async (id) => {
    try {
      const response = await fetch(`/api/products/${id}/`, { method: 'DELETE' });
      if (response.status === 204) {
        setProducts(products.filter(product => product.id !== id));
        showToast('Product deleted!');
      } else {
        showToast('Failed to delete product', 'error');
      }
    } catch (err) {
      console.error('Error:', err);
      showToast('Error occurred while deleting', 'error');
    }
  };

  const startEditing = (product) => {
    setEditingProductId(product.id);
    setEditedName(product.name);
    setEditedQuantity(product.quantity);
    setEditedCategory(product.category || ''); // Set editing category
  };

  const updateProduct = async (id) => {
    try {
      const response = await fetch(`/api/products/${id}/`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: editedName,
          quantity: editedQuantity,
          category: editedCategory,
        }),
      });
      if (response.ok) {
        const updatedProduct = await response.json();
        setProducts(products.map(p => (p.id === id ? updatedProduct : p)));
        setEditingProductId(null);
        showToast('Product updated!');
      } else {
        showToast('Update failed', 'error');
      }
    } catch (err) {
      console.error('Error:', err);
      showToast('Error occurred while updating', 'error');
    }
  };

  const handleSort = (products) => {
    switch (sortOption) {
      case 'name-asc': return [...products].sort((a, b) => a.name.localeCompare(b.name));
      case 'name-desc': return [...products].sort((a, b) => b.name.localeCompare(a.name));
      case 'quantity-asc': return [...products].sort((a, b) => a.quantity - b.quantity);
      case 'quantity-desc': return [...products].sort((a, b) => b.quantity - a.quantity);
      default: return products;
    }
  };

  // Filter by search and category filter
  let filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
    (categoryFilter === 'All' || product.category === categoryFilter)
  );

  filteredProducts = handleSort(filteredProducts);

  // Pagination calculation
  const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * PRODUCTS_PER_PAGE,
    currentPage * PRODUCTS_PER_PAGE
  );

  const categories = ['All', ...new Set(products.map(p => p.category).filter(Boolean))]; // unique categories

  return (
    <div>
      <h1>Smart Inventory Dashboard</h1>

      <input
        placeholder="Product Name"
        value={name}
        onChange={e => setName(e.target.value)}
      />
      <input
        placeholder="Quantity"
        type="number"
        value={quantity}
        onChange={e => setQuantity(e.target.value)}
      />
      <input
        placeholder="Category"
        value={category}
        onChange={e => setCategory(e.target.value)}
      />
      <button onClick={addProduct}>Add Product</button>

      <div style={{ marginTop: '20px' }}>
        <input
          placeholder="Search by name"
          value={searchQuery}
          onChange={e => {
            setSearchQuery(e.target.value);
            setCurrentPage(1); // Reset page on search change
          }}
        />

        <select
          value={categoryFilter}
          onChange={e => {
            setCategoryFilter(e.target.value);
            setCurrentPage(1);
          }}
        >
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>

        <select
          value={sortOption}
          onChange={e => {
            setSortOption(e.target.value);
            setCurrentPage(1);
          }}
        >
          <option value="">Sort By</option>
          <option value="name-asc">Name (A-Z)</option>
          <option value="name-desc">Name (Z-A)</option>
          <option value="quantity-asc">Quantity (Low to High)</option>
          <option value="quantity-desc">Quantity (High to Low)</option>
        </select>
      </div>

      <ul>
        {paginatedProducts.map(product => (
          <div key={product.id}>
            {editingProductId === product.id ? (
              <>
                <input
                  type="text"
                  value={editedName}
                  onChange={e => setEditedName(e.target.value)}
                />
                <input
                  type="number"
                  value={editedQuantity}
                  onChange={e => setEditedQuantity(e.target.value)}
                />
                <input
                  type="text"
                  value={editedCategory}
                  onChange={e => setEditedCategory(e.target.value)}
                />
                <button onClick={() => updateProduct(product.id)}>Save</button>
                <button onClick={() => setEditingProductId(null)}>Cancel</button>
              </>
            ) : (
              <>
                <b>{product.name}</b> — {product.quantity} — <i>{product.category || 'No Category'}</i>
                <button onClick={() => startEditing(product)}>Edit</button>
                <button onClick={() => deleteProduct(product.id)}>Delete</button>
              </>
            )}
          </div>
        ))}
      </ul>

      {/* Pagination Controls */}
      <div style={{ marginTop: '10px' }}>
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
        >
          Prev
        </button>
        <span style={{ margin: '0 10px' }}>
          Page {currentPage} of {totalPages || 1}
        </span>
        <button
          disabled={currentPage === totalPages || totalPages === 0}
          onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
        >
          Next
        </button>
      </div>

      <ToastContainer />
    </div>
  );
}

export default ProductDashboard;
