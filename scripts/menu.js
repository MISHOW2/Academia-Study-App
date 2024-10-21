export function openMenu() {
let openMenu =document.querySelector('.menuIcon');

let menuBar =document.querySelector('.menuBar')

openMenu.addEventListener("click", ()=>{
 
   menuBar.style.display = "block"
 
}
)


}


openMenu();