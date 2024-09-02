const cron = require("node-cron");
const { getUsers, updateItem } = require("./firebase/api");
const { getTranscriptionRequest } = require("./aws/AmazonTranscribe");
const { downloadFileToBucket } = require("./aws/InteractBucket");
const { generateResumeIA } = require("./aws/AmazonBerock");

const updateDBwithIA = async () => {
  const sessions = await getUsers();
  sessions.map(async (session) => {
    try {
      const fileName = `frobledo818-${session.name.replace(" ", "_")}`;
      if (session.resume === "La IA está analizando tú información...") {
        console.log("ENTRO")
        const transcriptStatus = await getTranscriptionRequest(fileName);
        if (transcriptStatus.status === "COMPLETED") {
          const transcript = await downloadFileToBucket(fileName);
          const resumeIA = await generateResumeIA(transcript);
          updateItem(session.id, {
            transcription: transcript,
            resume: resumeIA[0]?.text,
          });
        }
      }
    } catch (error) {
      console.log(error);
    }
  });
};

cron.schedule("* * * * *", updateDBwithIA);
