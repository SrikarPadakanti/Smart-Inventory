import React, { useState, useEffect } from 'react';

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
      .then(data => setProducts(data));
  }, []);

  const addProduct = () => {
    fetch('/api/products/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, quantity: Number(quantity) }),
    })
      .then(res => res.json())
      .then(newProduct => setProducts([...products, newProduct]));
  };

  const deleteProduct = async (id) => {
  try {
    const response = await fetch(`/api/products/${id}/`, {
      method: 'DELETE',
    });
    if (response.status === 204) {
      setProducts(products.filter(product => product.id !== id));
    } else {
      console.error('Failed to delete product');
    }
  } catch (err) {
    console.error('Error:', err);
  }
};

const startEditing = (product) => {
  setEditingProductId(product.id);
  setEditedName(product.name);
  setEditedQuantity(product.quantity);
};

const updateProduct = async (id) => {
  try {
    const response = await fetch(`http://localhost:8000/api/products/${id}/`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: editedName,
        quantity: editedQuantity,
      }),
    });
    if (response.ok) {
      const updatedProduct = await response.json();
      setProducts(
        products.map((product) =>
          product.id === id ? updatedProduct : product
        )
      );
      setEditingProductId(null);
    } else {
      console.error('Update failed');
    }
  } catch (err) {
    console.error('Error:', err);
  }
};



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

      <ul>
        {products.map((product) => (
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
    </div>
  );
}

export default ProductDashboard;
