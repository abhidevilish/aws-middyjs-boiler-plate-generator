require('dotenv').config()
const inquirer = require('inquirer');
const questions = require('./constants/questions.json');
const { join } = require('path');
const { createFolder, createPackageJson } = require('./module/fileModule');
const { createLayout } = require('./module/createLayout');
const { addDependencies } = require('./module/addDependencies');
const { generateCodeFromTemplates } = require('./module/generateCodeFromTemplates');


let generateBoilerPlate = async () => {
    try {
        const userInput = await inquirer.prompt(questions);
        const { name } = userInput;
        const lambdaPath = join(process.env.FOLDER_PATH, name);
        createFolder(lambdaPath);
        await createPackageJson(userInput, lambdaPath);
        createLayout(lambdaPath);
        generateCodeFromTemplates(lambdaPath)
        addDependencies(lambdaPath);
    } catch (error) {
        console.log("Error generating lambda", error);
    }
}
generateBoilerPlate()


