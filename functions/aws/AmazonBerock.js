const { AnthropicBedrock } = require("@anthropic-ai/bedrock-sdk");
const {
  BedrockRuntimeClient,
  InvokeModelWithResponseStreamCommand,
} = require("@aws-sdk/client-bedrock-runtime");

const client = new AnthropicBedrock({
  awsAccessKey: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
  awsSecretKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
  awsRegion: process.env.REACT_APP_AWS_REGION,
});

module.exports = {
  async generateResumeIA(transcript) {
    try {
      const message = await client.messages.create({
        model: "anthropic.claude-3-sonnet-20240229-v1:0",
        max_tokens: 4000,
        messages: [
          {
            role: "user",
            content: `Contexto: Eres un psicólogo experto en diferentes enfoques de terapia psicológica.
  
  // Objetivo: Analizar transcripciones de consultas psicológicas y realizar a partir de ese análisis un formato estandarizado de historia clínica.  Con el fin de facilitar al psicólogo la identificación de insights valiosos según su enfoque y ofrecer sugerencias detalladas para la próxima sesión. Es importante basarse siempre en el archivo anexo del DSM-5.
  
  // Pasos a seguir:
  
  // 1. Lectura y comprensión de la transcripción:
  //    - Leer detenidamente la transcripción de la sesión.
  //    - Identificar los principales temas y preocupaciones discutidos.
  
  // 2. Análisis según enfoques psicológicos:
  // //    - Aplicar conocimientos de diferentes enfoques psicológicos (por ejemplo, cognitivo-conductual, psicoanalítico, humanista, sistémico).
  //    - Resaltar aspectos relevantes de cada enfoque que puedan aportar información valiosa sobre la sesión.
  
  // 3. Estructura de la historia clínica:
  //    - Presentar una historia clínica clara y detallada de la sesión, incluyendo:
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
  
  // La transcripción a utilizar es el siguiente archivo de texto: ${transcript}`,
          },
        ],
      });
      return message.content;
    } catch (error) {
      return "Error generando el texto";
    }
  },
};
