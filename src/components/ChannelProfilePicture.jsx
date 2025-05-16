import React from 'react';

const ChannelProfilePicture = ({ channelId, size = 48, alt }) => (
  <img
    src={`https://yt3.googleusercontent.com/ytc/${channelId}=s${size}-c-k-c0x00ffffff-no-rj`}
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
