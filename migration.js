const { initializeApp, cert } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");
const fs = require("fs").promises;

// Initialize Firebase Admin
const serviceAccount = require("./yourFirebaseServiceAccount.json");
initializeApp({
  credential: cert(serviceAccount),
});

const db = getFirestore();

async function migrateJsonToFirestore(jsonFilePath, collectionName) {
  try {
    const jsonData = await fs.readFile(jsonFilePath, "utf8");
    const data = JSON.parse(jsonData);

    let batch = db.batch();
    let operationCount = 0;
    const MAX_BATCH_SIZE = 500;

    async function commitBatch() {
      await batch.commit();
      console.log(`Committed batch of ${operationCount} operations`);
      batch = db.batch();
      operationCount = 0;
    }

    if (Array.isArray(data)) {
      // Add index for arrays
      for (let index = 0; index < data.length; index++) {
        const item = data[index];
        const docRef = db.collection(collectionName).doc();

        // Add order field to maintain sequence
        const documentData = {
          ...item,
          order: index, // Add numerical order
          timestamp: index, // Alternative: use timestamp for ordering
        };

        batch.set(docRef, documentData);
        operationCount++;

        if (operationCount >= MAX_BATCH_SIZE) {
          await commitBatch();
        }
      }
    } else if (typeof data === "object") {
      // For objects, preserve key order
      const entries = Object.entries(data);
      for (let index = 0; index < entries.length; index++) {
        const [key, value] = entries[index];
        const docRef = db.collection(collectionName).doc(String(key));

        const documentData =
          typeof value === "object"
            ? {
                ...value,
                order: index,
              }
            : {
                value,
                order: index,
              };

        batch.set(docRef, documentData);
        operationCount++;

        if (operationCount >= MAX_BATCH_SIZE) {
          await commitBatch();
        }
      }
    }

    // Commit remaining documents
    if (operationCount > 0) {
      await commitBatch();
    }

    console.log("Migration completed successfully!");
  } catch (error) {
    console.error("Error during migration:", error);
    throw error;
  }
}

// Query helper function to get ordered documents
async function getOrderedDocuments(collectionName) {
  try {
    const snapshot = await db
      .collection(collectionName)
      .orderBy("order", "asc")
      .get();

    const documents = [];
    snapshot.forEach((doc) => {
      documents.push({ id: doc.id, ...doc.data() });
    });

    return documents;
  } catch (error) {
    console.error("Error fetching ordered documents:", error);
    throw error;
  }
}

// Example usage
async function main() {
  try {
    await migrateJsonToFirestore("./yourJsonData.json", "collectionName");

    // Example: Fetch documents in order
    const orderedDocs = await getOrderedDocuments("collectionName");
    console.log("Documents in original order:", orderedDocs);

    process.exit(0);
  } catch (error) {
    console.error("Migration failed:", error);
    process.exit(1);
  }
}

main();

module.exports = { migrateJsonToFirestore, getOrderedDocuments };
