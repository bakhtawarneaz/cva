import React from 'react'
import '@styles/_switch.css';

const Switch = ({ className, isChecked, onToggle }) => {
  return (
      <button 
        type="button" 
        className={`btn-toggle ${className} ${isChecked ? 'checked' : ''}`}
        onClick={() => onToggle(!isChecked)}
      >
        <div className="handle"></div>
      </button>
  )
}

export default Switch
