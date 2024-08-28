const { execSync } = require('child_process');
const delay = require('../utils/delay');

module.exports = {
    addDependencies:async path => {
        execSync(`npm i @middy/core @middy/event-normalizer  winston @middy/ssm --prefix ${path}`);
        execSync(`npm i jest aws-sdk-client-mock prettier --prefix ${path} --save-dev`);
        await delay()
        execSync(`npm run format --prefix ${path}`);
    }
}