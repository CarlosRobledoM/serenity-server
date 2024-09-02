const express = require("express");
const cors = require("cors");
const { generateResumeIA } = require("./functions/aws/AmazonBerock");
const {
  uploadFileToBucket,
  downloadFileToBucket,
} = require("./functions/aws/InteractBucket");
const {
  startTranscriptionRequest,
  getTranscriptionRequest,
} = require("./functions/aws/AmazonTranscribe");
const fileupload = require("express-fileupload");
const { getUsers, getSessions } = require("./functions/firebase/api");
require("./functions/cron");
const app = express();
app.use(express.json());
app.use(fileupload());
app.use(cors());
const port = process.env.PORT || 5000;

app.post("/upload", async (req, res) => {
  const upload = { Key: req.files.file.name, Body: req.files.file.data };
  const response = await uploadFileToBucket(upload);
  res.send(response);
});

app.post("/start", async (req, res) => {
  const response = await startTranscriptionRequest(req.body.audioName);
  res.send(response);
});

app.post("/get", async (req, res) => {
  const response = await getTranscriptionRequest(req.body.audioName);
  res.send(response);
});

app.post("/model", async (req, res) => {
  const transcript = await downloadFileToBucket(req.body.audioName);
  const resumeIA = await generateResumeIA(transcript);
  res.send({ transcription: transcript, resume: resumeIA });
});

app.listen(port, () => {
  console.log(`port runing in http://localhost:${port}`);
});
