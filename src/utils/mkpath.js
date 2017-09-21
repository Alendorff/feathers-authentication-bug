const fs = require('fs');
const path = require('path');

/**
 * Create dir recursively if it does not exist
 * @param {string} targetDir
 * @returns {string} targetDir
 */
module.exports = function mkpath (targetDir) {
  if (!fs.existsSync(targetDir)) {
    const splits = targetDir.split('/');
    if (splits[0] === '') splits[0] = '/';

    splits.forEach((dir, index) => {
      const parent = splits.slice(0, index).join('/');
      const dirPath = path.resolve(parent, dir);
      if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath);
      }
    });
  }

  return targetDir;
};
