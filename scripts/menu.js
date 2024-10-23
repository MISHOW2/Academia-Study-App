export function openMenu() {
  document.addEventListener("DOMContentLoaded", () => {
    const openMenuIcon = document.querySelector('.menuIcon');
    const menuBar = document.querySelector('.menuBar');

    // Check if both the menuIcon and menuBar exist in the DOM
    if (openMenuIcon && menuBar) {
      // Toggle the menuBar visibility when clicking the menu icon
      openMenuIcon.addEventListener("click", (event) => {
        event.stopPropagation(); // Prevent the click from closing the menu immediately
        menuBar.style.display = menuBar.style.display === "block" ? "none" : "block"; // Toggle between showing and hiding
        menuBar.classList.toggle("active"); // Toggle the "active" class for animations (if any)
      });

      // Close the menu when clicking outside
      document.addEventListener("click", function (event) {
        if (!menuBar.contains(event.target) && !openMenuIcon.contains(event.target)) {
          menuBar.classList.remove("active"); // Close the menu by removing the active class
          menuBar.style.display = "none"; // Optionally hide it completely
        }
      });
    }
  });
}

// Initialize the event listeners
openMenu();
