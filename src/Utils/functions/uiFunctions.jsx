export const languages = [
    { code: 'en', lang: 'English', name: 'English' },
    { code: 'he', lang: 'עברית', name: 'Hebrew' },
    { code: 'es', lang: 'Español', name: 'Spanish' },
    { code: 'yi', lang: 'ייִדיש', name: 'Yiddish' },
  ];

export const responsiveHomeSlider = {
    superLargeDesktop: {
      breakpoint: { max: 4000, min: 1700 },
      items: 3,
      partialVisibilityGutter: 10,
    },
    desktop: {
      breakpoint: { max: 1700, min: 1024 },
      items: 4,
      partialVisibilityGutter: 10,
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 3,
      partialVisibilityGutter: 10,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
      partialVisibilityGutter: 10,
    },
  };