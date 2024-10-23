export function switchForms() {
  document.addEventListener("DOMContentLoaded", () => {
    let mainForm = document.querySelector(".mainForm");
    let signUpForm = document.querySelector(".signUpForm");
    let mainDiv = document.querySelector(".mainDiv");
    let secDiv = document.querySelector(".secDiv");

    // Grabbing the buttons
    const buttonSignUp = document.querySelector(".signUpButton");
    const buttonSignIn = document.querySelector(".signInButton");

    // Ensure buttons exist before adding event listeners
    if (buttonSignUp && buttonSignIn) {
      // Event Listener for the Sign-Up button
      buttonSignUp.addEventListener("click", () => {
        if (mainForm && signUpForm && mainDiv && secDiv) {
          mainForm.style.display = "none";
          signUpForm.style.display = "block";
          mainDiv.style.display = "none";
          secDiv.style.display = "block";
        }
      });

      // Event Listener for the Sign-In button
      buttonSignIn.addEventListener("click", () => {
        if (mainForm && signUpForm && mainDiv && secDiv) {
          mainForm.style.display = "block";
          signUpForm.style.display = "none";
          mainDiv.style.display = "block";
          secDiv.style.display = "none";
        }
      });
    }
  });
}

// Call the function
switchForms();
