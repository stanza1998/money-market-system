import { getDownloadURL, StorageReference, UploadTask } from "firebase/storage";
import { useState } from "react";
import { uploadBlobToStorage } from "../apis/FileUploadApi";

const waitForDownloadURL = async (ref: StorageReference) => {
  const $downloadUrl = await getDownloadURL(ref);
  return $downloadUrl;
};

interface UploadToStorageReturnType {
  isUploading: boolean;
  errorCode: string;
  progress: number;
  uploadFile: (file: File, path: string) => Promise<string>;
  onPause: () => void;
  onResume: () => void;
  onCancel: () => void;
}

const useUploadToStorage = (): UploadToStorageReturnType => {
  const [uploadTask, setUploadTask] = useState<UploadTask | undefined>();
  const [isUploading, setIsUploading] = useState(false);
  const [errorCode, setErrorCode] = useState("");
  const [progress, setProgress] = useState(0);

  const onPause = () => {
    if (uploadTask) uploadTask.pause();
  };

  const onResume = () => {
    if (uploadTask) uploadTask.resume();
  };

  const onCancel = () => {
    if (uploadTask) uploadTask.cancel();
  };

  const uploadFile = async (file: File, path: string) => {
    const uploadTask = uploadBlobToStorage(file, path);

    setIsUploading(true);

    setUploadTask(uploadTask);

    uploadTask.on("state_changed", (snapshot) => {
      const $progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      setProgress($progress);
    }, (error) => { },
      async () => {
        setErrorCode("");
        setIsUploading(false);
        setProgress(100);
      }
    );

    await uploadTask.then();
    const $downloadUrl = await waitForDownloadURL(uploadTask.snapshot.ref);

    return $downloadUrl;
  };
  return { isUploading, errorCode, progress, uploadFile, onPause, onResume, onCancel };
};

export default useUploadToStorage;
