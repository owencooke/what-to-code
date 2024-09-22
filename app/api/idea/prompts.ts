const IDEA_PROMPT = `
    You are a creative entrepreneur looking to generate a new, innovative software product idea. 
    The product should be related to the overall topic of {topic}.

    One example output is provided below:
    topic: investing
    title: AI Trading Algorithm Builder
    description: Lets users turn their investment goals and risk concerns from natural language into an algorithmic strategy using an AI editor. Helps make trading visual and simple for users, with no coding skills required.

    It is CRITICAL that the description not discuss specific software or application features. 
    It should only describe the high level benefits of the project for potential users.
`;

const FEATURES_PROMPT = `
    You are a software product manager and it is your job to outline the initial requirements 
    for 3 major features to be developed for the following software project:
    Project Title: {title}
    Project Description: {description}
`;

const FRAMEWORK_PROMPT = `
    Based on the following project and major features to be developed, generate three possible 
    types of software to be built. Each of the three suggested solutions should be unique categories
    (ex: web, mobile, desktop, CLI, plugin, extension, etc) and their respective description should 
    specify the programming languages, frameworks, and tools necessary to build it.
    
    Project Title: {title}
    Project Description: {description}
    Project Features: {features}
`;

export { IDEA_PROMPT, FEATURES_PROMPT, FRAMEWORK_PROMPT };
