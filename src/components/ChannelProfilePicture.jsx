import React from 'react';

const ChannelProfilePicture = ({ url, size = 48, alt }) => (
  <img
    src={url}
    alt={alt || 'YouTube Channel'}
    width={size}
    height={size}
    style={{
      borderRadius: '50%',
      border: '2px solid #dee2e6',
      objectFit: 'cover',
      flexShrink: 0,
    }}
  />
);

export default ChannelProfilePicture;
