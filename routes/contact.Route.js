// Import
import express from "express";
import {
  createContact,
  deleteContact,
  getAllContacts,
  getContactCount,
  getDailyContactCounts,
  getUnreadContactCount,
  updateContactStatus,
} from "../controller/contact.Controller.js";

// Router
const contactRouter = express.Router();

// Create Contact
contactRouter.post("/create", createContact);

// Get All Contacts
contactRouter.get("/all", getAllContacts);

// Delete Contact
contactRouter.delete("/delete/:id", deleteContact);

// Update Read Status
contactRouter.patch("/update/:id", updateContactStatus);

// Contact Count
contactRouter.get("/count", getContactCount);

// Unread Contact Count
contactRouter.get("/unread-count", getUnreadContactCount);

// Daily Contact Counts
contactRouter.get("/daily-counts", getDailyContactCounts);

// Export
export default contactRouter;
