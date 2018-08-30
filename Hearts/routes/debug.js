"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/*
 * GET debug page.
 */
var express = require("express");
var router = express.Router();
router.get('/', function (req, res) {
    res.render('debug', { title: 'Debuggity' });
});
exports.default = router;
//# sourceMappingURL=debug.js.map