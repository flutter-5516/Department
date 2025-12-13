import TryCatch from "../utils/TryCatch.js";
import Invoice from "../Models/appModel/Invoice.js";


export const createInvoice = TryCatch(async (req, res) => {
  const {
    number,
    year,
    date,
    expiredDate,
    client,
    items,
    taxRate,
    currency,
    discount,
    status,
  } = req.body;

  if (!number || !year || !date || !expiredDate || !client || !items?.length) {
    return res.status(400).json({
      message: "Please provide all required invoice fields",
    });
  }

  // Calculate totals
  const subTotal = items.reduce((acc, item) => acc + item.total, 0);
  const taxTotal = (subTotal * (taxRate || 0)) / 100;
  const total = subTotal + taxTotal - (discount || 0);

  const invoice = await Invoice.create({
    ...req.body,
    createdBy: req.user._id, // from auth middleware
    subTotal,
    taxTotal,
    total,
    status: status || "draft",
  });

  res.status(201).json({
    message: "Invoice created successfully",
    invoice,
  });
});


export const getInvoices = TryCatch(async (req, res) => {
  const invoices = await Invoice.find({ createdBy: req.user._id })
    .populate("client")
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: invoices.length,
    invoices,
  });
});

export const getInvoice = TryCatch(async (req, res) => {
  const invoice = await Invoice.findById(req.params.id)
    .populate("client")
    .populate("createdBy", "name email");

  if (!invoice) {
    return res.status(404).json({
      message: "Invoice not found",
    });
  }

  res.status(200).json({
    success: true,
    invoice,
  });
});


export const updateInvoice = TryCatch(async (req, res) => {
  let invoice = await Invoice.findById(req.params.id);

  if (!invoice) {
    return res.status(404).json({
      message: "Invoice not found",
    });
  }

  if (req.body.items) {
    const subTotal = req.body.items.reduce(
      (acc, item) => acc + item.total,
      0
    );
    req.body.subTotal = subTotal;
    req.body.taxTotal = (subTotal * (req.body.taxRate || 0)) / 100;
    req.body.total =
      subTotal + req.body.taxTotal - (req.body.discount || 0);
  }

  invoice = await Invoice.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );

  res.status(200).json({
    message: "Invoice updated successfully",
    invoice,
  });
});


export const deleteInvoice = TryCatch(async (req, res) => {
  const invoice = await Invoice.findById(req.params.id);

  if (!invoice) {
    return res.status(404).json({
      message: "Invoice not found",
    });
  }

  await invoice.deleteOne();

  res.status(200).json({
    message: "Invoice deleted successfully",
  });
});
