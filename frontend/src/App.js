import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function ProductDashboard() {
  const [products, setProducts] = useState([]);
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [editingProductId, setEditingProductId] = useState(null);
  const [editedName, setEditedName] = useState('');
  const [editedQuantity, setEditedQuantity] = useState('');

  useEffect(() => {
    fetch('/api/products/')
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(() => toast.error('Failed to fetch products'));
  }, []);

  const addProduct = () => {
    if (!name.trim() || quantity === '' || Number(quantity) < 0) {
      toast.error('Please provide valid product details');
      return;
    }

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
        toast.success('Product added!');
      })
      .catch(() => toast.error('Failed to add product'));
  };

  const deleteProduct = async (id) => {
    try {
      const response = await fetch(`/api/products/${id}/`, {
        method: 'DELETE',
      });

      if (response.status === 204) {
        setProducts(products.filter(product => product.id !== id));
        toast.success('Product deleted');
      } else {
        toast.error('Failed to delete product');
      }
    } catch (err) {
      toast.error('Error deleting product');
    }
  };

  const startEditing = (product) => {
    setEditingProductId(product.id);
    setEditedName(product.name);
    setEditedQuantity(product.quantity);
  };

  const updateProduct = async (id) => {
    if (!editedName.trim() || editedQuantity === '' || Number(editedQuantity) < 0) {
      toast.error('Invalid update values');
      return;
    }

    try {
      const response = await fetch(`/api/products/${id}/`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: editedName, quantity: Number(editedQuantity) }),
      });

      if (response.ok) {
        const updatedProduct = await response.json();
        setProducts(products.map(product => product.id === id ? updatedProduct : product));
        setEditingProductId(null);
        toast.success('Product updated!');
      } else {
        toast.error('Update failed');
      }
    } catch (err) {
      toast.error('Error updating product');
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>📦 Smart Inventory Dashboard</h1>

      <div style={{ marginBottom: '15px' }}>
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
      </div>

      <ul>
        {products.map((product) => (
          <li key={product.id} style={{ marginBottom: '10px' }}>
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
                <strong>{product.name}</strong> — {product.quantity}
                <button onClick={() => startEditing(product)}>Edit</button>
                <button onClick={() => deleteProduct(product.id)}>Delete</button>
              </>
            )}
          </li>
        ))}
      </ul>

      <ToastContainer position="bottom-right" />
    </div>
  );
}

export default ProductDashboard;
