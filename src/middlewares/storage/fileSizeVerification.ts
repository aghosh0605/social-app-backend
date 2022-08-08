import multer from "multer";
import Logger from "../../loaders/logger";

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const checkFileSize = async (req, res, files: any) => {
  const data = await new Promise((resolve) => {
    const cpUpload = upload.fields(files);
    cpUpload(req, res, (err) => {
      if (err) {
        Logger.error(err);
        resolve(err);
        return;
      }

      files.map((el) => {
        const fileName = req.files[el.name][0].originalname;
        const fileSize = req.files[el.name][0].size / 1000 / 1000;
        if (fileSize > 5) {
          resolve({ verified: false, message: `${fileName} size exceeded` });
        }
      });

      resolve({ verified: true, message: "file size in range" });
    });
  });

  return data;
};

export default checkFileSize;
