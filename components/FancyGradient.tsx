// components/FancyGradient.tsx


import React from 'react';

const FancyGradient: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <div
      className={`rounded-full blur-[80px]  will-change-transform ${className}`}
      style={{
        background:
          'linear-gradient(0deg, #FAD649 -8.66%, #EF8031 9.86%, #EB356A 28.38%, #C131BF 46.89%, #6B46F1 65.41%)',
        WebkitBackdropFilter: 'blur(80px)',
        // WebkitMaskImage: '-webkit-radial-gradient(white, black)',
        // transform: 'translateZ(0)',
      }}
    ></div>
  );
};

export default FancyGradient;


// import React from 'react';

// const FancyGradient: React.FC<{ className?: string }> = ({ className }) => {
//   return (
//     <div
//       className={`  blur-[80px] rounded-full ${className}`}
//       style={{
//         background:
//           'linear-gradient(0deg, #FAD649 -8.66%, #EF8031 9.86%, #EB356A 28.38%, #C131BF 46.89%, #6B46F1 65.41%)',
//       }}
//     ></div>
//   );
// };

// export default FancyGradient;
