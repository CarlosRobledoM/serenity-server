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

const collectionName = "users"; //"users" / "frobledo818@gmail.com"
const subCollectionName = "sessions";

module.exports = {
  async addItem(obj) {
    const itemsCollection = collection(myDB.db, collectionName);
    return addDoc(itemsCollection, obj).id;
  },

  async deleteItem(id) {
    await deleteDoc(doc(myDB.db, collectionName, id));
  },

  async updateItem(idUser, idSession, obj) {
    await updateDoc(
      doc(myDB.db, collectionName, idUser, subCollectionName, idSession),
      obj
    );
  },

  async getUsers() {
    const itemsCollection = collection(myDB.db, collectionName);
    const result = await getDocs(query(itemsCollection));
    return result.docs.map((doc) => {
      return { ...doc.data(), id: doc.id };
    });
  },

  async getSessions(idUser) {
    const itemsCollection = collection(
      myDB.db,
      collectionName,
      idUser,
      subCollectionName
    );
    const result = await getDocs(query(itemsCollection));
    return result.docs.map((doc) => {
      return { ...doc.data(), id: doc.id };
    });
  },
};
