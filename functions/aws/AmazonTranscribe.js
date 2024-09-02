const {
  TranscribeClient,
  StartTranscriptionJobCommand,
  GetTranscriptionJobCommand,
} = require("@aws-sdk/client-transcribe"); // CommonJS import

const transcribeClient = new TranscribeClient({ region: "us-east-2" });

module.exports = {
  async startTranscriptionRequest(filename) {
    const input = {
      TranscriptionJobName: filename,
      LanguageCode: "es-ES",
      Media: {
        MediaFileUri: `s3://audiosession/${filename}.mp3`,
      },
      OutputBucketName: "transcribsession",
    };
    const transcribeCommand = new StartTranscriptionJobCommand(input);

    try {
      const transcribeResponse = await transcribeClient.send(transcribeCommand);
      return {
        status: transcribeResponse.TranscriptionJob.TranscriptionJobStatus,
        transcriptJobName:
          transcribeResponse.TranscriptionJob.TranscriptionJobName,
      };
    } catch (error) {
      return error;
    }
  },

  async getTranscriptionRequest(filename) {
    try {
      const input = {
        TranscriptionJobName: filename,
      };
      const command = new GetTranscriptionJobCommand(input);
      const transcribeResponse = await transcribeClient.send(command);
      return {
        status: transcribeResponse.TranscriptionJob.TranscriptionJobStatus,
        transcriptJobName:
          transcribeResponse.TranscriptionJob.TranscriptionJobName,
      };
    } catch (error) {
      return error;
    }
  },
};
