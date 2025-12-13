import TryCatch from "../utils/TryCatch.js";
import Client from "../Models/appModel/Client.js";

export const ClientProfile = TryCatch(async (req, res) => {
  const { name, email, phone, country, address } = req.body;

  if (!name || !email || !phone || !country || !address) {
    return res.status(400).json({
      message: "Please provide all the values",
    });
  }

  const client = await Client.create({
    name,
    email,
    phone,
    country,
    address,
    createdBy: req.user?._id,
  });

  res.status(201).json({
    message: "Client created successfully",
    client,
  });
});

/* ================= GET ALL CLIENTS ================= */
export const getClients = TryCatch(async (req, res) => {
  const clients = await Client.find({ createdBy: req.user._id })
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: clients.length,
    clients,
  });
});

/* ================= GET SINGLE CLIENT ================= */
export const getClient = TryCatch(async (req, res) => {
  const client = await Client.findById(req.params.id);

  if (!client) {
    return res.status(404).json({
      message: "Client not found",
    });
  }

  res.status(200).json({
    success: true,
    client,
  });
});

export const updateClient = TryCatch(async (req, res) => {
  const client = await Client.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );

  if (!client) {
    return res.status(404).json({
      message: "Client not found",
    });
  }

  res.status(200).json({
    message: "Client updated successfully",
    client,
  });
});

/* ================= DELETE CLIENT (SOFT DELETE) ================= */
export const deleteClient = TryCatch(async (req, res) => {
  const client = await Client.findById(req.params.id);

  if (!client) {
    return res.status(404).json({
      message: "Client not found",
    });
  }

  client.removed = true;
  await client.save();

  res.status(200).json({
    message: "Client deleted successfully",
  });
});

/* ================= CLIENT SUMMARY (ALREADY OK) ================= */
export const summary = TryCatch(async (req, res) => {
  const totalClients = await Client.countDocuments();

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const totalNewClients = await Client.countDocuments({
    created: { $gte: thirtyDaysAgo },
  });

  const activeClients = await Client.countDocuments({
    assigned: { $ne: null },
  });

  const totalActiveClientsPercentage =
    totalClients > 0 ? (activeClients / totalClients) * 100 : 0;

  const totalNewClientsPercentage =
    totalClients > 0 ? (totalNewClients / totalClients) * 100 : 0;

  res.status(200).json({
    success: true,
    result: {
      new: Math.round(totalNewClientsPercentage),
      active: Math.round(totalActiveClientsPercentage),
    },
    message: "Successfully fetched client summary",
  });
});
