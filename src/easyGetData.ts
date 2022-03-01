import * as admin from 'firebase-admin'
import {
  CollectionReference,
  DocumentReference,
  Query
} from 'firebase-admin/firestore'

import { QueryOption, WhereOption } from '../type/easyGetData'

/**
 * check type
 */
const isUseType = (r: any): r is CollectionReference | Query => {
  if (r instanceof CollectionReference) return true
  if (r instanceof Query) return true
  return false
}

/**
 * get Doc or getDocs
 */
export async function easyGetData<T> (
  data: string,
  option: QueryOption = {}
): Promise<T[] | T | Error> {
  const collectionArray = data.split('/').filter(d => d)
  if (!collectionArray.length) return new Error()

  let reference: Query | CollectionReference | DocumentReference | null = null

  for (let i = 0; i < collectionArray.length; i++) {
    if (i === 0) {
      reference = admin.firestore().collection(collectionArray[i])
    } else if (i % 2 === 1 && reference instanceof CollectionReference) {
      reference = reference.doc(collectionArray[i])
    } else if (i % 2 === 0 && reference instanceof DocumentReference) {
      reference = reference.collection(collectionArray[i])
    }
  }

  if (collectionArray.length === 1 || collectionArray.length % 2 === 1) {
    /**
     * document
     * https://firebase.google.com/docs/firestore/query-data/queries?hl=ja#simple_queries
     */
    if (option.where) {
      if (!Array.isArray(option.where)) return new Error()

      option.where.map((w: WhereOption) => {
        if (!isUseType(reference)) return w
        reference = reference.where(w[0], w[1], w[2])
        return w
      })
    }

    /**
     * document
     * https://firebase.google.com/docs/firestore/query-data/order-limit-data?hl=ja#order_and_limit_data
     */
    if (option.orderBy) {
      if (!isUseType(reference)) return new Error()
      reference = reference.orderBy(option.orderBy)
    }

    /**
     * document
     * https://firebase.google.com/docs/firestore/query-data/order-limit-data?hl=ja#order_and_limit_data
     */
    if (option.limit) {
      if (!isUseType(reference)) return new Error()
      reference = reference.limit(option.limit)
    }

    if (!isUseType(reference)) return new Error()
    const res = await reference.get()

    /**
     * document data in Array
     */
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
