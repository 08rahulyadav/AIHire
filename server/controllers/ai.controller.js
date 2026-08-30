import ai from "../utils/gemini.js";

const testAI = async (req, res, next) => {
  try {
    const interaction = await ai.interactions.create({
      model: "gemini-3.6-flash",
      input: "Say hello to AIHire in one short sentence.",
    });

    return res.status(200).json({
      success: true,
      message: interaction.output_text,
    });
  } catch (error) {
    next(error);
  }
};

export { testAI };