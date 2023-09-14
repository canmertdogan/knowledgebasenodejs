// Get the viewport height
const viewportHeight = window.innerHeight || document.documentElement.clientHeight;

// Set the CSS variable with a percentage of the viewport height
const scrollHeightPercentage = 70; // Adjust this value as needed
document.documentElement.style.setProperty('--scroll-height-percentage', `${scrollHeightPercentage}vh`);
