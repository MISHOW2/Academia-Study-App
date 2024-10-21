import { openMenu } from "./menu.js";



let mainForm = document.querySelector(".mainForm");
let secForm = document.querySelector(".secForm");
let mainDiv = document.querySelector(".mainDiv");
let secDiv = document.querySelector(".secDiv");

// Grabbing the buttons
const buttonSignUp = document.querySelector(".signUpButton"); // renamed class
const buttonSignIn = document.querySelector(".signInButton"); // renamed class

// Event Listener for the Sign-Up button
buttonSignUp.addEventListener("click", () => {
  mainForm.style.display = "none";
  secForm.style.display = "block";

  mainDiv.style.display = "none";
  secDiv.style.display = "block";
});

// Event Listener for the Sign-In button
buttonSignIn.addEventListener("click", () => {
  mainForm.style.display = "block";
  secForm.style.display = "none";

  mainDiv.style.display = "block";
  secDiv.style.display = "none";
});


openMenu();