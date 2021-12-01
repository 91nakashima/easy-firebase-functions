const functions = require('firebase-functions')
const admin = require('firebase-admin')

admin.initializeApp(functions.config().firebase)

/**
 * easySetData
 * @param {*} - data
 * @return {string} - id
 */
async function easySetDoc (data) {
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
      addData = addData.doc(path)
    } else if (index % 2 === 0) {
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

/**
 * easyGetData
 * @param {string || string & Object} - data
 * @return {Array || Object} - id
 */
async function easyGetData (data, option = {}) {
  /** Path */
  let getData = null

  collectionArray = data.split('/')

  collectionArray.map((path, index) => {
    if (index === 0) {
      getData = admin.firestore().collection(path)
    } else if (index % 2 === 1) {
      getData = getData.doc(path)
    } else if (index % 2 === 0) {
      getData = getData.collection(path)
    }
  })

  // 一旦全て取得
  if (collectionArray.length === 0 || collectionArray.length % 2 === 0) {
    if (option.where) {
      if (!Array.isArray(option.where)) {
        return new Error('where is Array')
      }
      option.where.map(w => {
        getData = getData.where(w[0], w[1], w[2])
        return w
      })
    }

    if (option.orderBy) {
      if (typeof option.orderBy !== 'string') {
        return new Error('orderBy is String')
      }
      getData = getData.orderBy(option.orderBy)
    }

    if (option.limit) {
      if (typeof option.limit !== 'number') {
        return new Error('limit is Number')
      }
      getData = getData.limit(option.limit)
    }

    const res = await getData.get()
    const arr = []
    res.forEach(el => {
      arr.push(el.data())
    })

    return arr
  } else if (collectionArray.length % 2 === 1) {
    const res = await getData.get()

    return res.data()
  }
}

exports.easySetDoc = easySetDoc
exports.easyGetData = easyGetData
