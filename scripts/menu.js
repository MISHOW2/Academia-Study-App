export function openMenu() {
  const openMenuIcon = document.querySelector('.menuIcon');
  const menuBar = document.querySelector('.menuBar');

  // When clicking the menu icon, toggle the menuBar visibility
  openMenuIcon.addEventListener("click", () => {
    menuBar.style.display = "block"; // Ensure the menuBar is shown
    menuBar.classList.toggle("active"); // Toggle the "active" class for animations (if any)
  });

  // Function to close the sidebar if clicking outside
  document.addEventListener("click", function (event) {
    // Check if the click is outside the menuBar and the menu icon
    if (!menuBar.contains(event.target) && !openMenuIcon.contains(event.target)) {
      menuBar.classList.remove("active"); // Close the menu by removing the active class
      menuBar.style.display = "none"; // Optionally hide it completely
    }
  });
}

// Call the function to initialize the event listeners
openMenu();
