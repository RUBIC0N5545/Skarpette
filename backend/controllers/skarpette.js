const Skarpette = require('../models/skarpette');
const { S3Client, DeleteObjectCommand } = require('@aws-sdk/client-s3');
const dotenv = require('dotenv');
const { v4: uuidv4 } = require('uuid');
const sharp = require('sharp');
const { Upload } = require('@aws-sdk/lib-storage');

dotenv.config();

//photos consts
const aspectRatioWidth = 9;
const aspectRatioHeight = 10;
const targetWidth = 900;
const targetHeight = Math.round(
    (targetWidth * aspectRatioHeight) / aspectRatioWidth
);

const s3Client = new S3Client({
    region: process.env.AWSREGION,
    endpoint: `https://s3.${process.env.AWSREGION}.amazonaws.com`,
    credentials: {
        accessKeyId: process.env.AWSACCESSKEYID,
        secretAccessKey: process.env.AWSSECRETACCESSKEY,
    },
});

async function uploadImageToS3(buffer, destination) {
    const upload = new Upload({
        client: s3Client,
        params: {
            Bucket: process.env.AWSBUCKETNAME,
            Key: destination,
            Body: buffer,
        },
    });

    try {
        const data = await upload.done();
        return `https://${process.env.AWSBUCKETNAME}.s3.${process.env.AWSREGION}.amazonaws.com/${destination}`;
    } catch (error) {
        console.error('Error uploading image to S3:', error);
        throw error;
    }
}
async function deleteImageFromS3(imageUrl) {
    const params = {
        Bucket: process.env.AWSBUCKETNAME,
        Key: imageUrl.split(
            `${process.env.AWSBUCKETNAME}.s3.${process.env.AWSREGION}.amazonaws.com/`
        )[1],
    };

    const command = new DeleteObjectCommand(params);

    try {
        const data = await s3Client.send(command);
        return data;
    } catch (error) {
        console.error('Error deleting image from S3:', error);
        throw error;
    }
}
const handleImageDeletion = async (skarpette, id) => {
    const deletePromises = skarpette.images_urls.map(async (imageUrl) => {
        const otherUses = await Skarpette.find({
            images_urls: imageUrl,
            _id: { $ne: id },
        });

        if (otherUses.length === 0) {
            await deleteImageFromS3(imageUrl);
        }
    });

    await Promise.all(deletePromises);
};
async function generateUniqueVendorCode() {
    let vendorCode;
    let isUnique = false;

    while (!isUnique) {
        vendorCode = Math.floor(1000000 + Math.random() * 9000000);
        const existingSkarpette = await Skarpette.findOne({
            vendor_code: vendorCode,
        });
        if (!existingSkarpette) {
            isUnique = true;
        }
    }

    return vendorCode;
}

const findSkarpettesByCriteria = async (criteria, res) => {
    try {
        const skarpettes = await Skarpette.find(criteria);
        if (!skarpettes || skarpettes.length === 0) {
            return res.status(404).json('Skarpettes not found');
        }
        res.status(200).json(skarpettes);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getSizesByType = (type) => {
    const sizes = {
        Men: ['25-27', '27-29', '29-31'],
        Women: ['23-25', '25-27'],
        Child: ['16', '18', '19-21', '21-23', '23-25'],
    };

    return sizes[type].map((size) => ({ size, is_available: true }));
};

const createSkarpette = async (req, res) => {
    try {
        const skarpetteData = req.body;
        skarpetteData.images_urls = [];

        skarpetteData.vendor_code = await generateUniqueVendorCode();

        // Upload images
        if (req.files && req.files.length > 0) {
            const images = req.files;
            const imagesUrls = await Promise.all(
                images.map(async (file) => {
                    const fileExtension = file.originalname.split('.').pop();
                    const newFileName = `${uuidv4()}.${fileExtension}`;
                    const resizedImage = await sharp(file.buffer).resize({
                        width: targetWidth,
                        height: targetHeight,
                        fit: sharp.fit.cover,
                    });
                    const imageUrl = await uploadImageToS3(
                        resizedImage,
                        `images/${newFileName}`
                    );
                    return imageUrl;
                })
            );
            skarpetteData.images_urls = imagesUrls;
        }

        if (skarpetteData.images_urls.length === 0) {
            throw new Error('At least one image is required');
        }

        // Transform the size data
        skarpetteData.size = [];
        Object.keys(req.body).forEach((key) => {
            if (key.startsWith('size[')) {
                skarpetteData.size.push({
                    size: req.body[key],
                    is_available: true,
                });
            }
        });

        // Check for sizes by type
        if (skarpetteData.size.length === 0) {
            const sizesByType = getSizesByType(skarpetteData.type);
            skarpetteData.size = sizesByType;
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
        if (req.query.filter) {
            return res
                .status(400)
                .json({ error: 'There should not be any query parameters' });
        }
        const skarpettes = await Skarpette.find();
        if (!skarpettes) {
            return res.status(404).json('Skarpettes not found');
        }
        res.status(200).json(skarpettes);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
const getNewSkarpettes = async (req, res) => {
    await findSkarpettesByCriteria({ is_new: true }, res);
};
const getFavotireSkarpettes = async (req, res) => {
    await findSkarpettesByCriteria({ is_favorite: true }, res);
};
const updateSkarpette = async (req, res) => {
    const { id } = req.params;

    try {
        let skarpette = await Skarpette.findById(id);
        if (!skarpette) {
            return res.status(404).json({ error: 'Skarpette not found' });
        }

        let newImagesUrls = [];

        if (req.files && req.files.length > 0) {
            await handleImageDeletion(skarpette, id);

            const images = req.files;
            const imagesUrls = await Promise.all(
                images.map(async (file) => {
                    const fileExtension = file.originalname.split('.').pop();
                    const newFileName = `${uuidv4()}.${fileExtension}`;
                    const resizedImage = await sharp(file.buffer).resize({
                        width: targetWidth,
                        height: targetHeight,
                        fit: sharp.fit.cover,
                    });
                    const imageUrl = await uploadImageToS3(
                        resizedImage,
                        `images/${newFileName}`
                    );
                    return imageUrl;
                })
            );
            newImagesUrls = imagesUrls;
        } else {
            newImagesUrls = skarpette.images_urls;
        }

        skarpette.images_urls = newImagesUrls;

        Object.keys(req.body).forEach((key) => {
            if (key !== 'images_urls' && req.body[key] !== undefined) {
                skarpette[key] = req.body[key];
            }
        });

        const updatedSkarpette = await skarpette.save();
        res.status(200).json(updatedSkarpette);
    } catch (error) {
        console.error('Error updating skarpette:', error);
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

        await handleImageDeletion(skarpette, id);

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
        const { type } = req.query;

        let filter = { is_in_stock: true };

        if (type) {
            filter.type = type;
        }

        await findSkarpettesByCriteria(filter, res);
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
    getNewSkarpettes,
    getFavotireSkarpettes,
};
