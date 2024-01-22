export const formatPostDate = (dateStr: string) => {
  const date = new Date(dateStr)

  return `${date.getFullYear()}. ${date.getMonth() + 1}. ${date.getDate()}`
}
