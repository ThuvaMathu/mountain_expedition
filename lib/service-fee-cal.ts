type SupportedCurrency = "INR" | "USD";
/**
 * Calculate Razorpay service fee
 * @param currency - "INR" or "USD"
 * @param amount - transaction amount
 * @returns service fee (number)
 */
export function serviceFeeCal(
  currency: SupportedCurrency,
  amount: number
): number {
  if (currency === "INR") {
    const baseFee = amount * 0.02; // 2%
    const gst = baseFee * 0.18; // 18% GST on fee
    return parseFloat((baseFee + gst).toFixed(2));
  }

  if (currency === "USD") {
    const fee = amount * 0.029 + 0.3; // 2.9% + $0.30
    return parseFloat(fee.toFixed(2));
  }

  return 0; // fallback
}
