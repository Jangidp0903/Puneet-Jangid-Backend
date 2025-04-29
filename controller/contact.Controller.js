// Import
import Contact from "../models/contact.Model.js";
import { ErrorHandler } from "../middleware/errorHandler.js";

// Create Contact Controller
export const createContact = async (req, res, next) => {
  try {
    const { name, email, phone, subject, message } = req.body;
    const contact = await Contact.create({
      name,
      email,
      phone,
      subject,
      message,
    });
    res.status(201).json({
      success: true,
      message: "Contact created successfully",
      contact,
    });
  } catch (error) {
    next(error);
  }
};

// Get All Contacts Controller
export const getAllContacts = async (req, res, next) => {
  try {
    const contacts = await Contact.find({});
    if (!contacts) {
      return next(new ErrorHandler("No contacts found", 404));
    }
    res.status(200).json({
      success: true,
      contacts,
    });
  } catch (error) {
    next(error);
  }
};

// Delete Contact Controller
export const deleteContact = async (req, res, next) => {
  try {
    const contact = await Contact.findById(req.params.id);
    if (!contact) {
      return next(new ErrorHandler("Contact not found", 404));
    }
    await Contact.findByIdAndDelete(req.params.id);
    res.status(200).json({
      success: true,
      message: "Contact deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

// Update Contact isRead Status Controller
export const updateContactStatus = async (req, res, next) => {
  try {
    const contact = await Contact.findById(req.params.id);

    if (!contact) {
      return next(new ErrorHandler("Contact not found", 404));
    }

    // If isRead is provided in the request body, use it, otherwise toggle the current value
    const isRead =
      req.body.isRead !== undefined ? req.body.isRead : !contact.isRead;

    const updatedContact = await Contact.findByIdAndUpdate(
      req.params.id,
      { isRead },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: isRead ? "Contact marked as read" : "Contact marked as unread",
      contact: updatedContact,
    });
  } catch (error) {
    next(error);
  }
};

// Get Contact Count Controller
export const getContactCount = async (req, res, next) => {
  try {
    const count = await Contact.countDocuments({});

    res.status(200).json({
      success: true,
      count,
    });
  } catch (error) {
    next(error);
  }
};

// Get Unread Contact Count and Latest Messages Controller
export const getUnreadContactCount = async (req, res, next) => {
  try {
    // Get unread count
    const unreadCount = await Contact.countDocuments({ isRead: false });

    // Get latest 5 messages, sorted by creation date (newest first)
    const latestMessages = await Contact.find({})
      .sort({ createdAt: -1 })
      .limit(5);

    res.status(200).json({
      success: true,
      unreadCount,
      latestMessages,
    });
  } catch (error) {
    next(error);
  }
};

// Get Daily Contact Counts for the last 10 days
export const getDailyContactCounts = async (req, res, next) => {
  try {
    // 1. Compute the date range boundaries in local time (Asia/Kolkata)
    const today = new Date();
    today.setHours(0, 0, 0, 0); // today at 00:00:00
    const startDate = new Date(today);
    startDate.setDate(startDate.getDate() - 9); // 9 days before today at 00:00:00
    const endDate = new Date(today);
    endDate.setHours(23, 59, 59, 999); // today at 23:59:59.999

    // 2. Aggregate contacts by local date string
    const dailyCounts = await Contact.aggregate([
      {
        $match: {
          createdAt: {
            $gte: startDate,
            $lte: endDate,
          },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$createdAt",
              timezone: "+05:30", // ensure grouping in IST
            },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // 3. Turn the aggregation into a lookup map
    const countsMap = dailyCounts.reduce((map, { _id, count }) => {
      map[_id] = count;
      return map;
    }, {});

    // 4. Build the full 10-day series, filling in zeros where needed
    const result = [];
    for (let i = 0; i < 10; i++) {
      const d = new Date(startDate);
      d.setDate(startDate.getDate() + i);
      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, "0");
      const dd = String(d.getDate()).padStart(2, "0");
      const dateKey = `${yyyy}-${mm}-${dd}`;

      result.push({
        date: dateKey,
        contacts: countsMap[dateKey] || 0,
      });
    }

    return res.status(200).json({
      success: true,
      dailyContactCounts: result,
    });
  } catch (error) {
    console.error("Error fetching daily contact counts:", error);
    next(error);
  }
};
