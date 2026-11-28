import crypto from "crypto";

/** Verifies the reverse hash PayU sends with a payment response / webhook. */
export function isValidPayuResponseHash(fields: {
  status: string;
  txnid: string;
  amount: string;
  productinfo: string;
  firstname: string;
  email: string;
  hash: string;
  additionalCharges?: string | null;
}) {
  let reverse = `${process.env.PAYU_MERCHANT_SALT}|${fields.status}|||||||||||${fields.email}|${fields.firstname}|${fields.productinfo}|${fields.amount}|${fields.txnid}|${process.env.PAYU_MERCHANT_KEY}`;
  if (fields.additionalCharges) reverse = `${fields.additionalCharges}|${reverse}`;
  const calculated = crypto.createHash("sha512").update(reverse).digest("hex");
  return calculated === fields.hash;
}
