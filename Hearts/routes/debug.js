"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/*
 * GET debug page.
 */
const express = require("express");
const router = express.Router();
router.get('/', (req, res) => {
    res.render('debug', { title: 'Debuggity' });
});
exports.default = router;
//# sourceMappingURL=debug.js.map