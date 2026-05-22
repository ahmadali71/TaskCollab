// src/hooks/useScrollReveal.ts
import { useEffect, useRef } from 'react';

export const useScrollReveal = () => {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll('.reveal-3d').forEach((el) => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);
};

// Use in any component:
// const MyComponent = () => {
//   useScrollReveal();
//   return <div className="reveal-3d">Content</div>;
// };