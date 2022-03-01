"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.easyGetData = void 0;
const admin = require("firebase-admin");
const firestore_1 = require("firebase-admin/firestore");
/**
 * check type
 */
const isUseType = (r) => {
    if (r instanceof firestore_1.CollectionReference)
        return true;
    if (r instanceof firestore_1.Query)
        return true;
    return false;
};
/**
 * get Doc or getDocs
 */
async function easyGetData(data, option = {}) {
    const collectionArray = data.split('/').filter(d => d);
    if (!collectionArray.length)
        return new Error();
    let reference = null;
    for (let i = 0; i < collectionArray.length; i++) {
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
    if (collectionArray.length === 1 || collectionArray.length % 2 === 1) {
        /**
         * document
         * https://firebase.google.com/docs/firestore/query-data/queries?hl=ja#simple_queries
         */
        if (option.where) {
            if (!Array.isArray(option.where))
                return new Error();
            option.where.map((w) => {
                if (!isUseType(reference))
                    return w;
                reference = reference.where(w[0], w[1], w[2]);
                return w;
            });
        }
        /**
         * document
         * https://firebase.google.com/docs/firestore/query-data/order-limit-data?hl=ja#order_and_limit_data
         */
        if (option.orderBy) {
            if (!isUseType(reference))
                return new Error();
            reference = reference.orderBy(option.orderBy);
        }
        /**
         * document
         * https://firebase.google.com/docs/firestore/query-data/order-limit-data?hl=ja#order_and_limit_data
         */
        if (option.limit) {
            if (!isUseType(reference))
                return new Error();
            reference = reference.limit(option.limit);
        }
        if (!isUseType(reference))
            return new Error();
        const res = await reference.get();
        /**
         * document data in Array
         */
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