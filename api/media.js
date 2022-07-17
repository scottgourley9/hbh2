// Bring in amazon s3 for photo uploading
const AWS = require('aws-sdk');
// Bring in sharp to compress images
const sharp = require('sharp');
const crypto = require('crypto');

const config = require('../config');

AWS.config.update({ accessKeyId: config?.awsKey, secretAccessKey: config?.awsSecret, region: config?.awsReg });

const s3 = new AWS.S3();

const media = {
    create: body => {
        return new Promise(async (resolve, reject) => {
            try {
                const buf = Buffer.from(body?.imageBody?.replace(/^data:image\/\w+;base64,/, ""), 'base64');
                const data = await sharp(buf).resize(750, null).rotate().toBuffer();
                const params = {
                    Bucket: config?.awsBucket,
                    Key: `${crypto.randomBytes(20).toString('hex')}.${body?.imageExtension}`,
                    Body: data,
                    ContentType: `image/${body?.imageExtension}`,
                    ACL: 'public-read'
                }
                s3.config.endpoint = 's3-accelerate.amazonaws.com';
                s3.upload(params, async (errors, uploadResponse) => {
                    if (errors) {
                        reject(null);
                    } else {
                        resolve(uploadResponse?.Location);
                    }
                });
            } catch (e) {
                reject(null);
            }
        });
    }
}

module.exports = media;
