export function showDate() {
  document.addEventListener("DOMContentLoaded", () => {
    let showDate = new Date(); // Create current date object

    // Array of month names (January is index 0, December is index 11)
    const monthNames = [
      "January", "February", "March", "April", "May", "June", 
      "July", "August", "September", "October", "November", "December"
    ];

    // Array of day names
    const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    // Get the current month and year
    let month = monthNames[showDate.getMonth()]; // getMonth() returns the month index
    let year = showDate.getFullYear(); // getFullYear() gives the 4-digit year

    // Update the month and year display
    document.querySelector(".year-month").innerHTML = `${month} ${year}`;

    // Generate the next 7 days
    let nextSevenDaysHTML = ""; // To hold the generated HTML for the next 7 days

    for (let i = 0; i < 7; i++) {
      let futureDate = new Date(); // Start with today's date
      futureDate.setDate(showDate.getDate() + i); // Increment the day by i

      // Get the day of the week and the numeric day
      let dayOfWeek = daysOfWeek[futureDate.getDay()];
      let day = futureDate.getDate();

      // Append the generated HTML for each date
      nextSevenDaysHTML += `
        <div class="dates">
          <div class="day-week">${dayOfWeek}</div>
          <div class="day">${day}</div>
        </div>
      `;
    }

    // Insert the generated HTML into the ".date-container"
    document.querySelector(".date-container").innerHTML = nextSevenDaysHTML;
  });
}

showDate();
