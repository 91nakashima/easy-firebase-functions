// import * as functions from 'firebase-functions'
// import * as admin from 'firebase-admin'
const functions = require('firebase-functions');
const admin = require('firebase-admin');
import { CollectionReference, DocumentReference } from 'firebase-admin/firestore';
admin.initializeApp(functions.config().firebase);
/**
 * set doc
 */
export async function easySetDoc(data) {
    /** idをreturnする */
    let returnId = '';
    /** Path */
    const collectionArray = data.collection.split('/');
    if (collectionArray.some((d) => !d)) {
        return new Error();
    }
    if (collectionArray.length % 2 === 0) {
        if (collectionArray.length !== 1) {
            return new Error();
        }
    }
    const Reference = () => {
        let addData = null;
        for (let i = 0; i < 9; i++) {
            if (!collectionArray[i])
                break;
            if (i === 0) {
                addData = admin.firestore().collection(collectionArray[i]);
            }
            else if (i % 2 === 1 && addData instanceof CollectionReference) {
                addData = addData.doc(collectionArray[i]);
            }
            else if (i % 2 === 0 && addData instanceof DocumentReference) {
                addData = addData.collection(collectionArray[i]);
            }
        }
        return addData;
    };
    if (!Reference)
        return new Error();
    // idがある場合
    if (data.doc.id && Reference instanceof CollectionReference) {
        const getData = await Reference.doc(data.doc.id).get();
        if (getData.data()) {
            // 情報がある場合(updata)
            data.doc.updated_at = new Date();
            await Reference.doc(data.doc.id).update(data.doc);
            returnId = data.doc.id;
        }
        else {
            // 情報がない場合(id指定の新規登録)
            data.doc.created_at = new Date();
            await Reference.doc(data.doc.id).set(data.doc);
            returnId = data.doc.id;
        }
    }
    else if (Reference instanceof CollectionReference) {
        // idがない場合(id自動生成の新規登録)
        data.doc.created_at = new Date();
        const newDoc = await Reference.add(data.doc);
        // idの登録
        await Reference.doc(newDoc.id).update({ id: newDoc.id });
        returnId = newDoc.id;
    }
    return returnId;
}
/**
 * get Doc or getDocs
 */
export async function easyGetData(data, option = {}) {
    const collectionArray = data.split('/');
    let reference = null;
    for (let i = 0; i < 9; i++) {
        if (!collectionArray[i])
            break;
        if (i === 0) {
            reference = admin.firestore().collection(collectionArray[i]);
        }
        else if (i % 2 === 1 && reference instanceof CollectionReference) {
            reference = reference.doc(collectionArray[i]);
        }
        else if (i % 2 === 0 && reference instanceof DocumentReference) {
            reference = reference.collection(collectionArray[i]);
        }
    }
    if (!reference)
        return new Error();
    // 一旦全て取得
    if (collectionArray.length === 1 || collectionArray.length % 2 === 1) {
        if (option.where) {
            if (!Array.isArray(option.where))
                return new Error();
            option.where.map((w) => {
                if (!(reference instanceof CollectionReference))
                    return w;
                reference = reference.where(w[0], w[1], w[2]);
                return w;
            });
        }
        if (option.orderBy) {
            if (typeof option.orderBy !== 'string')
                return new Error();
            if (!(reference instanceof CollectionReference))
                return new Error();
            reference = reference.orderBy(option.orderBy);
        }
        if (option.limit) {
            if (typeof option.limit !== 'number')
                return new Error();
            if (!(reference instanceof CollectionReference))
                return new Error();
            reference = reference.limit(option.limit);
        }
        if (!(reference instanceof CollectionReference))
            return new Error();
        const res = await reference.get();
        const arr = [];
        res.forEach(el => {
            arr.push(el.data());
        });
        return arr;
    }
    else if (collectionArray.length % 2 === 0) {
        return new Promise((resolve, rejects) => {
            if (!(reference instanceof DocumentReference))
                return rejects();
            reference
                .get()
                .then(doc => {
                if (!doc.exists)
                    return rejects();
                if (!doc.data())
                    return rejects();
                resolve(doc.data());
            })
                .catch(() => rejects());
        });
    }
    return new Error();
}
/**
 * delete Doc
 * @param
 */
export async function easyDelete(data) {
    const collectionArray = data.split('/');
    let reference = null;
    for (let i = 0; i < 9; i++) {
        if (!collectionArray[i])
            break;
        if (i === 0) {
            reference = admin.firestore().collection(collectionArray[i]);
        }
        else if (i % 2 === 1 && reference instanceof CollectionReference) {
            reference = reference.doc(collectionArray[i]);
        }
        else if (i % 2 === 0 && reference instanceof DocumentReference) {
            reference = reference.collection(collectionArray[i]);
        }
    }
    return new Promise((resolve, reject) => {
        if (!reference)
            return reject();
        if (!(reference instanceof DocumentReference))
            return reject();
        reference
            .delete()
            .then(() => resolve('ok'))
            .catch(() => reject());
    });
}
//# sourceMappingURL=index.js.map