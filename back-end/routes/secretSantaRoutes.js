const express = require('express');
const multer = require('multer');
const secretSantaController = require('../controllers/secretController');
const router = express.Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, `${file.originalname}`);
    },
});

const upload = multer({ storage: storage });



router.post('/upload', upload.array('files',2), secretSantaController.uploadAndProcess);
router.post('/single/upload', upload.single('file'), secretSantaController.singleUploadAndProcess);

module.exports = router;