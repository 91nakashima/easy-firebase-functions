"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.easySetDoc = void 0;
const admin = require("firebase-admin");
const firestore_1 = require("firebase-admin/firestore");
/**
 * set doc
 */
async function easySetDoc(data) {
    const collectionArray = data.collection.split('/');
    if (collectionArray.some((d) => !d))
        return new Error();
    if (collectionArray.length % 2 === 0) {
        if (collectionArray.length !== 1)
            return new Error();
    }
    let reference = null;
    for (let i = 0; i < 9; i++) {
        if (!collectionArray[i])
            break;
        if (i === 0) {
            reference = admin.firestore().collection(collectionArray[i]);
        }
        else if (i % 2 === 1 && reference instanceof firestore_1.CollectionReference) {
            reference = reference.doc(collectionArray[i]);
        }
        else if (i % 2 === 0 && reference instanceof firestore_1.DocumentReference) {
            reference = reference.collection(collectionArray[i]);
        }
    }
    if (!reference)
        return new Error();
    if (!(reference instanceof firestore_1.CollectionReference))
        return new Error();
    // idがある場合
    if (data.doc.id) {
        const getData = await reference.doc(data.doc.id).get();
        if (getData.data()) {
            // 情報がある場合(updata)
            data.doc.updated_at = new Date();
            await reference.doc(data.doc.id).update(data.doc);
        }
        else {
            // 情報がない場合(create)
            data.doc.created_at = new Date();
            await reference.doc(data.doc.id).set(data.doc);
        }
        return data.doc.id;
    }
    // idがない場合(create)
    data.doc.created_at = new Date();
    const newDoc = await reference.add(data.doc);
    await reference.doc(newDoc.id).update({ id: newDoc.id });
    return newDoc.id;
}
exports.easySetDoc = easySetDoc;
//# sourceMappingURL=easySetDoc.js.map