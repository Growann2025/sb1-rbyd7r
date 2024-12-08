export const cleanDomain = (domain: string): string => {
  if (!domain) return '';
  return domain
    .toLowerCase()
    .replace(/^https?:\/\/(www\.)?/i, '')
    .replace(/^www\./i, '')
    .trim();
};