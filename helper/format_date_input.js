export function FormatDateInput(value) {
  const formattedDate = value?.split('-');

  return `${formattedDate[2]}-${formattedDate[1]}-${formattedDate[0]}`;
}
