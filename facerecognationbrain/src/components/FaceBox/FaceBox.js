import React from 'react';
import './FaceBox.css';

const FaceBox = ({top, right,bottom, left}) => {
  return(
    <div
      className='bounding_box'
      style={{top: top, right: right, bottom: bottom, left: left}}
    />
  )
}

export default FaceBox;