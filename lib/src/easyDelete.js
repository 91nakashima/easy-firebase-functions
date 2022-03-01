"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.easyDelete = void 0;
const admin = require("firebase-admin");
const firestore_1 = require("firebase-admin/firestore");
/**
 * delete Doc
 * @params 'cities/LA'
 */
async function easyDelete(data) {
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
    return new Promise((resolve, reject) => {
        if (!reference)
            return reject();
        if (!(reference instanceof firestore_1.DocumentReference))
            return reject();
        reference
            .delete()
            .then(() => resolve('ok'))
            .catch(() => reject());
    });
}
exports.easyDelete = easyDelete;
//# sourceMappingURL=easyDelete.js.map