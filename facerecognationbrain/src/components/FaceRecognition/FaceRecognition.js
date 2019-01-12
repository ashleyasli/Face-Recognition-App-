import React from 'react';
import FaceBox from '../FaceBox/FaceBox';

const FaceRecognition = ({imageUrl, boxs}) => {
	return(
    <div className='center ma'>
      <div className='absolute mt2'>
        <img id='inputImage' alt='img' src={ imageUrl } width='500px' height='auto'/>
        {
          boxs.map((value, index) => {
              return (
                <FaceBox
                  key={index}
                  top={value.topRow}
                  right={value.rightCol}
                  bottom={value.bottomRow}
                  left={value.leftCol}
                />
              );
            }
          )
        }
      </div>
    </div>
  );
}

export default FaceRecognition;