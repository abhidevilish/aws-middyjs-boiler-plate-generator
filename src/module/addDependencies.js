const { execSync } = require("child_process");
const delay = require("../utils/delay");

module.exports = {
  addDependencies: async (path, envKeys) => {
    let dependenciesStr = `npm i @middy/core @middy/event-normalizer  winston`;
    let devDependenciesStr = `npm i jest babel-jest @babel/preset-env aws-sdk-client-mock prettier`;
    let ssmkeys = envKeys.filter((e) => e.startsWith("SSM"));

    if (ssmkeys.length) {
      dependenciesStr += ` @middy/ssm `;
      devDependenciesStr += ` @aws-sdk/client-ssm `;
    }
    devDependenciesStr +=
      process.env.SAVE_TO_S3 == "true" ? ` @aws-sdk/client-s3 ` : ``;
    devDependenciesStr +=
      process.env.SEND_SQS_MESSAGE == "true" ? ` @aws-sdk/client-sqs ` : ``;

    dependenciesStr += ` --prefix ${path}`;
    devDependenciesStr += ` --prefix ${path} --save-dev`;

    execSync(dependenciesStr);
    execSync(devDependenciesStr);
    // execSync(`npm i @middy/core @middy/event-normalizer  winston  --prefix ${path}`);
    // execSync(`npm i jest aws-sdk-client-mock prettier --prefix ${path} --save-dev`);
    await delay();
    execSync(`npm run format --prefix ${path}`);
  },
};
