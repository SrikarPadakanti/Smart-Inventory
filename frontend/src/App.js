import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function ProductDashboard() {
  const [products, setProducts] = useState([]);
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [editingProductId, setEditingProductId] = useState(null);
  const [editedName, setEditedName] = useState('');
  const [editedQuantity, setEditedQuantity] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState('');

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
      body: JSON.stringify({ name, quantity: Number(quantity) }),
    })
      .then(res => res.json())
      .then(newProduct => {
        setProducts([...products, newProduct]);
        setName('');
        setQuantity('');
        showToast('Product added!');
      });
  };

  const deleteProduct = async (id) => {
    try {
      const response = await fetch(`/api/products/${id}/`, {
        method: 'DELETE',
      });
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
  };

  const updateProduct = async (id) => {
    try {
      const response = await fetch(`/api/products/${id}/`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: editedName,
          quantity: editedQuantity,
        }),
      });
      if (response.ok) {
        const updatedProduct = await response.json();
        setProducts(products.map((p) => (p.id === id ? updatedProduct : p)));
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
      case 'name-asc':
        return [...products].sort((a, b) => a.name.localeCompare(b.name));
      case 'name-desc':
        return [...products].sort((a, b) => b.name.localeCompare(a.name));
      case 'quantity-asc':
        return [...products].sort((a, b) => a.quantity - b.quantity);
      case 'quantity-desc':
        return [...products].sort((a, b) => b.quantity - a.quantity);
      default:
        return products;
    }
  };

  const filteredProducts = handleSort(
    products.filter((product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

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
      <button onClick={addProduct}>Add Product</button>

      <div style={{ marginTop: '20px' }}>
        <input
          placeholder="Search by name"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
        />

        <select value={sortOption} onChange={(e) => setSortOption(e.target.value)}>
          <option value="">Sort By</option>
          <option value="name-asc">Name (A-Z)</option>
          <option value="name-desc">Name (Z-A)</option>
          <option value="quantity-asc">Quantity (Low to High)</option>
          <option value="quantity-desc">Quantity (High to Low)</option>
        </select>
      </div>

      <ul>
        {filteredProducts.map((product) => (
          <div key={product.id}>
            {editingProductId === product.id ? (
              <>
                <input
                  type="text"
                  value={editedName}
                  onChange={(e) => setEditedName(e.target.value)}
                />
                <input
                  type="number"
                  value={editedQuantity}
                  onChange={(e) => setEditedQuantity(e.target.value)}
                />
                <button onClick={() => updateProduct(product.id)}>Save</button>
                <button onClick={() => setEditingProductId(null)}>Cancel</button>
              </>
            ) : (
              <>
                {product.name} — {product.quantity}
                <button onClick={() => startEditing(product)}>Edit</button>
                <button onClick={() => deleteProduct(product.id)}>Delete</button>
              </>
            )}
          </div>
        ))}
      </ul>
      <ToastContainer />
    </div>
  );
}

export default ProductDashboard;
