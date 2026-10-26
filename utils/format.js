export function formatRupiah(value) {
  const number = Number(value);
  if (!Number.isFinite(number)) return 'Rp 0';
  return `Rp ${number.toLocaleString('id-ID')}`;
}

export function initials(name) {
  const parts = String(name ?? '')
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}
