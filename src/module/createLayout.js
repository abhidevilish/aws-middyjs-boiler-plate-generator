const { createFolder } = require("./fileModule");
const { join } = require("path");

module.exports = {
  createLayout: (path) => {
    createFolder(join(path, "src"));
    createFolder(join(path, "src", "tests"));
    createFolder(join(path, "src", "utils"));
    createFolder(join(path, "src", "modules"));
    createFolder(join(path, "src", "store"));
    createFolder(join(path, "src", "examples"));
  },
};
