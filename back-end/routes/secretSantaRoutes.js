const express = require('express');
const multer = require('multer');
const secretSantaController = require('../controllers/secretController');
const router = express.Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});

const upload = multer({ storage: storage });



router.post('/upload', upload.fields([{ name: 'employees' }, { name: 'previousYear' }]), secretSantaController.uploadAndProcess);
router.post('/single/upload', upload.single('file'), secretSantaController.singleUploadAndProcess);

module.exports = router;