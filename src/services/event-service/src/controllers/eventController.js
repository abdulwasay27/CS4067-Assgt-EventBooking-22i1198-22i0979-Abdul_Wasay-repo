const Event = require("../models/eventModel");
const { publishEventNotification } = require("../config/rabbitmq");
// Fetch all events
exports.getAllEvents = async (req, res) => {
  try {
    const events = await Event.findAll();
    // console.log("Events from DB:", events); // Debugging log
    res.json(events);
  } catch (error) {
    console.error("Error fetching events:", error);
    res.status(500).json({ error: "Database error" });
  }
};

// Fetch a single event by ID
exports.getEventById = async (req, res) => {
  try {
    const event = await Event.findByPk(req.params.id);

    if (!event) return res.status(404).json({ error: "Event not found" });
    res.json(event);
  } catch (error) {
    console.error("Error fetching event:", error);
    res.status(500).json({ error: "Database error" });
  }
};

// Create a new event
exports.createEvent = async (req, res) => {
  const { name, location } = req.body;
  try {
    const lastEvent = await Event.findOne({
      order: [["event_id", "DESC"]],
    });

    const event_id = lastEvent ? lastEvent.event_id + 1 : 1;

    const newEvent = await Event.create({ event_id, name, location });
    await publishEventNotification({ event_id, name, location });

    res.json({ message: "Event Created", event: newEvent });
  } catch (error) {
    console.log("Error creating event: " + error);
    res.status(500).json({ error: "Error creating event" });
  }
};

// Update an existing event
exports.updateEvent = async (req, res) => {
  const { name, location } = req.body;
  try {
    const updatedEvent = await Event.update(
      { name, location },
      { where: { event_id: req.params.id } }
    );
    if (!updatedEvent[0])
      return res.status(404).json({ error: "Event not found" });
    res.json({ message: "Event Updated" });
  } catch (error) {
    console.error("Error updating event:", error);
    res.status(500).json({ error: "Database error" });
  }
};

// Delete an event
exports.deleteEvent = async (req, res) => {
  try {
    const deleted = await Event.destroy({ where: { event_id: req.params.id } });
    if (!deleted) return res.status(404).json({ error: "Event not found" });
    res.json({ message: "Event Deleted" });
  } catch (error) {
    console.error("Error deleting event:", error);
    res.status(500).json({ error: "Database error" });
  }
};
