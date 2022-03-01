"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.easyGetData = void 0;
const admin = require("firebase-admin");
const firestore_1 = require("firebase-admin/firestore");
/**
 * get Doc or getDocs
 */
async function easyGetData(data, option = {}) {
    const collectionArray = data.split('/');
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
    if (collectionArray.length === 1 || collectionArray.length % 2 === 1) {
        if (option.where) {
            if (!Array.isArray(option.where))
                return new Error();
            option.where.map((w) => {
                if (!(reference instanceof firestore_1.CollectionReference ||
                    reference instanceof firestore_1.Query))
                    return w;
                reference = reference.where(w[0], w[1], w[2]);
                return w;
            });
        }
        if (option.orderBy) {
            if (typeof option.orderBy !== 'string')
                return new Error();
            if (!(reference instanceof firestore_1.CollectionReference || reference instanceof firestore_1.Query)) {
                return new Error();
            }
            reference = reference.orderBy(option.orderBy);
        }
        if (option.limit) {
            if (typeof option.limit !== 'number')
                return new Error();
            if (!(reference instanceof firestore_1.CollectionReference || reference instanceof firestore_1.Query)) {
                return new Error();
            }
            reference = reference.limit(option.limit);
        }
        if (!(reference instanceof firestore_1.CollectionReference))
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
            if (!(reference instanceof firestore_1.DocumentReference))
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
exports.easyGetData = easyGetData;
//# sourceMappingURL=easyGetData.js.map