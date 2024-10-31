const cron = require("node-cron");
const { getUsers, updateItem, getSessions } = require("./firebase/api");
const { downloadFileToBucket } = require("./aws/InteractBucket");
const { generateResumeIA } = require("./aws/AmazonBerock");

const updateDBwithIA = async () => {
  const bucket = "transcribsession";
  const key = "5yZp0GK6yTUHopeQAi2Fpx59JQg1-BrZ49rcs6vyGnIoFLCvb.json";
  const params = {
    Bucket: bucket,
    Key: key,
  };
  const idUser = key.split(/-|[.]/)[0];
  const idSession = key.split(/-|[.]/)[1];

  const users = await getUsers();
  const user = users.filter((user) => user.id === idUser);
  const sessions = await getSessions(user[0].id);
  const session = sessions.filter((session) => session.id === idSession);

  // if (session[0].resume === "La IA está analizando tú información...") {
    console.log("Hace falta información");
    const transcript = await downloadFileToBucket(params);
    console.log("Transcripcion:", transcript);
    const resumeIA = await generateResumeIA(transcript, session[0].focus);
    console.log("Resumen", resumeIA);
    // await updateItem(user[0].id, session[0].id, {
    //   transcription: transcript,
    //   resume: resumeIA[0]?.text,
    // });
    console.log("Información actualizada");
  // }
};

cron.schedule("* * * * *", updateDBwithIA);
