export function checkEmail(email) {
  if (!email) return false;

  const parts = email.split("@");
  if (parts.length !== 2 || email.includes(" ")) return false;

  const name = parts[0];
  const domain = parts[1];

  if (
    name.includes("..") ||
    domain.includes("..") ||
    name.startsWith(".") ||
    name.endsWith(".") ||
    domain.startsWith(".") ||
    domain.endsWith(".") ||
    domain.startsWith("-") ||
    !domain.includes(".")
  ) {
    return false;
  }

  const nameRegex = /^[a-z0-9#$%&'*+=?^_`{|}~.-]+$/i;
  const domainRegex = /^[a-z0-9.-]+\.[a-z]{2,63}$/i;

  if (nameRegex.test(name) && domainRegex.test(domain)) {
    const domainParts = domain.split(".");
    const tld = domainParts[domainParts.length - 1];
    if (/^\d+$/.test(tld)) return false;
    return true;
  }

  return false;
}

export function checkPass(pass) {
  if (!pass || pass.trim().length === 0) return false;
  if (pass.length < 8) return false;

  const hasDigit = /\d/.test(pass);
  const hasUpper = /[A-ZА-ЯЁІЇЄ]/.test(pass);
  const hasSpecial = /[^a-zA-Z0-9а-яА-ЯёЁіІїЇєЄ]/.test(pass);

  return hasDigit && hasUpper && hasSpecial;
}

export function checkPhone(phone) {
  if (!phone) return true;

  const normalizedPhone = phone.replace(/[\s()-]/g, "");

  return /^(?:\+?380|0)\d{9}$/.test(normalizedPhone);
}
