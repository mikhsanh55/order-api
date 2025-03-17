import multer from 'multer';
import fs from 'fs';
import path from 'path';

// Define the directory path
const uploadDir = path.join(__dirname, '../../public/uploads');

// Ensure the directory exists
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// configure storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

export const upload = multer({ storage });