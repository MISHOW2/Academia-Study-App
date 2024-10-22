export function openMenu() {
let openMenu =document.querySelector('.menuIcon');

let menuBar =document.querySelector('.menuBar')

openMenu.addEventListener("click", ()=>{
 
   menuBar.style.display = "block"
 

   document.addEventListener("DOMContentLoaded", function () {
  const sidebar = document.getElementById("sidebar");
  const menuIcon = document.querySelector(".menuIcon");

  // Function to toggle the sidebar
  menuIcon.addEventListener("click", function () {
    sidebar.classList.toggle("active");
  });

  // Function to close the sidebar if clicking outside
  document.addEventListener("click", function (event) {
    // Check if the click is outside the sidebar and the menu icon
    if (!sidebar.contains(event.target) && !menuIcon.contains(event.target)) {
      sidebar.classList.remove("active");
    }
  });
});
}
)


}


openMenu();