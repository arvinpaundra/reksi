import { FormatDateInput } from './format_date_input';

export function FormatDateIntl(value) {
  const formatted = new Date(FormatDateInput(value)).toLocaleDateString('in-IN', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  return formatted;
}
