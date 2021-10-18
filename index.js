const functions = require('firebase-functions')
const admin = require('firebase-admin')

/**
 * easySetData
 * @param {*} - data
 * @return {string} - id
 */
function easySetData (data) {
  /** idをreturnする */
  let returnId = ''
  /** Path */
  let addData = null

  collectionArray = data.collection.split('/')

  if (collectionArray.some(d => !d)) {
    return new Error()
  }

  if (collectionArray.length % 2 === 0) {
    if (collectionArray.length !== 1) {
      return new Error()
    }
  }

  collectionArray.map((path, index) => {
    if (index === 0) {
      addData = admin.firestore().collection(path)
    } else if (index % 2 === 1) {
      // 奇数
      addData = addData.doc(path)
    } else if (index % 2 === 0) {
      // 偶数
      addData = addData.collection(path)
    }
  })

  // idがある場合
  if (data.doc.id) {
    const getData = await addData.doc(data.doc.id).get()
    if (getData.data()) {
      // 情報がある場合(updata)
      data.doc.updated_at = new Date()
      await addData.doc(data.doc.id).update(data.doc)
      returnId = data.doc.id
    } else {
      // 情報がない場合(id指定の新規登録)
      data.doc.created_at = new Date()
      await addData.doc(data.doc.id).set(data.doc)
      returnId = data.doc.id
    }
  } else {
    // idがない場合(id自動生成の新規登録)
    data.doc.created_at = new Date()
    const newDoc = await addData.add(data.doc)
    // idの登録
    await addData.doc(newDoc.id).update({ id: newDoc.id })
    returnId = newDoc.id
  }

  return returnId
}

exports.easySetData