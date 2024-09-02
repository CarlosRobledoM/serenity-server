const {
  S3Client,
  GetObjectCommand,
  PutObjectCommand,
} = require("@aws-sdk/client-s3");

const client = new S3Client({ region: "us-east-2" });

module.exports = {
  async uploadFileToBucket(file) {
    const command = new PutObjectCommand({
      Bucket: "audiosession",
      Key: file.Key,
      Body: file.Body,
      ContentType: "audio/mp3",
    });

    try {
      const response = await client.send(command);
      return response;
    } catch (error) {
      return error.message;
    }
  },

  async downloadFileToBucket(filename) {
    const command = new GetObjectCommand({
      Bucket: "transcribsession",
      Key: `${filename}.json`,
    });

    try {
      const response = await client.send(command);
      const str = await response.Body.transformToString();
      const json = JSON.parse(str);
      const transcriptText = json.results.transcripts[0].transcript;
      return transcriptText;
    } catch (error) {
      return error;
    }
  },
};
