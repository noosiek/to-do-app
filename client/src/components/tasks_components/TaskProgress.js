// TaskProgress.js
import React from 'react';
import ProgressBar from 'react-bootstrap/ProgressBar';

const TaskProgress = ({ progress, onClick, progressBarRef }) => {
    const getVariant = (progress) => {
      if (progress >= 0 && progress <= 25) {
        return 'danger';
      } else if (progress > 25 && progress <= 50) {
        return 'warning';
      } else if (progress > 50 && progress <= 75) {
        return 'info';
      } else {
        return 'success';
      }
    };

    return (
  <div className="progress-bar-container" ref={progressBarRef}>
    <ProgressBar
      style={{ height: '18px', border: '1px solid #3e3e5a', borderRadius: '5px', marginBottom: '20px', backgroundColor: '#282851' }}
      striped
      variant={getVariant(progress)}
      animated
      now={progress}
      label={`${progress}%`}
      onClick={onClick}
    />
  </div>
);
};

export default TaskProgress;
