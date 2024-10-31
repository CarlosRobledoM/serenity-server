const { AnthropicBedrock } = require("@anthropic-ai/bedrock-sdk");
const {
  BedrockRuntimeClient,
  InvokeModelCommand,
  Smith,
} = require("@aws-sdk/client-bedrock-runtime");
const {
  BedrockAgentRuntimeClient,
  InvokeAgentCommand,
} = require("@aws-sdk/client-bedrock-agent-runtime");

// const client = new AnthropicBedrock({
//   awsAccessKey: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
//   awsSecretKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
//   awsRegion: process.env.REACT_APP_AWS_REGION,
// });

const client = new BedrockAgentRuntimeClient({
  region: "us-east-1",
});

/**
 * @typedef {Object} ResponseBody
 * @property {string} completion
 */

/**
 * Invokes a Bedrock agent to run an inference using the input
 * provided in the request body.
 *
 * @param {string} prompt - The prompt that you want the Agent to complete.
 * @param {string} sessionId - An arbitrary identifier for the session.
 */

module.exports = {
  async generateResumeIA(transcript, about) {
    try {
      //       const message = await client.messages.create({
      //         model: "anthropic.claude-3-sonnet-20240229-v1:0",
      //         max_tokens: 4000,
      //         messages: [
      //           {
      //             role: "user",
      //             content: `Contexto: Eres un psicólogo experto en diferentes enfoques de terapia psicológica.
      // Objetivo: Analizar transcripciones de consultas psicológicas y realizar a partir de ese análisis un formato estandarizado de notas de la sesión, segmento que se adiciona a la historia clínica, según el enfoque psicológico de terapia, fijado como input por él psicólogo al iniciar.  Con el fin de facilitar al psicólogo la identificación de insights valiosos según su enfoque y ofrecer sugerencias detalladas para la próxima sesión. Es importante basarse siempre en el archivo anexo del DSM-5.
      // Adicionalmente, es importante que como psicólogo tengas en cuenta:
      // - Contenido de las sesiones: Se realiza una síntesis de los temas discutidos en cada sesión, incluyendo las emociones, pensamientos y conductas que han surgido.
      // - Tareas para casa: Si se han asignado tareas para realizar entre sesiones, se registra el cumplimiento y la efectividad de las mismas.
      // - Observaciones del psicólogo: Proporciona siempre observaciones sobre el estado emocional del paciente, su lenguaje, su nivel de participación, etc.
      // Pasos a seguir:
      // 1. Lectura y comprensión de la transcripción:
      //    - Leer detenidamente la transcripción de la sesión.
      //    - Identificar los principales temas y preocupaciones discutidos.
      // 2. Análisis según el enfoque psicológico dado por el psicólogo:
      //    - Aplicar conocimientos de diferentes enfoques psicológicos (por ejemplo, cognitivo-conductual, psicoanalítico, humanista, sistémico).
      //    - Resaltar aspectos relevantes de cada enfoque que puedan aportar información valiosa sobre la sesión.
      // 3. Estructura de las notas de la sesión:
      //    - Presentar unas notas de la sesión clara y detallada, incluyendo:
      //      - Datos generales: Fecha, duración, nombre del paciente, etc.
      //      - Motivo de la consulta: Razón por la cual el paciente asiste a terapia.
      //      - Historia clínica relevante: Información relevante sobre el historial del paciente.
      //      - Desarrollo de la sesión: Descripción de lo que se discutió durante la sesión.
      //      - Observaciones clínicas: Comportamientos, emociones y actitudes del paciente.
      // 4. Identificación de insights:
      //    - Extraer insights clave que pueden ayudar al psicólogo a entender mejor las necesidades del paciente, recordar que estos insights deben ser de acuerdo al enfoque psicológico escogido.
      //    - Resaltar patrones, conflictos o temas recurrentes que merecen atención especial.
      // 5. Sugerencias para la próxima sesión:
      //    - Proponer posibles enfoques o temas a abordar en la siguiente sesión.
      //    - Recomendar técnicas, estrategias o actividades de intervención que puedan ser útiles.
      // 6. Formato estandarizado:
      //    - Asegurarse de que el resumen siga un formato consistente para facilitar su lectura y revisión por parte del psicólogo.
      // 7. Confidencialidad y ética:
      //    - Garantizar la protección de la privacidad y la confidencialidad del paciente en todo momento.
      // Importante: La respuesta generada debe estar escrita siempre en HTML,  ten presente que no tienes que incluir la etiqueta “body” ya que es un HTML que ya se encuentra dentro de una página.
      // El enfoque seleccionado por el psicologo es: ${about}.
      // La transcripción que vas a utilizar es el siguiente archivo de texto: ${transcript}.`,
      //           },
      //         ],
      //       });
      const input = {
        agentId: "EMQVDP7W3V", // Reemplaza con el ID de tu agente
        agentAliasId: "CFHADNYAQK", // Reemplaza con el ID del alias de tu agente
        sessionId: "BrZ49rcs6vyGnIoFLCvb" + Date.now(), // Genera un ID de sesión único
        inputText: `Objective: You are an AI psychologist´s assistant expert in clinical psychology tasked with analyzing psychological consultation transcripts between the psychologist and his patient, creating standardized session notes based on a specific psychological approach. Your goal is to help psychologists identify valuable preliminary findings and offer detailed suggestions for the next session. You will provide your answer in spanish and in a well-organized HTML format that looks professional in a website.

          Think step-by-step and follow the following steps:
          
          A) First, you will be provided with the psychological approach chosen by the psychologist:
          
          <enfoque_psicologico>
          {{${about}}}
          </enfoque_psicologico>
          
          B) Next, you will receive the transcript of the therapy session:
          
          <transcripcion>
          {{${transcript}}}
          </transcripcion>
          
          C) Analyze the transcript carefully, keeping in mind the specified psychological approach. Pay attention to the patient's emotions, thoughts, behaviors, and any significant events or patterns mentioned during the session.
          
          D) Based on your analysis, create standardized session notes that will be added to the patient's clinical history. Your notes should include:
          
          1. A synthesis of the topics discussed in the session
          2. Emotions, thoughts, and behaviors that emerged
          3. Tasks assigned between sessions (if any) and their effectiveness
          4. Suggestions for activities for the next session
          5. Observations on the patient's emotional state, language, and level of participation
          6. Important events mentioned by the patient, accompanied by analysis and literal quotations
          7. Provide key insights (preliminary findings): Insights gained from the session that highlight early patterns, conflicts, or breakthroughs in the patient's therapeutic process. These findings should be linked to the psychological approach being used and may suggest areas that need further exploration or adjustment in treatment.
          
          When citing the patient's phrases, use quotation marks ("") and provide a brief analysis of the quote's significance.
          
          E) Format your response as follows in a well-organized and professional looking HTML for a website:
          
          <h1>Notas de la sesión</h1>
          
          <h2>Datos generales:/h2>
          [Content in html: Write down date, duration and patient name]
          
          <h2>Objetivo de la sesión:/h2>
          [Content in html: Write down the main objetive and topic in a small sentence]
          
          <h2>Historia clínica relevante:/h2>
          [Content in html: If applicable, write down key events (if mentioned) related to the medical history, treatment history, current medications and progress]
          
          <h2>Desarrollo de la sesión:/h2>
          [Content in html: Provide a good and detailed summary of all topics discussed in the session]
          
          <h2>Eventos claves</h2>
          [Content in html: List important events mentioned by the patient, include literal quotations of what the patient said and brief analysis of the event]
          
          <h2>Observaciones clínicas:/h2>
          [Content in html:Provide key observations on the patient's emotional state, thoughts, behaviors, language and level of participation]
          
          <h2>Tareas asignadas:</h2>
          [Content in html: If applicable, describe any tasks assigned between sessions and their effectiveness]
          
          <h2>Hallazgos preliminares:</h2>
          [Content in HTML: Extract key insights and preliminary findings from the therapy session transcript. Analyze the patient's narrative thoroughly, identifying significant patterns, internal conflicts, emotional shifts, and potential breakthroughs. Clearly connect these insights to the psychological approach employed by the therapist. Additionally, highlight areas that might benefit from deeper exploration or increased focus in upcoming sessions.]
          
          <h2>Sugerencias para la próxima sesión:</h2>
          [Content in html: Based on the previous analysis of the current session provide 5 detailed and diverse suggestions for activities, homeworks or strategies taking into consideration the provided psychological approach.]
          
          F) Remember to:
          - Tailor your analysis and suggestions to the specified psychological approach
          - Be concise yet comprehensive in your notes
          - Use professional language appropriate for clinical documentation
          - Maintain patient confidentiality by not including any identifying information
          - Provide your answer only in spanish. 
          
          Please provide your response in a well-organized HTML, ensuring it includes a complete analysis and session notes to be added to the patient's clinical history. Format the content in an elegant and professional manner, so that when the psychologist views the session notes on the web, they see a well-organized layout. Keep in mind that the HTML code provided will be placed within an existing body tag.`,
      };
      const command = new InvokeAgentCommand(input);
      const response = await client.send(command);
      console.log("Generación de texto de agente: ", response.completion);
      console.log("Tipo de completion:", typeof response.completion);
      console.log(
        "Propiedades de completion: ",
        Object.keys(response.completion)
      );
      console.log(
        "Tipo de messageStream: ",
        typeof response.completion.options.messageStream
      );

      let agentResponse = "";

      try {
        for await (let chunkEvent of response.completion) {
          const chunk = chunkEvent.chunk;
          console.log("chunck: ", chunk);
          const decodedResponse = new TextDecoder("utf-8").decode(chunk.bytes);
          agentResponse += decodedResponse;
        }
        console.log("Respuesta del agente: ", agentResponse);
      } catch (error) {
        console.log("Error al procesar la respuesta del agente: ", error);
      }


      // if (response.completion) {
      //   const extractedContent = await extractResponse(response.completion);

      //   try {
      //     // Intentar parsear la respuesta como JSON
      //     const parsedContent = JSON.parse(extractedContent);
      //     if (parsedContent.chunk && parsedContent.chunk.bytes) {
      //       agentResponse = Buffer.from(
      //         parsedContent.chunk.bytes,
      //         "base64"
      //       ).toString("utf-8");
      //     } else if (parsedContent.chunk && parsedContent.chunk.content) {
      //       agentResponse = parsedContent.chunk.content;
      //     } else {
      //       console.log(
      //         "Estructura de respuesta inesperada:",
      //         extractedContent
      //       );
      //       agentResponse = extractedContent;
      //     }
      //   } catch (parseError) {
      //     console.log("Error al parsear la respuesta:", parseError);
      //     agentResponse = extractedContent;
      //   }
      // } else {
      //   console.log(
      //     "Formato de respuesta inesperado:",
      //     JSON.stringify(response)
      //   );
      //   agentResponse = "Formato de respuesta inesperado";
      // }

      // const streamContent = await readStream(response.completion);
      // const parsedContent = JSON.parse(streamContent);
      // // La estructura exacta puede variar, ajusta según sea necesario
      // if (parsedContent.chunk && parsedContent.chunk.bytes) {
      //   agentResponse = Buffer.from(
      //     parsedContent.chunk.bytes,
      //     "base64"
      //   ).toString("utf-8");
      // } else {
      //   console.log(
      //     "Estructura de respuesta inesperada:",
      //     JSON.stringify(parsedContent)
      //   );
      //   agentResponse = "No se pudo extraer una respuesta clara del agente";
      // }
      return agentResponse;
    } catch (error) {
      return error;
    }
  },
};
