require("dotenv").config();
const {
  TranscribeStreamingClient,
  StartMedicalStreamTranscriptionCommand,
} = require("@aws-sdk/client-transcribe-streaming");
const { MicrophoneStream } = require("microphone-stream");
const { Buffer } = require("buffer");

const aws = {
  AWS_REGION: process.env.AWS_REGION,
  AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
};
let microphoneStream = undefined;
const language = "es-US";
const SAMPLE_RATE = 44100;
let transcribeClient = undefined;

const encodePCMChunk = (chunk) => {
  const input = MicrophoneStream.toRaw(chunk);
  let offset = 0;
  const buffer = new ArrayBuffer(input.length * 2);
  const view = new DataView(buffer);
  for (let i = 0; i < input.length; i++, offset += 2) {
    let s = Math.max(-1, Math.min(1, input[i]));
    view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7fff, true);
  }
  return Buffer.from(buffer);
};

const createMicrophoneStream = async () => {
  microphoneStream = new MicrophoneStream();
  microphoneStream.setStream(
    await window.navigator.mediaDevices.getUserMedia({
      video: false,
      audio: true,
    })
  );
};

const createTranscribeClient = () => {
  transcribeClient = new TranscribeStreamingClient({
    region: aws.AWS_REGION,
    credentials: {
      accessKeyId: aws.AWS_ACCESS_KEY_ID,
      secretAccessKey: aws.AWS_SECRET_ACCESS_KEY,
    },
  });
};

const getAudioStream = async function* () {
  for await (const chunk of microphoneStream) {
    if (chunk.length <= SAMPLE_RATE) {
      yield {
        AudioEvent: {
          AudioChunk: encodePCMChunk(chunk),
        },
      };
    }
  }
};

const startStreaming = async (language, callback) => {
  const command = new StartMedicalStreamTranscriptionCommand({
    LanguageCode: language,
    MediaEncoding: "pcm",
    MediaSampleRateHertz: SAMPLE_RATE,
    AudioStream: getAudioStream(),
  });
  const data = await transcribeClient.send(command);
  for await (const event of data.TranscriptResultStream) {
    const results = event.TranscriptEvent.Transcript.Results;
    if (results.length && !results[0]?.IsPartial) {
      const newTranscript = results[0].Alternatives[0].Transcript;
      console.log(newTranscript);
      callback(newTranscript + " ");
    }
  }
};

module.exports = {
  async startRecording(callback) {
    console.log(
      "Variables: ",
      aws.AWS_REGION + aws.AWS_ACCESS_KEY_ID + aws.AWS_SECRET_ACCESS_KEY
    );
    if (
      !aws.AWS_REGION ||
      !aws.AWS_ACCESS_KEY_ID ||
      !aws.AWS_SECRET_ACCESS_KEY
    ) {
      return false;
    }

    if (microphoneStream || transcribeClient) {
      stopRecording();
    }
    createTranscribeClient();
    createMicrophoneStream();
    await startStreaming(language, callback);
  },

  async stopRecording() {
    if (microphoneStream) {
      microphoneStream.stop();
      microphoneStream.destroy();
      microphoneStream = undefined;
    }
  },
};
