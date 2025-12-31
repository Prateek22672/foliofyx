import axiosInstance from "./axiosInstance";

// 1. SAVE or UPDATE
export const saveOrUpdatePortfolio = async (portfolioData) => {
  if (portfolioData._id) {
    const res = await axiosInstance.put(`/portfolio/${portfolioData._id}`, portfolioData);
    return res.data;
  } else {
    const res = await axiosInstance.post("/portfolio/create", portfolioData);
    return res.data;
  }
};

// 2. GET ALL (My Dashboard)
export const getAllPortfolios = async () => {
  const res = await axiosInstance.get("/portfolio/all");
  return res.data;
};

// 3. GET SINGLE (View/Edit)
export const getPortfolio = async (id) => {
  const res = await axiosInstance.get(`/portfolio/${id}`);
  return res.data;
};

// 4. DELETE
export const deletePortfolio = async (id) => {
  const res = await axiosInstance.delete(`/portfolio/${id}`);
  return res.data;
};

// ✅ 5. GET PUBLIC PORTFOLIOS (The Missing Export)
export const getPublicPortfolios = async () => {
  const res = await axiosInstance.get("/portfolio/public");
  return res.data;
};