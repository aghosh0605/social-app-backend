import multer from "multer";
import Logger from "../../loaders/logger";

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const checkFileSize = async (req, res, name: string) => {
  const data = await new Promise((resolve) => {
    upload.single(name)(req, res, (err) => {
      if (err) {
        Logger.error(err);
        resolve(err);
        return;
      }

      const fileSize = req.file.size / 1000 / 1000;

      if (fileSize > 5) {
        resolve({ verified: false, message: "file size exceeded" });
      }

      resolve({ verified: true, message: "file size in range" });
    });
  });

  return data;
};

export default checkFileSize;
