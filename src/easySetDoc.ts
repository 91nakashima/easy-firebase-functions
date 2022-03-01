import * as admin from 'firebase-admin'
import {
  CollectionReference,
  DocumentReference
} from 'firebase-admin/firestore'

import { EasySetDoc } from '../type/EasySetDoc'

/**
 * set doc
 */
export async function easySetDoc<T> (data: {
  collection: string
  doc: EasySetDoc & T
}): Promise<string | Error> {
  const collectionArray: Array<string> = data.collection.split('/')

  if (collectionArray.some((d: string) => !d)) return new Error()

  if (collectionArray.length % 2 === 0) {
    if (collectionArray.length !== 1) return new Error()
  }

  let reference: CollectionReference | DocumentReference | null = null
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
  if (!(reference instanceof CollectionReference)) return new Error()

  // idがある場合
  if (data.doc.id) {
    const getData = await reference.doc(data.doc.id).get()
    if (getData.data()) {
      // 情報がある場合(updata)
      data.doc.updated_at = new Date()
      await reference.doc(data.doc.id).update(data.doc)
    } else {
      // 情報がない場合(create)
      data.doc.created_at = new Date()
      await reference.doc(data.doc.id).set(data.doc)
    }
    return data.doc.id
  }

  // idがない場合(create)
  data.doc.created_at = new Date()
  const newDoc = await reference.add(data.doc)
  await reference.doc(newDoc.id).update({ id: newDoc.id })
  return newDoc.id
}
