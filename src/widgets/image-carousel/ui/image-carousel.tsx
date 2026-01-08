import { useState, useEffect, Fragment } from 'react';
import { Box } from '@mui/material';

export const ImageCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const images = ['/1.jpg', '/2.jpg', '/3.jpg'];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % images.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [images.length]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const nextSlide = () => {
    setCurrentSlide(prev => (prev + 1) % images.length);
  };

  const prevSlide = () => {
    setCurrentSlide(prev => (prev - 1 + images.length) % images.length);
  };

  return (
    <Box
      sx={{
        position: 'relative',
        width: '100%',
        height: { xs: 250, md: 400 },
        overflow: 'hidden',
        borderRadius: 2,
        mb: 4,
      }}
    >
      {/* Изображения */}
      <Fragment>
        {images.map((img, index) => {
          return (
            <Box
              key={index}
              component="img"
              src={img}
              alt={`Slide ${index + 1}`}
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                opacity: currentSlide === index ? 1 : 0,
                transition: 'opacity 0.5s ease-in-out',
              }}
            />
          );
        })}
      </Fragment>

      {/* Кнопки навигации */}
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: 10,
          transform: 'translateY(-50%)',
          bgcolor: 'rgba(0,0,0,0.5)',
          color: 'white',
          borderRadius: '50%',
          width: 40,
          height: 40,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          '&:hover': { bgcolor: 'rgba(0,0,0,0.7)' },
        }}
        onClick={prevSlide}
      >
        ❮
      </Box>

      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          right: 10,
          transform: 'translateY(-50%)',
          bgcolor: 'rgba(0,0,0,0.5)',
          color: 'white',
          borderRadius: '50%',
          width: 40,
          height: 40,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          '&:hover': { bgcolor: 'rgba(0,0,0,0.7)' },
        }}
        onClick={nextSlide}
      >
        ❯
      </Box>

      {/* Точки индикаторы */}
      <Box
        sx={{
          position: 'absolute',
          bottom: 20,
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: 1,
        }}
      >
        <Fragment>
          {images.map((_, index) => {
            return (
              <Box
                key={index}
                onClick={() => goToSlide(index)}
                sx={{
                  width: 12,
                  height: 12,
                  borderRadius: '50%',
                  bgcolor: currentSlide === index ? 'white' : 'rgba(255,255,255,0.5)',
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                  '&:hover': { bgcolor: 'white' },
                }}
              />
            );
          })}
        </Fragment>
      </Box>
    </Box>
  );
};
