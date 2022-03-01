import * as admin from 'firebase-admin'
import {
  CollectionReference,
  DocumentReference,
  Query
} from 'firebase-admin/firestore'

import { QueryOption, WhereOption } from '../type/easyGetData'

/**
 * get Doc or getDocs
 */
export async function easyGetData<T> (
  data: string,
  option: QueryOption = {}
): Promise<T[] | T | Error> {
  const collectionArray = data.split('/')
  let reference: Query | CollectionReference | DocumentReference | null = null

  for (let i = 0; i < 9; i++) {
    if (!collectionArray[i]) break
    if (i === 0) {
      reference = admin.firestore().collection(collectionArray[i])
    } else if (i % 2 === 1 && reference instanceof CollectionReference) {
      reference = reference.doc(collectionArray[i])
    } else if (i % 2 === 0 && reference instanceof DocumentReference) {
      reference = reference.collection(collectionArray[i])
    }
  }

  if (!reference) return new Error()

  if (collectionArray.length === 1 || collectionArray.length % 2 === 1) {
    if (option.where) {
      if (!Array.isArray(option.where)) return new Error()

      option.where.map((w: WhereOption) => {
        if (
          !(
            reference instanceof CollectionReference ||
            reference instanceof Query
          )
        )
          return w
        reference = reference.where(w[0], w[1], w[2])
        return w
      })
    }

    if (option.orderBy) {
      if (typeof option.orderBy !== 'string') return new Error()
      if (
        !(
          reference instanceof CollectionReference || reference instanceof Query
        )
      ) {
        return new Error()
      }
      reference = reference.orderBy(option.orderBy)
    }

    if (option.limit) {
      if (typeof option.limit !== 'number') return new Error()
      if (
        !(
          reference instanceof CollectionReference || reference instanceof Query
        )
      ) {
        return new Error()
      }

      reference = reference.limit(option.limit)
    }

    if (!(reference instanceof CollectionReference)) return new Error()

    const res = await reference.get()
    const arr: Array<T> = []
    res.forEach(el => {
      arr.push(el.data() as T)
    })
    return arr
  } else if (collectionArray.length % 2 === 0) {
    return new Promise((resolve, rejects) => {
      if (!(reference instanceof DocumentReference)) return rejects()
      reference
        .get()
        .then(doc => {
          if (!doc.exists) return rejects()
          if (!doc.data()) return rejects()
          resolve(doc.data() as T)
        })
        .catch(() => rejects())
    })
  }
  return new Error()
}
