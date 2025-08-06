/**
 * Deletes a specific value from an array within the record and shifts
 * elements from subsequent arrays to fill the gap.
 * @param obj The record containing number arrays, keyed by numbers (pages).
 * @param startKey The key (page) of the record from which to start the deletion.
 * @param indexToDelete The index of the value to delete from the array.
 */
export function deleteAndShift<T>(obj: Record<number, T[]>, startKey: keyof typeof obj, indexToDelete: number) {
  const keys = Object.keys(obj).map(Number).sort((a, b) => a - b)
  const startIndex = keys.indexOf(startKey)

  if (startIndex === -1) {
    // Start key not found
    return
  }

  // Delete the element from the starting array
  obj[startKey].splice(indexToDelete, 1)
  if (obj[startKey].length === 0) {
    // Delete record entry if resulting array is empty
    delete obj[startKey]
    return
  }

  // Shift elements from subsequent arrays
  for (let i = startIndex; i < keys.length - 1; i++) {
    const currentKey = keys[i]
    const nextKey = keys[i + 1]

    if (obj[currentKey]?.length > 0 && obj[nextKey]?.length > 0) {
      const elementToMove = obj[nextKey].shift() // removes the first element and returns it. [1]

      if (elementToMove)
        obj[currentKey].push(elementToMove)

      // Delete next record entry if after shifting, result array is empty
      if (obj[nextKey].length === 0) {
        delete obj[nextKey]
      }
    }
  }
};
