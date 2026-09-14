"use client";

import { useEffect, useState } from "react";
import { QRCodeSVG } from "qrcode.react";

type Member = {
  id: number;
  fullName: string;
  feeAmount: number | null;
  paymentStatus: string;
  paymentSubmitted: boolean;
  isActive: boolean;
};

export default function PaymentPage() {
  const [paymentMethod, setPaymentMethod] = useState("");
  const [member, setMember] = useState<Member | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [paymentSubmitted, setPaymentSubmitted] = useState(false);
  const [submittingPayment, setSubmittingPayment] = useState(false);

  useEffect(() => {
    async function loadMember() {
      try {
        const params = new URLSearchParams(window.location.search);
        const memberId = params.get("memberId");

        if (!memberId) {
          setError("Member information is missing.");
          setLoading(false);
          return;
        }

        const response = await fetch("/api/members");
        const data = await response.json();

        if (!data.success) {
          setError(data.message || "Failed to load member details.");
          setLoading(false);
          return;
        }

        const foundMember = data.members.find(
          (item: Member) => String(item.id) === memberId
        );

        if (!foundMember) {
          setError("Member not found.");
          setLoading(false);
          return;
        }

        setMember(foundMember);
        setPaymentSubmitted(foundMember.paymentSubmitted);
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

    setSubmittingPayment(true);
    setError("");

    try {
      const response = await fetch("/api/members", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          memberId: member.id,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setError(data.message || "Failed to submit payment.");
        return;
      }

      setPaymentSubmitted(true);
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
      <main className="flex min-h-screen items-center justify-center bg-slate-950 px-6 text-white">
        <p className="text-slate-300">
          Loading payment details...
        </p>
      </main>
    );
  }

  if (error && !member) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 px-6 text-white">
        <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-8 text-center">
          <p className="font-medium text-red-400">
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
    <main className="min-h-screen bg-slate-950 px-6 py-12 text-white">
      <div className="mx-auto w-full max-w-2xl">

        <div className="mb-8 text-center">
          <div className="text-6xl">🏸</div>

          <h1 className="mt-4 text-3xl font-bold">
            Rudhran Badminton Club
          </h1>

          <p className="mt-2 text-slate-400">
            Complete your membership payment
          </p>
        </div>

        <div className="rounded-3xl border border-slate-800 bg-slate-900 p-8 shadow-2xl">

          <div className="mb-6 text-center">
            <p className="text-sm text-slate-500">
              Member
            </p>

            <p className="mt-1 text-xl font-bold">
              {member?.fullName}
            </p>
          </div>

          <div className="mb-8 rounded-2xl border border-cyan-400/30 bg-cyan-400/10 p-6 text-center">

            <p className="text-sm text-slate-400">
              Membership Fee
            </p>

            <p className="mt-2 text-4xl font-bold text-cyan-400">
              ₹{feeAmount}
            </p>

            <p className="mt-2 text-xs text-slate-500">
              One month training fee
            </p>

          </div>

          <h2 className="mb-4 text-xl font-semibold text-cyan-400">
            Select Payment Method
          </h2>

          <button
            type="button"
            onClick={() => setPaymentMethod("UPI")}
            className={`w-full rounded-2xl border p-5 text-left transition ${
              paymentMethod === "UPI"
                ? "border-cyan-400 bg-cyan-400/10"
                : "border-slate-700 bg-slate-950 hover:border-cyan-400"
            }`}
          >
            <div className="flex items-center justify-between">

              <div>
                <p className="font-bold">
                  📱 UPI / Paytm
                </p>

                <p className="mt-1 text-sm text-slate-400">
                  Pay using Paytm, Google Pay or PhonePe
                </p>
              </div>

              <span className="text-2xl">
                →
              </span>

            </div>
          </button>

          {paymentMethod === "UPI" && (
            <div className="mt-6 rounded-2xl border border-cyan-400/30 bg-slate-950 p-6 text-center">

              <h2 className="text-xl font-bold text-white">
                Scan to Pay
              </h2>

              <p className="mt-2 text-sm text-slate-400">
                Scan this QR code using Paytm, Google Pay or PhonePe
              </p>

              <div className="mt-6 flex justify-center">

                <div className="rounded-2xl bg-white p-4">

                  <QRCodeSVG
                    value={upiUrl}
                    size={288}
                    bgColor="#ffffff"
                    fgColor="#000000"
                    level="H"
                  />

                </div>

              </div>

              <div className="mt-6 rounded-xl border border-slate-700 bg-slate-900 p-4">

                <p className="text-sm text-slate-400">
                  Amount to Pay
                </p>

                <p className="mt-1 text-3xl font-bold text-cyan-400">
                  ₹{feeAmount}
                </p>

              </div>

              <div className="mt-5 rounded-xl border border-yellow-400/20 bg-yellow-400/10 p-4">

                <p className="text-sm text-yellow-300">
                  The payment amount is included in the QR code.
                  Please check the amount in your UPI app before paying.
                </p>

              </div>

            </div>
          )}

          {paymentMethod === "UPI" && (
            <div className="mt-6">

              <button
                type="button"
                onClick={handlePaymentSubmitted}
                disabled={paymentSubmitted || submittingPayment}
                className={`w-full rounded-xl py-4 font-bold ${
                  paymentSubmitted
                    ? "cursor-not-allowed bg-green-500 text-white"
                    : submittingPayment
                      ? "cursor-not-allowed bg-slate-600 text-white"
                      : "bg-cyan-400 text-slate-950 hover:bg-cyan-300"
                }`}
              >
                {paymentSubmitted
                  ? "✓ Payment Submitted - Waiting for Admin"
                  : submittingPayment
                    ? "Submitting Payment..."
                    : "I Have Completed the Payment"}
              </button>

            </div>
          )}

          {error && (
            <p className="mt-4 rounded-xl bg-red-500/10 p-3 text-center text-sm text-red-400">
              {error}
            </p>
          )}

          <p className="mt-5 text-center text-xs text-slate-500">
            Your account will be activated after successful payment
            verification.
          </p>

        </div>
      </div>
    </main>
  );
}