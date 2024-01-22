import { ref, uploadBytesResumable } from "firebase/storage";
import { storage } from "../config/firebase-config";

export const uploadBlobToStorage = (file: File, path: string) => {
  const storageRef = ref(storage, `${path}/${file.name}`);
  const uploadTask = uploadBytesResumable(storageRef, file);
  return uploadTask;
};

export const getFilesInStorage = async (path: string) => { };

export const deleteFileFromDownloadURL = async (url: string) => { };

export const deleteFileFromStorage = async (url: string) => { };
