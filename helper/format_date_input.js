export function FormatDateInput(value) {
  const formattedDate = value?.split('-');

  if (formattedDate?.length < 3) {
    return 'Format tanggal invalid';
  } else {
    return `${formattedDate[2]}-${formattedDate[1]}-${formattedDate[0]}`;
  }
}
