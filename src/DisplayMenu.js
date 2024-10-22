import React, { useState, useRef, useEffect } from 'react';
import Display from './public/Display.svg';

const DisplayMenu = ({ setGroupBy, setOrderBy }) => {
  const [displayOptionsVisible, setDisplayOptionsVisible] = useState(false);
  const [grouping, setGrouping] = useState('status');
  const [ordering, setOrdering] = useState('priority');

  const dropdownRef = useRef(null); 

  const handleGroupingChange = (e) => {
    const value = e.target.value;
    setGrouping(value);
    setGroupBy(value);
  };

  const handleOrderingChange = (e) => {
    const value = e.target.value;
    setOrdering(value);
    setOrderBy(value);
  };


  const handleDisplayClick = () => {
    setDisplayOptionsVisible(!displayOptionsVisible);
  };


  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setDisplayOptionsVisible(false); 
    }
  };

  useEffect(() => {

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="display-menu" ref={dropdownRef}> 
    
      <button onClick={handleDisplayClick} className='display-button'>
        <img src={Display} className='display-img' alt="Display" />
        Display &#9662;
      </button>

   
      {displayOptionsVisible && (
        <div className="display-options">
          <div>
            <label>Grouping</label>
            <select value={grouping} onChange={handleGroupingChange} className='options'>
              <option value="status">Status</option>
              <option value="user">User</option>
              <option value="priority">Priority</option>
            </select>
          </div>
          <div>
            <label>Ordering</label>
            <select value={ordering} onChange={handleOrderingChange} className='options'>
              <option value="priority">Priority</option>
              <option value="title">Title</option>
            </select>
          </div>
        </div>
      )}
    </div>
  );
};

export default DisplayMenu;
