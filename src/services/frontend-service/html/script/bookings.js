document.addEventListener("DOMContentLoaded", async () => {
  const token = localStorage.getItem("jwtToken");
  const email = localStorage.getItem("userEmail");

  if (!token || !email) {
    document.getElementById("bookings-list").innerHTML =
      "<p>You must be logged in to view bookings.</p>";
    return;
  }

  try {
    const response = await fetch(
      "http://eventbooking.com:80/booking/allUserBookings",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      }
    );

    const data = await response.json();
    const bookingsList = document.getElementById("bookings-list");
    bookingsList.innerHTML = ""; // Remove loading text

    if (!response.ok) {
      bookingsList.innerHTML = `<p>Error: ${
        data.message || "Failed to load bookings."
      }</p>`;
      return;
    }

    if (!data.bookings || data.bookings.length === 0) {
      bookingsList.innerHTML = `<p>No bookings found.</p>`;
      return;
    }

    for (const booking of data.bookings) {
      let eventName = "Loading...";

      try {
        const eventRes = await fetch(
          `http://eventbooking.com:80/events/${booking.event_id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const eventData = await eventRes.json();
        if (eventRes.ok) {
          eventName = eventData.name; // Attach event name
        }
      } catch (eventErr) {
        console.error("Error fetching event name:", eventErr);
      }

      const bookingCard = document.createElement("div");
      bookingCard.classList.add("booking-card");

      bookingCard.innerHTML = `
                      <h3>Event: ${eventName}</h3>
                      <p><strong>Tickets:</strong> ${booking.num_tickets}</p>
                      <p><strong>Status:</strong> ${
                        booking.status ? booking.status : "Pending"
                      }</p>
                  `;

      bookingsList.appendChild(bookingCard);
    }
  } catch (error) {
    console.error("Error fetching bookings:", error);
    document.getElementById("bookings-list").innerHTML =
      "<p>Error loading bookings.</p>";
  }
});
