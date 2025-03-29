document
  .getElementById("createEventForm")
  .addEventListener("submit", async function (event) {
    event.preventDefault();

    const eventName = document.getElementById("eventName").value;
    const eventLocation = document.getElementById("eventLocation").value;

    const eventData = { name: eventName, location: eventLocation };
    const token = localStorage.getItem("jwtToken");
    try {
      const response = await fetch("http://eventbooking.com:80/events/", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(eventData),
      });

      const result = await response.json();
      if (response.ok) {
        alert("Event Created Successfully!");
        window.location.href = "dashboard.html";
      } else {
        alert("Error: " + result.error);
      }
    } catch (error) {
      console.error("Error creating event:", error);
      alert("Something went wrong. Try again!");
    }
  });
