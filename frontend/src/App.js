import React, { useState, useEffect } from 'react';

function ProductDashboard() {
  const [products, setProducts] = useState([]);
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState('');

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

  const deleteProduct = (id) => {
    fetch(`/api/products/${id}/`, { method: 'DELETE' })
      .then(() => setProducts(products.filter(p => p.id !== id)));
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
        {products.map(p => (
          <li key={p.id}>
            {p.name} — {p.quantity}  
            <button onClick={() => deleteProduct(p.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ProductDashboard;
