import { deleteAndShift } from '@/composables/objectUtils'
import { describe } from 'node:test'
import { expect, test } from 'vitest'

describe('objectUtils', () => {
  test('delete array item from record and shift subsequent arrays', () => {
    const record: Record<number, number[]> = {}
    record[1] = [1, 2, 3]
    record[2] = [4, 5, 6]
    record[3] = [7, 8, 9]

    const startKey = 4, indexToDelete = 0 // to be deleted: out of bounds

    deleteAndShift(record, startKey, indexToDelete)

    expect(record[1]).toStrictEqual([1, 2, 3])
    expect(record[2]).toStrictEqual([4, 5, 6])
    expect(record[3]).toStrictEqual([7, 8, 9])
  })

  test('delete array item from record and shift subsequent arrays', () => {
    const record: Record<number, number[]> = {}
    record[1] = [1, 2, 3]
    record[2] = [4, 5, 6]
    record[3] = [7, 8, 9]

    const startKey = 2, indexToDelete = 0 // to be deleted: record[2][0] = 4

    deleteAndShift(record, startKey, indexToDelete)

    expect(record[1]).toStrictEqual([1, 2, 3])
    expect(record[2]).toStrictEqual([5, 6, 7])
    expect(record[3]).toStrictEqual([8, 9])
  })

  test('delete last array item and delete next empty record', () => {
    const record: Record<number, number[]> = {}
    record[1] = [1, 2, 3]
    record[2] = [4, 5, 6]
    record[3] = [7]

    const startKey = 2, indexToDelete = 2 // to be deleted: record[2][2] = 6

    deleteAndShift(record, startKey, indexToDelete)

    expect(record[1]).toStrictEqual([1, 2, 3])
    expect(record[2]).toStrictEqual([4, 5, 7])
    expect(record[3]).toBeUndefined()
  })

  test('delete last array item and delete current empty record', () => {
    const record: Record<number, number[]> = {}
    record[1] = [1, 2, 3]
    record[2] = [4, 5, 6]
    record[3] = [7]

    const startKey = 3, indexToDelete = 0 // to be deleted: record[3][0] = 7

    deleteAndShift(record, startKey, indexToDelete)

    expect(record[1]).toStrictEqual([1, 2, 3])
    expect(record[2]).toStrictEqual([4, 5, 6])
    expect(record[3]).toBeUndefined()
  })

  test('delete first current empty record and dont touch other empty records (to be populated)', () => {
    const record: Record<number, number[]> = {}
    record[1] = [1]
    record[2] = []
    record[3] = []
    record[4] = [4, 5, 6]

    const startKey = 1, indexToDelete = 0 // to be deleted: record[1][0] = 1

    deleteAndShift(record, startKey, indexToDelete)

    expect(record[1]).toBeUndefined()
    expect(record[2]).toStrictEqual([])
    expect(record[3]).toStrictEqual([])
    expect(record[4]).toStrictEqual([4, 5, 6])
  })

  test('delete last current empty record and dont touch other empty records (to be populated)', () => {
    const record: Record<number, number[]> = {}
    record[1] = [1, 2, 3]
    record[2] = []
    record[3] = []
    record[4] = [4]

    const startKey = 4, indexToDelete = 0 // to be deleted: record[4][0] = 4

    deleteAndShift(record, startKey, indexToDelete)

    expect(record[1]).toStrictEqual([1, 2, 3])
    expect(record[2]).toStrictEqual([])
    expect(record[3]).toStrictEqual([])
    expect(record[4]).toBeUndefined()
  })

  test('delete median current empty record and dont touch other empty records (to be populated)', () => {
    const record: Record<number, number[]> = {}
    record[1] = [1, 2, 3]
    record[2] = []
    record[3] = [4]
    record[4] = []
    record[5] = [5, 6, 7]

    const startKey = 3, indexToDelete = 0 // to be deleted: record[3][0] = 4

    deleteAndShift(record, startKey, indexToDelete)

    expect(record[1]).toStrictEqual([1, 2, 3])
    expect(record[2]).toStrictEqual([])
    expect(record[3]).toBeUndefined()
    expect(record[4]).toStrictEqual([])
    expect(record[5]).toStrictEqual([5, 6, 7])
  })

  test('delete median last array item and dont shift next empty record', () => {
    const record: Record<number, number[]> = {}
    record[1] = [1, 2, 3]
    record[2] = []
    record[3] = [4, 5, 6]
    record[4] = []
    record[5] = [7, 8, 9]

    const startKey = 3, indexToDelete = 2// to be deleted: record[3][0] = 6

    deleteAndShift(record, startKey, indexToDelete)

    expect(record[1]).toStrictEqual([1, 2, 3])
    expect(record[2]).toStrictEqual([])
    expect(record[3]).toStrictEqual([4, 5])
    expect(record[4]).toStrictEqual([])
    expect(record[5]).toStrictEqual([7, 8, 9])
  })
})
