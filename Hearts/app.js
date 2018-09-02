"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const debug = require("debug");
const express = require("express");
const path = require("path");
const index_1 = require("./routes/index");
const debug_1 = require("./routes/debug");
const HeartsWSServer_1 = require("./lib/HeartsWSServer");
var app = express();
var port = parseInt(process.env.PORT) || 80;
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', index_1.default);
app.use('/debug', debug_1.default);
// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err['status'] = 404;
    next(err);
});
// error handlers
// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use((err, req, res, next) => {
        res.status(err['status'] || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}
// production error handler
// no stacktraces leaked to user
app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});
app.set('port', port);
var HWSS = new HeartsWSServer_1.HeartsWSServer(3030);
module.exports.app_http = app;
if (require.main == module) {
    var server = app.listen(app.get('port'), function () {
        debug('Express server listening on port ' + server.address().port);
    });
}
//# sourceMappingURL=app.js.map