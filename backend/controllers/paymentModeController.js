import TryCatch from "../utils/TryCatch.js";
import PaymentMode from "../Models/appModel/PaymentMode.js";

/* ================= CREATE MODE ================= */
export const createPaymentMode = TryCatch(async (req, res) => {
  const { name, description } = req.body;

  if (!name || !description) {
    return res.status(400).json({
      message: "Please provide all required fields",
    });
  }

  const mode = await PaymentMode.create(req.body);

  res.status(201).json({
    message: "Payment mode created",
    mode,
  });
});

/* ================= GET MODES ================= */
export const getPaymentModes = TryCatch(async (req, res) => {
  const modes = await PaymentMode.find();

  res.status(200).json({
    success: true,
    modes,
  });
});

/* ================= UPDATE MODE ================= */
export const updatePaymentMode = TryCatch(async (req, res) => {
  const mode = await PaymentMode.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );

  if (!mode) {
    return res.status(404).json({
      message: "Payment mode not found",
    });
  }

  res.status(200).json({
    message: "Payment mode updated",
    mode,
  });
});


export const deletePaymentMode = TryCatch(async (req, res) => {
  const mode = await PaymentMode.findById(req.params.id);

  if (!mode) {
    return res.status(404).json({
      message: "Payment mode not found",
    });
  }

  await mode.deleteOne();

  res.status(200).json({
    message: "Payment mode deleted",
  });
});
