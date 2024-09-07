const { existsSync, mkdirSync } = require("fs");
const { writeFile } = require("fs/promises");
const { join } = require("path");

module.exports = {
  createFolder: (path) => {
    if (!existsSync(path)) mkdirSync(path);
  },
  createPackageJson: async (userInput, lambdaPath) => {
    const { name, description, keywords, author } = userInput;
    let packageJson = {
      name,
      description,
      version: "1.0.0",
      main: "app.js",
      scripts: {
        test: "node --experimental-vm-modules node_modules/jest/bin/jest.js",
        format: "prettier --write .",
      },
      type : "module",
      keywords: keywords?.split(",") || [],
      author,
      license: "ISC",
    };
    await writeFile(
      join(lambdaPath, "package.json"),
      JSON.stringify(packageJson),
    );
  },
};
