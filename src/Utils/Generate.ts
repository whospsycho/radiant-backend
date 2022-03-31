export function generateRandomString(len: number): string {
  const chars =
    "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let result = "";
  for (let i = 0; i < len; i++) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  return result;
}

export function generateInviteCode() {
  const invite = `radiant-${generateRandomString(8)}-${generateRandomString(
    8
  )}`;

  return invite;
}
