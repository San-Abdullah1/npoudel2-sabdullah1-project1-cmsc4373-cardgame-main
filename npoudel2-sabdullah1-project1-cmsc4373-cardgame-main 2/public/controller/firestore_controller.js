import {
    getFirestore,
    collection, addDoc,
    query, where, orderBy, getDocs,
    deleteDoc, doc // Added missing imports for deleteDoc and doc
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";


import { app } from "./firebase_core.js";

const db = getFirestore(app);

export const CollectionName = 'cardGameHistory';

export async function addGameRecord(playRecord) {
    //await addDoc(collection(db, CollectionName), playRecord);
    try {
        await addDoc(collection(db, CollectionName), playRecord);
        console.log('Play record added successfully:', playRecord);
    } catch (e) {
        console.log(`Failed to add play record: :${JSON.stringify(e)}`);
        throw e; // Rethrow the error to handle it in the caller function
    }
}


// Function to fetch a user's play history from the database.
export async function fetchUserPlayHistory(userEmail) {
    // Define the query to select user's play history records.
    const historyQuery = query(
        collection(db, CollectionName), // Reference to the specific database collection.
        where('email', '==', userEmail), // Filter by user email.
        orderBy('timestamp', 'desc'), // Order by the timestamp in descending order.
    );
    let historyArray = []; // Initialize an array to hold the user's play history.
    const querySnapshot = await getDocs(historyQuery); // Execute the query to get the documents.
    querySnapshot.forEach(document => {
        const documentId = document.id; // Retrieve document ID.
        const { bet, won, balance, timestamp, restart } = document.data(); // Destructure the required fields from the document.
        historyArray.push({ bet, won, balance, timestamp, restart, documentId }); // Add the document data to the history array.
    })
    return historyArray; // Return the array containing the user's play history.
}

// Function to delete a user's entire play history.
export async function removeAllUserHistory(userEmail) {
    // Define the query to select user's play history records for deletion.
    const deleteQuery = query(
        collection(db, CollectionName), // Reference to the specific database collection.
        where('email', '==', userEmail), // Filter by user email.
        orderBy('timestamp', 'desc'), // Order by the timestamp in descending order for consistency.
    );
    let querySnapshot = await getDocs(deleteQuery); // Execute the query to get the documents.

    // Loop through each document and delete it.
    await querySnapshot.forEach(async (historyRecord) => {
        await deleteDoc(historyRecord.ref); // Delete the document referenced by historyRecord.
    });
    // No return value needed as this function's purpose is to perform deletion.
}
