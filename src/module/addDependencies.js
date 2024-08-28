const { execSync } = require('child_process');

module.exports = {
    addDependencies: path => {
        execSync(`npm i @middy/core @middy/event-normalizer  winston @middy/ssm --prefix ${path}`);
        execSync(`npm i jest aws-sdk-client-mock prettier --prefix ${path} --save-dev`);
        execSync(`npm run format --prefix ${path}`);
    }
}