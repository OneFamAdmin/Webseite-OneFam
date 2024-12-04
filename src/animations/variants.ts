export const fadeInUp = {
  hidden: {
    y: 60,
    opacity: 0,
    transition: {
      duration: 0.6,
      ease: "easeInOut"
    }
  },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: "easeInOut"
    }
  }
};

export const parallax = {
  hidden: { 
    y: 20, 
    opacity: 0,
    transition: {
      duration: 0.8,
      ease: "easeInOut"
    }
  },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.8,
      ease: "easeInOut"
    }
  }
};
