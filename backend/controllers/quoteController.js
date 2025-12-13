import TryCatch from "../utils/TryCatch.js";
import Quote from "../Models/appModel/Quote.js";

/* ================= CREATE QUOTE ================= */
export const createQuote = TryCatch(async (req, res) => {
  const {
    number,
    year,
    date,
    expiredDate,
    client,
    items,
    taxRate,
    discount,
    currency,
    status,
  } = req.body;

  if (!number || !year || !date || !expiredDate || !client || !items?.length) {
    return res.status(400).json({
      message: "Please provide all required quote fields",
    });
  }

  // Calculate totals
  const subTotal = items.reduce((sum, item) => sum + item.total, 0);
  const taxTotal = (subTotal * (taxRate || 0)) / 100;
  const total = subTotal + taxTotal - (discount || 0);

  const quote = await Quote.create({
    ...req.body,
    createdBy: req.user._id,
    subTotal,
    taxTotal,
    total,
    status: status || "draft",
  });

  res.status(201).json({
    message: "Quote created successfully",
    quote,
  });
});

/* ================= GET ALL QUOTES ================= */
export const getQuotes = TryCatch(async (req, res) => {
  const quotes = await Quote.find({ createdBy: req.user._id })
    .populate("client")
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: quotes.length,
    quotes,
  });
});

/* ================= GET SINGLE QUOTE ================= */
export const getQuote = TryCatch(async (req, res) => {
  const quote = await Quote.findById(req.params.id)
    .populate("client")
    .populate("createdBy", "name email");

  if (!quote) {
    return res.status(404).json({
      message: "Quote not found",
    });
  }

  res.status(200).json({
    success: true,
    quote,
  });
});

/* ================= UPDATE QUOTE ================= */
export const updateQuote = TryCatch(async (req, res) => {
  let quote = await Quote.findById(req.params.id);

  if (!quote) {
    return res.status(404).json({
      message: "Quote not found",
    });
  }

  // Recalculate totals if items changed
  if (req.body.items) {
    const subTotal = req.body.items.reduce(
      (sum, item) => sum + item.total,
      0
    );
    req.body.subTotal = subTotal;
    req.body.taxTotal = (subTotal * (req.body.taxRate || 0)) / 100;
    req.body.total =
      subTotal + req.body.taxTotal - (req.body.discount || 0);
  }

  quote = await Quote.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );

  res.status(200).json({
    message: "Quote updated successfully",
    quote,
  });
});

export const deleteQuote = TryCatch(async (req, res) => {
  const quote = await Quote.findById(req.params.id);

  if (!quote) {
    return res.status(404).json({
      message: "Quote not found",
    });
  }

  await quote.deleteOne();

  res.status(200).json({
    message: "Quote deleted successfully",
  });
});
