const myDB = require("./firebase");
const {
  collection,
  addDoc,
  getDocs,
  query,
  deleteDoc,
  updateDoc,
  doc,
} = require("firebase/firestore");

const collectionName = "frobledo818@gmail.com"; //"users" / "frobledo818@gmail.com"
const subCollectionName = "sessions";

module.exports = {
  async addItem(obj) {
    const itemsCollection = collection(myDB.db, collectionName);
    return addDoc(itemsCollection, obj).id;
  },

  async deleteItem(id) {
    await deleteDoc(doc(myDB.db, collectionName, id));
  },

  async updateItem(id, obj) {
    await updateDoc(doc(myDB.db, collectionName, id), obj);
  },

  async getUsers() {
    const itemsCollection = collection(myDB.db, collectionName);
    const result = await getDocs(query(itemsCollection));
    return result.docs.map((doc) => {
      return { ...doc.data(), id: doc.id };
    });
  },

  async getSessions() {
    const itemsCollection = collection(
      myDB.db,
      collectionName,
      "8ACso7Dydh9K81RQ2XxL",
      subCollectionName
    );
    const result = await getDocs(query(itemsCollection));
    return result.docs.map((doc) => {
      return { ...doc.data(), id: doc.id };
    });
  },
};
