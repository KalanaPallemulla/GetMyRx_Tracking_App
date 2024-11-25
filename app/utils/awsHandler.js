import AWS from 'aws-sdk';

export default async function awsConfigureAndUpload(
  key,
  secret,
  fileName,
  filePath,
) {
  console.log(key, secret);
  AWS.config.update({
    accessKeyId: key,
    secretAccessKey: secret,
    region: 's3.us-east-2',
    // signatureVersion: 'v4',
  });

  try {
    const s3 = new AWS.S3();

    const params = {
      Bucket: 'getmyrx',
      Key: fileName,
      Body: filePath,
      // ContentEncoding: 'base64',
      // ContentType: 'image/png',
    };

    console.log(params);
    return await s3.upload(params).promise();
  } catch (error) {
    console.log(error);
  }
}
