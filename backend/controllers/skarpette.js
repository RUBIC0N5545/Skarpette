const Skarpette = require('../models/skarpette');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const dotenv = require('dotenv');

dotenv.config();

const s3Client = new S3Client({
    region: process.env.AWSREGION,
    endpoint: `https://s3.${process.env.AWSREGION}.amazonaws.com`,
    credentials: {
        accessKeyId: process.env.AWSACCESSKEYID,
        secretAccessKey: process.env.AWSSECRETACCESSKEY,
    },
});

async function uploadImageToS3(buffer, destination) {
    const params = {
        Bucket: process.env.AWSBUCKETNAME,
        Key: destination,
        Body: buffer,
    };

    const command = new PutObjectCommand(params);

    try {
        const data = await s3Client.send(command);
        return `https://${params.Bucket}.s3.${process.env.AWSREGION}.amazonaws.com/${destination}`;
    } catch (error) {
        console.error('Error uploading image to S3:', error);
        throw error;
    }
}

const createSkarpette = async (req, res) => {
    try {
        const skarpetteData = req.body;

        //main img upload
        if (req.files['main_image'] && req.files['main_image'][0]) {
            const mainImageFile = req.files['main_image'][0];
            const mainImageUrl = await uploadImageToS3(
                mainImageFile.buffer,
                `main_images/${mainImageFile.originalname}`
            );
            skarpetteData.main_image_url = mainImageUrl;
        }

        //additional img upload
        if (req.files['additional_images']) {
            const additionalImages = req.files['additional_images'];
            const additionalImagesUrls = await Promise.all(
                additionalImages.map(async (file) => {
                    const imageUrl = await uploadImageToS3(
                        file.buffer,
                        `additional_images/${file.originalname}`
                    );
                    return imageUrl;
                })
            );
            skarpetteData.additional_images = additionalImagesUrls;
        }

        if (!skarpetteData.main_image_url) {
            throw new Error('main_image_url is required');
        }

        const newSkarpette = await Skarpette.create(skarpetteData);
        res.status(201).json(newSkarpette);
    } catch (error) {
        console.error('Error creating skarpette:', error);
        res.status(400).json({ error: error.message });
    }
};

const getSkarpetteById = async (req, res) => {
    const { id } = req.params;
    try {
        const skarpette = await Skarpette.findById(id);
        if (!skarpette) {
            return res.status(404).json('Skarpette not found');
        }
        res.status(200).json(skarpette);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
const getAllSkarpettes = async (req, res) => {
    //Skarpettes?
    try {
        const skarpettes = await Skarpette.find();
        if (!skarpettes) {
            return res.status(404).json('Skarpettes not found');
        }
        res.status(200).json(skarpettes);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
const updateSkarpette = async (req, res) => {
    const { id } = req.params;
    const updates = req.body;
    try {
        let skarpette = await Skarpette.findById(id);
        if (!skarpette) {
            return res.status(404).json({ error: 'Skarpette not found' });
        }
        Object.keys(updates).forEach((key) => {
            if (updates[key] !== undefined) {
                skarpette[key] = updates[key];
            }
        });
        const updatedSkarpette = await skarpette.save();
        res.status(200).json(updatedSkarpette);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
const deleteSkarpette = async (req, res) => {
    const { id } = req.params;
    try {
        const skarpette = await Skarpette.findById(id);
        if (!skarpette) {
            return res.status(404).json({ error: 'Skarpette not found' });
        }
        await skarpette.deleteOne();
        res.status(200).json('Skarpette has been deleted');
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
const getSkarpettesByNameOrVendorCode = async (req, res) => {
    const { name, vendor_code } = req.query;
    try {
        let skarpettes;

        if (name) {
            skarpettes = await Skarpette.find({
                name: { $regex: new RegExp(name, 'i') },
            });
        } else if (vendor_code) {
            const vendorCode = parseInt(vendor_code);
            if (isNaN(vendorCode)) {
                return res
                    .status(400)
                    .json({ error: 'Invalid vendor code format' });
            }
            skarpettes = await Skarpette.find({ vendor_code: vendorCode });
        } else {
            return res
                .status(400)
                .json({ error: 'No search parameters provided' });
        }

        if (skarpettes.length === 0) {
            return res.status(404).json('Skarpettes not found');
        }
        res.status(200).json(skarpettes);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
const getFilteredSkarpettes = async (req, res) => {
    try {
        const { categories, color, size } = req.query;

        let filter = {};

        if (categories) {
            filter.categories = { $in: categories.split(',') };
        }
        if (color) {
            filter.color = { $in: color.split(',') };
        }
        if (size) {
            filter.size = { $in: size.split(',') };
        }

        const skarpette = await Skarpette.find(filter);
        res.status(200).json(skarpette);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const clearDB = async (req, res) => {
    try {
        await Skarpette.deleteMany({});
        res.status(200).json({
            message: 'Skarpette collection cleared successfully.',
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
module.exports = {
    createSkarpette,
    deleteSkarpette,
    getSkarpetteById,
    getAllSkarpettes,
    updateSkarpette,
    getSkarpettesByNameOrVendorCode,
    getFilteredSkarpettes,
    clearDB,
};
