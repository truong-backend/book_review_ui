import React, { useState } from 'react';

export default function StarRating({ value = 0, onChange, readOnly = false, size = 24 }) {
  const [hover, setHover] = useState(0);

  return (
    <div style={{ display: 'flex', gap: 2 }}>
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          onClick={() => !readOnly && onChange && onChange(star)}
          onMouseEnter={() => !readOnly && setHover(star)}
          onMouseLeave={() => !readOnly && setHover(0)}
          style={{
            fontSize: size,
            cursor: readOnly ? 'default' : 'pointer',
            color: star <= (hover || value) ? '#d4a520' : '#ddd',
            transition: 'color 0.15s',
            lineHeight: 1,
          }}
        >
          ★
        </span>
      ))}
    </div>
  );
}