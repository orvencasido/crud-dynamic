import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [items, setItems] = useState([]);
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const res = await axios.get('http://54.206.36.255:5000/items');
      setItems(res.data);
      setError('');
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Failed to fetch items';
      setError(errorMessage);
      console.error('Error fetching items:', err);
    }
  };

  const addItem = async () => {
    if (!name.trim()) return;
    try {
      await axios.post('http://54.206.36.255:5000/items', { name });
      setName('');
      fetchItems();
      setError('');
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Failed to add item';
      setError(errorMessage);
      console.error('Error adding item:', err);
    }
  };

  const deleteItem = async (id) => {
    try {
      console.log('Attempting to delete item with ID:', id);
      const response = await axios.delete(`http://54.206.36.255:5000/items/${id}`);
      console.log('Delete response:', response.data);
      
      // Update UI after successful deletion
      setItems(prevItems => prevItems.filter(item => item.id !== id));
      setError('');
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Failed to delete item';
      setError(errorMessage);
      console.error('Error deleting item:', err);
      // Refresh the list to ensure consistency
      fetchItems();
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      addItem();
    }
  };

  return (
    <div className="app-container">
      <h1 className="app-title">Simple CRUD App</h1>
      {error && <div className="error-message">{error}</div>}
      <div className="input-container">
        <input
          className="input-field"
          value={name}
          onChange={e => setName(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Add a new item..."
        />
        <button className="add-button" onClick={addItem}>
          Add Item
        </button>
      </div>
      <ul className="items-list">
        {items.map(item => (
          <li key={item.id} className="item">
            <span className="item-content">{item.name}</span>
            <button 
              className="delete-button"
              onClick={() => deleteItem(item.id)}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
