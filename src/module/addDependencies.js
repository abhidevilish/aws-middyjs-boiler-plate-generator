const { execSync } = require('child_process');

module.exports = {
    addDependencies: path => {
        execSync(`npm i @middy/core @middy/event-normalizer prettier winston @middy/ssm --prefix ${path}`);
        execSync(`npm i @middy/core @middy/event-normalizer winston @middy/ssm  aws-sdk-client-mock --prefix ${path} --save-dev`);
        execSync(`npm run format --prefix ${path}`);
    }
}