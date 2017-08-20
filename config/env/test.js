'use strict';


if (process.platform == 'win32') {
    module.exports = require('./dev.windows');
}
else if (process.platform == 'darwin' || process.platform == 'linux') {
    module.exports = require('./dev.linux');
}
