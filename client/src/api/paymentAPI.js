import axiosInstance from "./axiosInstance";

// 1. CLAIM OFFER (Free Student/Pro Deal)
export const claimStudentOffer = async () => {
  const res = await axiosInstance.post("/payment/claim-offer");
  return res.data;
};

// 2. CANCEL SUBSCRIPTION
export const cancelSubscription = async () => {
  const res = await axiosInstance.post("/payment/cancel");
  return res.data;
};

// 3. GET STATUS (Optional, for checking sync)
export const getSubscriptionStatus = async () => {
  const res = await axiosInstance.get("/payment/status");
  return res.data;
};

// 4. PAID UPGRADE (Mock for now)
export const upgradeToPro = async () => {
  const res = await axiosInstance.post("/payment/upgrade");
  return res.data;
};