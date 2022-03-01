import * as admin from 'firebase-admin'
import {
  CollectionReference,
  DocumentReference
} from 'firebase-admin/firestore'

/**
 * delete Doc
 * @params 'cities/LA'
 */
export async function easyDelete (data: string): Promise<string | Error> {
  const collectionArray = data.split('/')
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

  return new Promise((resolve, reject): void => {
    if (!reference) return reject()
    if (!(reference instanceof DocumentReference)) return reject()
    reference
      .delete()
      .then(() => resolve('ok'))
      .catch(() => reject())
  })
}
