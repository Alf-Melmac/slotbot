#!/usr/bin/env node

//Make the helper classes publicly available
global.PermissionHelper = require('./helper/permissionHelper');
global.MessageHelper = require('./helper/messageHelper');

require('./log').init();
require('./web').init();
require('./bot').init();