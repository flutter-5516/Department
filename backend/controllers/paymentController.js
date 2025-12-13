import TryCatch from "../utils/TryCatch.js";
import Payment from "../Models/appModel/Payment.js";
import Invoice from "../Models/appModel/Invoice.js";

/* ================= CREATE PAYMENT ================= */
export const createPayment = TryCatch(async (req, res) => {
  const {
    number,
    client,
    invoice,
    amount,
    currency,
    paymentMode,
    ref,
    description,
  } = req.body;

  if (!number || !client || !invoice || !amount || !currency) {
    return res.status(400).json({
      message: "Please provide all required payment fields",
    });
  }

  const payment = await Payment.create({
    ...req.body,
    createdBy: req.user._id,
  });

  // Update invoice payment status
  const payments = await Payment.find({ invoice });
  const totalPaid = payments.reduce((sum, p) => sum + p.amount, 0);

  const invoiceDoc = await Invoice.findById(invoice);

  if (totalPaid >= invoiceDoc.total) {
    invoiceDoc.paymentStatus = "paid";
  } else if (totalPaid > 0) {
    invoiceDoc.paymentStatus = "partially";
  }

  invoiceDoc.payment.push(payment._id);
  await invoiceDoc.save();

  res.status(201).json({
    message: "Payment recorded successfully",
    payment,
  });
});

/* ================= GET ALL PAYMENTS ================= */
export const getPayments = TryCatch(async (req, res) => {
  const payments = await Payment.find({ removed: false })
    .populate("client")
    .populate("invoice")
    .populate("paymentMode")
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: payments.length,
    payments,
  });
});

/* ================= GET SINGLE PAYMENT ================= */
export const getPayment = TryCatch(async (req, res) => {
  const payment = await Payment.findById(req.params.id)
    .populate("client")
    .populate("invoice")
    .populate("paymentMode");

  if (!payment) {
    return res.status(404).json({
      message: "Payment not found",
    });
  }

  res.status(200).json({
    success: true,
    payment,
  });
});

/* ================= UPDATE PAYMENT ================= */
export const updatePayment = TryCatch(async (req, res) => {
  const payment = await Payment.findById(req.params.id);

  if (!payment) {
    return res.status(404).json({
      message: "Payment not found",
    });
  }

  const updatedPayment = await Payment.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );

  res.status(200).json({
    message: "Payment updated successfully",
    payment: updatedPayment,
  });
});

/* ================= DELETE PAYMENT (SOFT DELETE) ================= */
export const deletePayment = TryCatch(async (req, res) => {
  const payment = await Payment.findById(req.params.id);

  if (!payment) {
    return res.status(404).json({
      message: "Payment not found",
    });
  }

  payment.removed = true;
  await payment.save();

  res.status(200).json({
    message: "Payment deleted successfully",
  });
});
