import fs from "fs";
import path from "path";

const __dirname = path.resolve(); // Give me the absolute path of my backend project folder

const deleteFile = (filePath) => {
  const absolutePath = path.join(__dirname, "public", filePath);

  fs.unlink(absolutePath, (err) => { // fs.unlink is a Node.js method to delete a file from the filesystem.
    if (err) {
      if (err.code === 'ENOENT') { // ENOENT → file not found error.
        console.log('File not found, skipping: ', filePath)
        return
      }
      throw err
    }
    console.log('DELETED FIle', filePath)
  });
};

export default deleteFile;
