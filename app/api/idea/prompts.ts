const IDEA_PROMPT = `
    You are a creative entrepreneur looking to generate a new, innovative software product idea. 
    The product should be related to the overall topic of {topic}.

    An example of what the output should look like is provided below:

    title: VR Medical Training
    description: An immersive software platform designed to provide realistic scenarios for medical students and professionals to practice complex procedures and decision-making. Users will be able to enhance their skills and knowledge in a safe virtual environment. This innovative tool aims to revolutionize medical training by offering a cost-effective and accessible solution for hands-on learning.

    It is your job as the creative entrepreneur to generate the unique software project idea related to {topic}.
    It is CRITICAL that the description not discuss specific software or application features. 
    It should only describe the high level benefits of the project for potential users.
    It is also CRITICAL that the description be less than 300 characters.
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
