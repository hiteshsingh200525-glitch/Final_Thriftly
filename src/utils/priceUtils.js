export const formatPrice = (priceUSD) => {
  const conversionRate = 83;
  const priceINR = Math.round(priceUSD * conversionRate);
  
  const formattedINR = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(priceINR);

  return `${formattedINR} ($${priceUSD})`;
};
