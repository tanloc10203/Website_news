export function convertToSlug(Text) {
  return Text.toLowerCase()
    .replace(/ /g, "-")
    .replace(/[^\w-]+/g, "");
}

export function emptyObject(obj) {
  return Object.keys(obj).length === 0;
}
