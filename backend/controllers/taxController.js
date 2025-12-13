import TryCatch from "../utils/TryCatch.js";
import Taxes from "../Models/appModel/Taxes.js";

export const createTax = TryCatch(async (req, res) => {
  const { taxName, taxValue, isDefault } = req.body;

  if (!taxName || taxValue === undefined) {
    return res.status(400).json({
      message: "Please provide tax name and tax value",
    });
  }


  if (isDefault) {
    await Taxes.updateMany({ isDefault: true }, { isDefault: false });
  }

  const tax = await Taxes.create(req.body);

  res.status(201).json({
    message: "Tax created successfully",
    tax,
  });
});


export const getTaxes = TryCatch(async (req, res) => {
  const taxes = await Taxes.find({ removed: false }).sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: taxes.length,
    taxes,
  });
});

/* ================= GET SINGLE TAX ================= */
export const getTax = TryCatch(async (req, res) => {
  const tax = await Taxes.findById(req.params.id);

  if (!tax || tax.removed) {
    return res.status(404).json({
      message: "Tax not found",
    });
  }

  res.status(200).json({
    success: true,
    tax,
  });
});

/* ================= UPDATE TAX ================= */
export const updateTax = TryCatch(async (req, res) => {
  const tax = await Taxes.findById(req.params.id);

  if (!tax || tax.removed) {
    return res.status(404).json({
      message: "Tax not found",
    });
  }

  // Handle default tax update
  if (req.body.isDefault) {
    await Taxes.updateMany({ isDefault: true }, { isDefault: false });
  }

  const updatedTax = await Taxes.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );

  res.status(200).json({
    message: "Tax updated successfully",
    tax: updatedTax,
  });
});

/* ================= DELETE TAX (SOFT DELETE) ================= */
export const deleteTax = TryCatch(async (req, res) => {
  const tax = await Taxes.findById(req.params.id);

  if (!tax) {
    return res.status(404).json({
      message: "Tax not found",
    });
  }

  tax.removed = true;
  tax.enabled = false;
  await tax.save();

  res.status(200).json({
    message: "Tax deleted successfully",
  });
});
