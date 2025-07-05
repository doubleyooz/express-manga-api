import { unlink } from "node:fs/promises";

export async function deleteFiles(filesArray) {
  const errors = [];

  // Map each file deletion attempt to a promise
  const deletionPromises = filesArray.map(async (fileObj) => {
    try {
      await unlink(fileObj.destination + fileObj.filename);
      console.log(`Successfully deleted ${fileObj.filename}`);
    }
    catch (error) {
      // Collect errors instead of throwing them immediately
      errors.push({ filename: fileObj.filename, error });
    }
  });

  // Wait for all deletion attempts to complete
  await Promise.all(deletionPromises);

  // Report errors after all deletions have been attempted
  if (errors.length > 0) {
    console.error("Errors occurred during deletion:");
    errors.forEach(({ filename, error }) => {
      console.error(`Failed to delete ${filename}:`, error.message);
    });
  }
}
