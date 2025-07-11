import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';

function ProductDashboard() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 5;

  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [category, setCategory] = useState('');

  const [searchTerm, setSearchTerm] = useState('');
  const [sortKey, setSortKey] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [stockFilter, setStockFilter] = useState('all');

  const [editingProductId, setEditingProductId] = useState(null);
  const [editedName, setEditedName] = useState('');
  const [editedQuantity, setEditedQuantity] = useState('');
  const [editedCategory, setEditedCategory] = useState('');

  useEffect(() => {
    fetch('/api/products/')
      .then(res => res.json())
      .then(data => {
        setProducts(data);
        setFilteredProducts(data);
      });
  }, []);

  useEffect(() => {
    let updated = [...products];

    if (searchTerm) {
      updated = updated.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (stockFilter !== 'all') {
      updated = updated.filter(product => product.stock_status === stockFilter);
    }

    updated.sort((a, b) => {
      let valA = a[sortKey];
      let valB = b[sortKey];
      if (typeof valA === 'string') valA = valA.toLowerCase();
      if (typeof valB === 'string') valB = valB.toLowerCase();
      if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
      if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    setFilteredProducts(updated);
    setCurrentPage(1); // Reset to first page when filter changes
  }, [products, searchTerm, sortKey, sortOrder, stockFilter]);

  // Pagination calculations
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const addProduct = () => {
    if (!name || !quantity) return alert('Please enter product name and quantity');
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
      });
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
    setEditedCategory(product.category || '');
  };

  const updateProduct = async (id) => {
    if (!editedName || !editedQuantity) return alert('Name and quantity required');
    try {
      const response = await fetch(`/api/products/${id}/`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: editedName,
          quantity: Number(editedQuantity),
          category: editedCategory,
        }),
      });
      if (response.ok) {
        const updatedProduct = await response.json();
        setProducts(
          products.map(product =>
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

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    const date = new Date(dateStr);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  const exportToExcel = () => {
    const exportData = filteredProducts.map(({ id, name, quantity, category, date_added, stock_status }) => ({
      ID: id,
      Name: name,
      Quantity: quantity,
      Category: category || 'N/A',
      'Date Added': formatDate(date_added),
      'Stock Status': stock_status.replace(/_/g, ' '),
    }));
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Products');
    XLSX.writeFile(workbook, 'SmartInventory_Products.xlsx');
  };

  return (
    <div style={{ maxWidth: 600, margin: 'auto', fontFamily: 'Arial, sans-serif' }}>
      <h1>Smart Inventory Dashboard</h1>

      {/* Add Product */}
      <div style={{ marginBottom: '1rem' }}>
        <input placeholder="Product Name" value={name} onChange={e => setName(e.target.value)} style={{ marginRight: 8 }} />
        <input placeholder="Quantity" type="number" value={quantity} onChange={e => setQuantity(e.target.value)} style={{ marginRight: 8, width: 80 }} />
        <input placeholder="Category" value={category} onChange={e => setCategory(e.target.value)} style={{ marginRight: 8 }} />
        <button onClick={addProduct}>Add Product</button>
      </div>

      {/* Filters and Sorting */}
      <div style={{ marginBottom: '1rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <input type="search" placeholder="Search products..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} style={{ flexGrow: 1 }} />
        <select value={stockFilter} onChange={e => setStockFilter(e.target.value)}>
          <option value="all">All Stock Status</option>
          <option value="in_stock">In Stock</option>
          <option value="low_stock">Low Stock</option>
          <option value="out_of_stock">Out of Stock</option>
        </select>
        <select value={sortKey} onChange={e => setSortKey(e.target.value)}>
          <option value="name">Sort by Name</option>
          <option value="quantity">Sort by Quantity</option>
          <option value="date_added">Sort by Date Added</option>
          <option value="category">Sort by Category</option>
          <option value="stock_status">Sort by Stock Status</option>
        </select>
        <select value={sortOrder} onChange={e => setSortOrder(e.target.value)}>
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
        <button onClick={exportToExcel} style={{ whiteSpace: 'nowrap' }}>Export to Excel</button>
      </div>

      {/* Product List */}
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {currentProducts.map(product => (
          <li key={product.id} style={{ borderBottom: '1px solid #ddd', padding: '8px 0' }}>
            {editingProductId === product.id ? (
              <>
                <input type="text" value={editedName} onChange={e => setEditedName(e.target.value)} style={{ marginRight: 8 }} />
                <input type="number" value={editedQuantity} onChange={e => setEditedQuantity(e.target.value)} style={{ marginRight: 8, width: 80 }} />
                <input type="text" value={editedCategory} onChange={e => setEditedCategory(e.target.value)} style={{ marginRight: 8 }} />
                <button onClick={() => updateProduct(product.id)} style={{ marginRight: 4 }}>Save</button>
                <button onClick={() => setEditingProductId(null)}>Cancel</button>
              </>
            ) : (
              <>
                <strong>{product.name}</strong> — Qty: {product.quantity} — Category: {product.category || 'N/A'} — Added: {formatDate(product.date_added)} — Status: <em>{product.stock_status.replace(/_/g, ' ')}</em>
                <button onClick={() => startEditing(product)} style={{ marginLeft: 8 }}>Edit</button>
                <button onClick={() => deleteProduct(product.id)} style={{ marginLeft: 4 }}>Delete</button>
              </>
            )}
          </li>
        ))}
      </ul>

      {/* Pagination Controls */}
      <div style={{ marginTop: '1rem', textAlign: 'center' }}>
        <button onClick={() => paginate(Math.max(currentPage - 1, 1))} disabled={currentPage === 1}>Prev</button>

        {[...Array(totalPages)].map((_, i) => (
          <button
            key={i + 1}
            onClick={() => paginate(i + 1)}
            style={{
              fontWeight: currentPage === i + 1 ? 'bold' : 'normal',
              margin: '0 4px',
            }}
          >
            {i + 1}
          </button>
        ))}

        <button onClick={() => paginate(Math.min(currentPage + 1, totalPages))} disabled={currentPage === totalPages}>Next</button>
      </div>
    </div>
  );
}

export default ProductDashboard;
