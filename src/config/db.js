import firebase from 'firebase'

export const config = {
  apiKey: 'AIzaSyCvuM5jHvggHKKr7XBiO-A-jANhcHJN7_0',
  authDomain: 'homepantry-ad5ec.firebaseapp.com',
  databaseURL: 'https://homepantry-ad5ec.firebaseio.com',
  projectId: 'homepantry-ad5ec',
  storageBucket: 'homepantry-ad5ec.appspot.com',
  messagingSenderId: '313226004311'
}
let dbconnection = firebase.initializeApp(config)
export const fireDb = dbconnection.firestore()
fireDb.settings({timestampsInSnapshots: true})
