export const formatDate = (dateString: string) => {
  const date = new Date(dateString);

  // Extract day, month, and year
  const day = String(date.getUTCDate()).padStart(2, "0");
  const month = String(date.getUTCMonth() + 1).padStart(2, "0"); // Months are zero-indexed
  const year = date.getUTCFullYear();

  // Extract hour and minutes in 24h format
  const hours = String(date.getUTCHours()).padStart(2, "0");
  const minutes = String(date.getUTCMinutes()).padStart(2, "0");

  // Format to dd/mm/yyyy : HH:mm
  return `${day}/${month}/${year} : ${hours}:${minutes}`;
};
