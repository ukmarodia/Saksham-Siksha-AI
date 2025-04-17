const {
    GoogleGenerativeAI,
    HarmCategory,
    HarmBlockThreshold,
  } = require("@google/generative-ai");
  
  const apiKey = process.env.EXPO_PUBLIC_GEMINI_API_KEY;
  const genAI = new GoogleGenerativeAI(apiKey);
  
  const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash",
  });
  
  const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 40,
    maxOutputTokens: 8192,
    responseMimeType: "application/json",
  };
  
  
    export const GenerateTopicsAIModel = model.startChat({
      generationConfig,
      history: [
        {
          role: "user",
          parts: [
            {text: "Learn Python : : As you are coaching teacher\n-User want to learn the topic \n-Generate  7-8 course Title for study (short)\n-Make sure it is related to description\n-Output will be ARRAY of String in JSON FORMAT only \n-Do not add any plain text in output\n"},
          ],
        },
        {
          role: "model",
          parts: [
            {text: "```json\n{\n  \"courseTitles\": [\n    \"Python Basics: A Gentle Introduction\",\n    \"Data Types and Structures in Python\",\n    \"Control Flow: Logic and Loops with Python\",\n    \"Functions: Building Reusable Code\",\n    \"Object-Oriented Programming with Python\",\n    \"File Handling and Input/Output in Python\",\n    \"Introduction to Python Modules and Packages\",\n    \"Error Handling and Debugging in Python\"\n  ]\n}\n```"},
          ],
        },
      ],
    });
  
    // const result = await chatSession.sendMessage("INSERT_INPUT_HERE");
    // console.log(result.response.text());
    export const GenerateCourseAIModel = model.startChat({
      generationConfig,
      history: [
        
      ],
    });
  