export const getDaysAgo = (date: string): number => {
  const now = new Date();
  const pastDate = new Date(date);
  const diffTime = Math.abs(now.getTime() - pastDate.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

export const formatLastContact = (date: string): string => {
  const daysAgo = getDaysAgo(date);
  if (daysAgo === 0) return 'Today';
  if (daysAgo === 1) return 'Yesterday';
  return `${daysAgo} days ago`;
};