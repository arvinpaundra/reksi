export function FormatDateIntl(value) {
  const formatted = new Date(value).toLocaleDateString('in-IN', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  return formatted;
}
