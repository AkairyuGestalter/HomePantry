import firebase from 'firebase'
import 'firebase/firestore'

const config = {
  apiKey: 'AIzaSyCvuM5jHvggHKKr7XBiO-A-jANhcHJN7_0',
  authDomain: 'homepantry-ad5ec.firebaseapp.com',
  databaseURL: 'https://homepantry-ad5ec.firebaseio.com',
  projectId: 'homepantry-ad5ec',
  storageBucket: 'homepantry-ad5ec.appspot.com',
  messagingSenderId: '313226004311'
}

firebase.initializeApp(config)
const db = firebase.firestore()
db.settings({timestampsInSnapshots: true})
const auth = firebase.auth()
const currentUser = auth.currentUser

const allUsers = db.collection('users')
const allHomes = db.collection('homes')

export {
  db,
  auth,
  currentUser,
  allUsers,
  allHomes
}
