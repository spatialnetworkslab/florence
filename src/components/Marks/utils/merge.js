export default function merge (obj1, obj2) {
  const merged = Object.assign(obj1, {})
  for (const key in obj2) { merged[key] = obj2[key] }

  return merged
}
