import { promises as fsPromises } from "fs";

const folderAlreadyExist = async (path) => {
  try {
    await fsPromises.access(path);
    return true;
  } catch (error) {
    return false;
  }
};
const createFolderIfNotExist = async (folderName) => {
  if (!(await folderAlreadyExist(folderName))) {
    await fsPromises.mkdir(currentPath);
  }
};

export default createFolderIfNotExist;
