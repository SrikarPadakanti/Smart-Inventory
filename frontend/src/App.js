import React, { useEffect, useState } from 'react';

function App() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/products/') // Adjust endpoint as per your actual API
      .then(response => response.json())
      .then(data => setProducts(data))
      .catch(error => console.error("Error fetching products:", error));
  }, []);

  return (
    <div>
      <h1>Smart Inventory Dashboard</h1>
      <ul>
        {products.map((item, index) => (
          <li key={index}>{item.name} — {item.quantity}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
