const sharp = require('sharp');
const fs = require('fs');

module.exports = async (req, res, next) => {
    if (!req.file) {
        return next()
    };

    try {
        req.file.convertFilename = req.file.filename + '.webp';
        req.file.convertFilepath = req.file.path + '.webp';

        await sharp(req.file.path)
        .resize(206, 260)
        .webp(90)
        .toFile(req.file.convertFilepath)

        fs.unlink(req.file.path, (error) => {
            if(error){
                console.log(error);
            }
        });
        next();
    }
    catch(error) {
        res.status(403).json({ error });
    }
};
