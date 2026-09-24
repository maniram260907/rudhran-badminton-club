"use client";

import { useEffect, useState } from "react";
import { QRCodeSVG } from "qrcode.react";

type Member = {
  id: number;
  fullName: string;
  feeAmount: number | null;
  paymentStatus: string;
  paymentSubmitted: boolean;
  paymentReference: string | null;
  isActive: boolean;
};

export default function PaymentPage() {
  const [paymentMethod, setPaymentMethod] = useState("");
  const [member, setMember] = useState<Member | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [paymentSubmitted, setPaymentSubmitted] = useState(false);
  const [paymentReference, setPaymentReference] = useState("");
  const [submittingPayment, setSubmittingPayment] = useState(false);

  useEffect(() => {
    async function loadMember() {
      try {
        const response = await fetch("/api/member/me");
        const data = await response.json();

        if (!response.ok || !data.success) {
          setError(data.message || "Failed to load member details.");
          setLoading(false);
          return;
        }

        const loadedMember = data.member as Member;

        setMember(loadedMember);

        const existingReference =
          loadedMember.paymentReference?.trim() ?? "";

        const hasValidPaymentSubmission =
          loadedMember.paymentSubmitted &&
          existingReference.length > 0;

        setPaymentSubmitted(hasValidPaymentSubmission);
        setPaymentReference(existingReference);
      } catch (error) {
        console.error("Error loading member:", error);
        setError("Unable to load payment details.");
      } finally {
        setLoading(false);
      }
    }

    loadMember();
  }, []);

  async function handlePaymentSubmitted() {
    if (!member) {
      setError("Member information is missing.");
      return;
    }

    const trimmedReference = paymentReference.trim();

    if (!trimmedReference) {
      setError("Please enter your payment transaction/reference number.");
      return;
    }

    setSubmittingPayment(true);
    setError("");

    try {
      const response = await fetch("/api/member/payment", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          paymentReference: trimmedReference,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setError(data.message || "Failed to submit payment.");
        return;
      }

      setPaymentSubmitted(true);
      setPaymentReference(trimmedReference);
      setMember(data.member);
    } catch (error) {
      console.error("Payment submission failed:", error);
      setError("Unable to submit payment. Please try again.");
    } finally {
      setSubmittingPayment(false);
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-[#070b0d] px-6 text-white">
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-center">
            <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-2 border-lime-400/20 border-t-lime-400" />
            <p className="text-sm text-slate-400">
              Loading payment details...
            </p>
          </div>
        </div>
      </main>
    );
  }

  if (error && !member) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#070b0d] px-6 text-white">
        <div className="w-full max-w-md rounded-3xl border border-red-400/20 bg-[#10161a] p-8 text-center shadow-2xl">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-400/10 text-2xl">
            !
          </div>

          <h1 className="mt-5 text-xl font-bold">
            Unable to Load Payment
          </h1>

          <p className="mt-3 text-sm leading-6 text-red-300">
            {error}
          </p>
        </div>
      </main>
    );
  }

  const feeAmount = member?.feeAmount ?? 0;

  const upiUrl =
    `upi://pay?pa=${encodeURIComponent("7200297200@ptsbi")}` +
    `&pn=${encodeURIComponent("Maniram S S")}` +
    `&am=${encodeURIComponent(String(feeAmount))}` +
    `&cu=INR` +
    `&tn=${encodeURIComponent("Rudhran Badminton Club Membership")}`;

  return (
    <main className="min-h-screen bg-[#070b0d] px-4 py-8 text-white sm:px-6 sm:py-12">
      <div className="mx-auto w-full max-w-3xl">

        {/* Header */}
        <header className="mb-8 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-lime-400/20 bg-lime-400/10 text-4xl shadow-lg">
            🏸
          </div>

          <p className="mt-5 text-xs font-semibold uppercase tracking-[0.25em] text-lime-400">
            Rudhran Badminton Club
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            Complete Your Payment
          </h1>

          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-400">
            Complete your membership payment and submit the transaction
            reference for verification.
          </p>
        </header>

        {/* Main Card */}
        <section className="overflow-hidden rounded-3xl border border-white/10 bg-[#10161a] shadow-2xl">

          {/* Top Accent */}
          <div className="h-1 w-full bg-lime-400" />

          <div className="p-5 sm:p-8">

            {/* Member + Status */}
            <div className="flex flex-col gap-5 border-b border-white/10 pb-7 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">
                  Membership Payment
                </p>

                <h2 className="mt-2 text-2xl font-bold">
                  {member?.fullName}
                </h2>

                <p className="mt-1 text-sm text-slate-400">
                  Monthly training membership
                </p>
              </div>

              <div className="w-fit rounded-full border border-yellow-400/20 bg-yellow-400/10 px-4 py-2">
                <span className="text-xs font-bold uppercase tracking-wider text-yellow-300">
                  {paymentSubmitted ? "Submitted" : "Payment Pending"}
                </span>
              </div>
            </div>

            {/* Fee */}
            <div className="mt-7 grid gap-4 sm:grid-cols-2">

              <div className="rounded-2xl border border-lime-400/20 bg-lime-400/[0.06] p-6">
                <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">
                  Membership Fee
                </p>

                <p className="mt-3 text-4xl font-black tracking-tight text-lime-400">
                  ₹{feeAmount}
                </p>

                <p className="mt-2 text-xs text-slate-500">
                  One month training fee
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-[#0b1013] p-6">
                <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">
                  Payment Status
                </p>

                <p
                  className={`mt-3 text-2xl font-bold ${
                    member?.paymentStatus === "PAID"
                      ? "text-lime-400"
                      : "text-yellow-300"
                  }`}
                >
                  {member?.paymentStatus === "PAID"
                    ? "Verified"
                    : "Pending"}
                </p>

                <p className="mt-2 text-xs text-slate-500">
                  Verification is completed by club administration.
                </p>
              </div>
            </div>

            {/* Payment Method */}
            <div className="mt-8">
              <div className="mb-4">
                <p className="text-xs font-semibold uppercase tracking-widest text-lime-400">
                  Step 01
                </p>

                <h2 className="mt-1 text-xl font-bold">
                  Choose Payment Method
                </h2>
              </div>

              <button
                type="button"
                onClick={() => {
                  setPaymentMethod("UPI");
                  setError("");
                }}
                className={`group w-full rounded-2xl border p-5 text-left transition-all duration-200 ${
                  paymentMethod === "UPI"
                    ? "border-lime-400/50 bg-lime-400/[0.08] shadow-lg shadow-lime-400/5"
                    : "border-white/10 bg-[#0b1013] hover:border-lime-400/30 hover:bg-lime-400/[0.03]"
                }`}
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div
                      className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-xl ${
                        paymentMethod === "UPI"
                          ? "bg-lime-400 text-[#070b0d]"
                          : "bg-white/5"
                      }`}
                    >
                      ₹
                    </div>

                    <div>
                      <p className="font-bold">
                        UPI Payment
                      </p>

                      <p className="mt-1 text-sm text-slate-400">
                        Pay using Google Pay, PhonePe or Paytm
                      </p>
                    </div>
                  </div>

                  <span
                    className={`text-2xl transition-transform ${
                      paymentMethod === "UPI"
                        ? "translate-x-1 text-lime-400"
                        : "text-slate-500 group-hover:translate-x-1"
                    }`}
                  >
                    →
                  </span>
                </div>
              </button>
            </div>

            {/* UPI Payment Section */}
            {paymentMethod === "UPI" && (
              <div className="mt-6 rounded-3xl border border-white/10 bg-[#0b1013] p-5 sm:p-7">

                {/* Step */}
                <div className="text-center">
                  <p className="text-xs font-semibold uppercase tracking-widest text-lime-400">
                    Step 02
                  </p>

                  <h2 className="mt-2 text-2xl font-bold">
                    Scan & Pay
                  </h2>

                  <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-400">
                    Scan the QR code using your preferred UPI app and
                    complete the payment.
                  </p>
                </div>

                {/* QR Code */}
                <div className="mt-7 flex justify-center">
                  <div className="rounded-3xl bg-white p-4 shadow-2xl shadow-black/30">
                    <QRCodeSVG
                      value={upiUrl}
                      size={260}
                      bgColor="#ffffff"
                      fgColor="#000000"
                      level="H"
                    />
                  </div>
                </div>

                {/* Amount */}
                <div className="mx-auto mt-6 max-w-sm rounded-2xl border border-lime-400/20 bg-lime-400/[0.05] p-5 text-center">
                  <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">
                    Amount to Pay
                  </p>

                  <p className="mt-2 text-3xl font-black text-lime-400">
                    ₹{feeAmount}
                  </p>
                </div>

                {/* Warning */}
                <div className="mt-6 rounded-2xl border border-yellow-400/20 bg-yellow-400/[0.06] p-4">
                  <div className="flex gap-3">
                    <span className="mt-0.5 text-lg">
                      ⚠️
                    </span>

                    <p className="text-sm leading-6 text-yellow-200/80">
                      The payment amount is included in the QR code.
                      Please verify the amount shown in your UPI app
                      before completing the payment.
                    </p>
                  </div>
                </div>

                {/* Reference */}
                {!paymentSubmitted && (
                  <div className="mt-7">
                    <div className="mb-3">
                      <p className="text-xs font-semibold uppercase tracking-widest text-lime-400">
                        Step 03
                      </p>

                      <label
                        htmlFor="paymentReference"
                        className="mt-1 block text-lg font-bold"
                      >
                        Enter Transaction Reference
                      </label>

                      <p className="mt-1 text-sm text-slate-500">
                        Enter the transaction/reference number shown
                        in your UPI app after payment.
                      </p>
                    </div>

                    <input
                      id="paymentReference"
                      type="text"
                      value={paymentReference}
                      onChange={(event) => {
                        setPaymentReference(event.target.value);
                        setError("");
                      }}
                      placeholder="Example: 123456789012"
                      className="w-full rounded-2xl border border-white/10 bg-[#10161a] px-4 py-4 text-white outline-none transition placeholder:text-slate-600 focus:border-lime-400/60 focus:ring-2 focus:ring-lime-400/10"
                    />
                  </div>
                )}

                {/* Submitted Reference */}
                {paymentSubmitted && (
                  <div className="mt-7 rounded-2xl border border-lime-400/20 bg-lime-400/[0.06] p-5">
                    <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">
                      Transaction Reference
                    </p>

                    <p className="mt-2 break-all text-lg font-bold text-lime-400">
                      {paymentReference}
                    </p>

                    <p className="mt-2 text-sm text-slate-400">
                      Your payment has been submitted and is waiting
                      for admin verification.
                    </p>
                  </div>
                )}

                {/* Submit */}
                <div className="mt-7">
                  <button
                    type="button"
                    onClick={handlePaymentSubmitted}
                    disabled={paymentSubmitted || submittingPayment}
                    className={`w-full rounded-2xl px-5 py-4 text-sm font-bold transition-all ${
                      paymentSubmitted
                        ? "cursor-not-allowed border border-lime-400/20 bg-lime-400/10 text-lime-400"
                        : submittingPayment
                          ? "cursor-not-allowed bg-slate-700 text-slate-300"
                          : "bg-lime-400 text-[#070b0d] hover:bg-lime-300 hover:shadow-lg hover:shadow-lime-400/10"
                    }`}
                  >
                    {paymentSubmitted
                      ? "✓ Payment Submitted — Waiting for Verification"
                      : submittingPayment
                        ? "Submitting Payment..."
                        : "I Have Completed the Payment"}
                  </button>
                </div>

                {/* Error */}
                {error && (
                  <div className="mt-4 rounded-2xl border border-red-400/20 bg-red-400/[0.06] p-4 text-center">
                    <p className="text-sm font-medium text-red-300">
                      {error}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Bottom Note */}
            <div className="mt-7 border-t border-white/10 pt-6 text-center">
              <p className="text-xs leading-5 text-slate-500">
                Your account will be activated after successful payment
                verification by the club administrator.
              </p>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-8 text-center">
          <p className="text-xs text-slate-600">
            Rudhran Badminton Club • Membership Portal
          </p>
        </footer>
      </div>
    </main>
  );
}