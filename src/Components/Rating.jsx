import React from 'react';
import {Icon} from "semantic-ui-react";

const Rating = ({ rating }) => {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 >= 0.5 ? true : false;
  const emptyStars = 5 - Math.ceil(rating);

  return (
    <div style={{marginTop: '0', display: 'flex', gap: '5px' }}>
      {/* Full stars */}
      {Array.from({ length: fullStars }, (_, index) => (
      <Icon name='star' key={`full-${index}`} style={{ color: '#FFD700', marginRight: '5px' }} />
      ))}

      {/* Half star */}
      {halfStar && <Icon name='star' style={{ color: '#FFD700', marginRight: '5px' }}/>}

      {/* Empty stars */}
      {Array.from({ length: emptyStars }, (_, index) => (
      <Icon name='star' key={`empty-${index}`} style={{  marginRight: '5px' }}  />
      ))}
    </div>
  );
};

export default Rating;