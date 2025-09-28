import multer from "multer";
import path from "path";
import fs from "fs";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let postId = req.body.post_id || req.params.post_id;

    if (!postId && req.method === "POST") {
      const tempDir = "public/uploads/temp";
      if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir, { recursive: true });
      }
      cb(null, tempDir);
      return;
    }

    const uploadDir = `public/uploads/posts/${postId}`;
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const timestamp = Date.now();
    const randomNum = Math.round(Math.random() * 1e9);
    cb(null, `image-${timestamp}-${randomNum}${ext}`);
  }
});

const fileFilter = (req, file, cb) => {
  if (!file.mimetype.startsWith("image/")) {
    return cb(new Error("Only image files are allowed"), false);
  }

  const maxSize = 5 * 1024 * 1024;
  if (file.size > maxSize) {
    return cb(new Error("File size too large. Maximum 5MB allowed"), false);
  }

  cb(null, true);
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
    files: 10
  }
});

const postImageUpload = upload.array("images", 10);

const clearPostImages = (postId) => {
  const uploadDir = `public/uploads/posts/${postId}`;
  if (fs.existsSync(uploadDir)) {
    const files = fs.readdirSync(uploadDir);
    files.forEach(file => {
      const filePath = path.join(uploadDir, file);
      if (fs.statSync(filePath).isFile()) {
        fs.unlinkSync(filePath);
      }
    });
  }
};

const handleImageUpload = (req, res, next) => {
  postImageUpload(req, res, (err) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }

    if (req.files && req.files.length > 0) {
      req.uploadedImages = req.files.map(file => ({
        filename: file.filename,
        originalname: file.originalname,
        path: file.path,
        size: file.size
      }));
    }

    next();
  });
};

export { handleImageUpload, clearPostImages };
