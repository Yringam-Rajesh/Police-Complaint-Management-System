export function generateCitizenId() {
  return `CIT-${Date.now().toString().slice(-8)}`;
}

export function generateComplaintId() {
  const date = new Date();
  const stamp = [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0")
  ].join("");
  const random = Math.floor(1000 + Math.random() * 9000);
  return `CMP-${stamp}-${random}`;
}
