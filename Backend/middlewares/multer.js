import multer from 'multer';

const storage = multer.diskStorage({
    //Personalized config for storage at the disk
    filename: function(req, file, callback) {
        callback(null, file.originalname)
    }
});

const upload = multer({
    storage
});

export default upload;