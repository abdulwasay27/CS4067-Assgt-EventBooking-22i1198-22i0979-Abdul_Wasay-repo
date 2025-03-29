document.addEventListener("DOMContentLoaded", async () => {
  const token = localStorage.getItem("jwtToken");

  if (!token) {
    console.error("No token found. Please log in.");
    document.getElementById("events-list").innerHTML =
      "<p>You must be logged in to view events.</p>";
    return;
  }

  try {
    const response = await fetch("http://eventbooking.com:80/events/", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`, // Send JWT in headers
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const events = await response.json();

    const eventsList = document.getElementById("events-list");
    eventsList.innerHTML = ""; // Clear loading text

    if (events.length === 0) {
      eventsList.innerHTML = `<div class="event-card no-events">No events available.</div>`;
      return;
    }

    events.forEach((event) => {
      const eventCard = document.createElement("div");
      eventCard.classList.add("event-card");

      eventCard.innerHTML = `
              <h3>${event.name}</h3>
              <p><strong>Location:</strong> ${event.location}</p>
              <button class="book-btn" onclick="bookEvent(${event.event_id})">Book Now</button>
          `;

      eventsList.appendChild(eventCard);
    });
  } catch (error) {
    console.error("Error fetching events:", error);
    document.getElementById("events-list").innerHTML =
      "<p>Error loading events.</p>";
  }
});

function bookEvent(eventId) {
  const token = localStorage.getItem("jwtToken");
  const email = localStorage.getItem("userEmail");
  const tickets = prompt("Enter the number of tickets:");
  if (!tickets || isNaN(tickets) || tickets <= 0) {
    alert("Invalid ticket number.");
    return;
  }
  fetch("http://eventbooking.com:80/booking/", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, event_id: eventId, tickets: tickets }),
  })
    .then((response) => response.json())
    .then((data) => alert(data.message))
    .catch((error) => console.error("Error booking event:", error));
}

function goBack() {
  window.location.href = "dashboard.html";
}
