import React from 'react';
import '../styles/ProgressBar.css';

const ProgressBar = ({ progress }) => {
  return (
    <div className="progress-bar-container">
      <div className="progress-bar" style={{ width: `${progress}%` }}>
        <div className="progress-text">{`${progress}%`}</div>
      </div>
    </div>
  );
};

export default ProgressBar;
