import { authentication } from "./Authentification.js";
import { switchForms } from "./login.js";
import { openMenu } from "./menu.js";

switchForms(); // This can stay as is.

if (window.location.pathname.includes("user.html")) {
    authentication(); // Only call authentication if on user.html
}

openMenu(); // This can also stay as is.
