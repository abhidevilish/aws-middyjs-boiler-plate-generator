const { renderFile } = require('ejs');
const { writeFile } = require('fs/promises');
const { join } = require('path');

module.exports = {
    generateCodeFromTemplates: async path => {
        //process templates

        const loggerTemplate = await renderFile(join(__dirname ,'../templates/logger.ejs'));
        const prettierTemplate = await renderFile(join(__dirname ,'../templates/prettier.ejs'));
        const testTemplate = await renderFile(join(__dirname ,'../templates/app.spec.ejs'));
        const appTemplate = process.env.INPUT_PARSER == 'SQS' ? await renderFile(join(__dirname ,'../templates/app/app.sqs.ejs')) :
            await renderFile(join(__dirname ,'../templates/app/app.sns-sqs.ejs'));

        //convert processed templates to respectiv scripts 
        await writeFile(join(path, 'src', 'logger.js'), loggerTemplate);
        await writeFile(join(path, 'prettier.json'), prettierTemplate);
        await writeFile(join(path, 'src', 'tests', 'app.spec.js'), testTemplate);
        await writeFile(join(path, 'src', 'app.js'), appTemplate);
        await writeFile(join(path, '.gitignore'), 'node_modules');


    }
}