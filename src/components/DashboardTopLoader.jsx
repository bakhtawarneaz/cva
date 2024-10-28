import React from 'react'

const DashboardTopLoader = ({ color = 'white' }) => {
  return (
    <div className="dash_loader_button">
        <div className="spinner">
            <div className="rect1" style={{ backgroundColor: color }}></div>
            <div className="rect2" style={{ backgroundColor: color }}></div>
            <div className="rect3" style={{ backgroundColor: color }}></div>
            <div className="rect4" style={{ backgroundColor: color }}></div>
            <div className="rect5" style={{ backgroundColor: color }}></div>
        </div>
    </div>
  )
}

export default DashboardTopLoader
