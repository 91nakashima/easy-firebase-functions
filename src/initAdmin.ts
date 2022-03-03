import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'

if (!admin.apps.length) {
  admin.initializeApp(functions.config().firebase)
}

export default admin
