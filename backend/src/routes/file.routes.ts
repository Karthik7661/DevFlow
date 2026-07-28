import { Router } from 'express';
import { verifyToken } from '../middleware/auth.middleware';
import { checkWorkspaceRole } from '../middleware/workspace.middleware';
import { uploadFile, getFiles, deleteFile } from '../controllers/file.controller';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Setup multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../../uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});
const upload = multer({ storage });

const router = Router({ mergeParams: true });

router.use(verifyToken as any);

router.get('/', checkWorkspaceRole([]), getFiles as any);
router.post('/', checkWorkspaceRole([]), upload.single('file'), uploadFile as any);
router.delete('/:fileId', checkWorkspaceRole([]), deleteFile as any);

export default router;
