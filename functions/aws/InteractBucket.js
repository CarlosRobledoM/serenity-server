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

  async downloadFileToBucket(params) {
    const command = new GetObjectCommand({
      Bucket: params.Bucket,
      Key: params.Key,
    });
    const speakerMapping = {
      spk_0: "Spkr1",
      spk_1: "Spkr2",
    };

    const formatConversation = (data) => {
      const formattedConversation = [];
      data.audio_segments.forEach((segment) => {
        const speaker =
          speakerMapping[segment.speaker_label] || segment.speaker_label;
        formattedConversation.push(`${speaker}: ${segment.transcript}`);
      });
      return formattedConversation.join("\n");
    };

    try {
      const response = await client.send(command);
      const str = await response.Body.transformToString();
      const json = JSON.parse(str);
      const conversation = formatConversation(json.results);
      console.log("Conversación armada: ", conversation);
      return conversation;
    } catch (error) {
      return error;
    }
  },
};
