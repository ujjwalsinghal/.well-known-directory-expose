'use strict';

/**
 * @namespace RedirectURL
 */

var server = require('server');

/**
 * RedirectURL-Start : The RedirectURL-Start endpoint handles URL redirects
 * @name Base/RedirectURL-Start
 * @function
 * @memberof RedirectURL
 * @param {category} - non-sensitive
 * @param {serverfunction} - get
 */



server.get('Start', function (req, res, next) {
    var URLRedirectMgr = require('dw/web/URLRedirectMgr');
    var origin = URLRedirectMgr.redirectOrigin;
    var redirect = URLRedirectMgr.redirect;
    var location = redirect ? redirect.location : null;
    var redirectStatus = redirect ? redirect.getStatus() : null;
    var associationFileJSONData = {
        "enabled": true,
        "filename": "/.well-known/apple-developer-merchantid-domain-association.txt",
    };
    // Get txt file content from content asset or site preference then render it 
    if (associationFileJSONData.enabled) {
        var URLRedirectMgr = require('dw/web/URLRedirectMgr');
        if (URLRedirectMgr.getRedirectOrigin() === associationFileJSONData.filename) {
            response.setContentType('text/plain');
            var fileContent = '';
            var asset = require('dw/content/ContentMgr').getContent('associationFileAsset');
            if (asset) {
                fileContent = asset.custom.body;
            }
            var p=0;
            //res.setViewData(fileContent);
            res.render('knownFolder', { Content: fileContent });
            //res.print("fileContent");
        }
    }
    // if (!location) {
    //     res.setStatusCode(404);
    //     res.render('error/notFound');
    // } else {
    //     if (redirectStatus) {
    //         res.setRedirectStatus(redirectStatus);
    //     }
    //     res.redirect(location);
    // }

    next();
});

// server.prepend('Start', function (req, res, next) {
//     var URLRedirectMgr = require('dw/web/URLRedirectMgr');
//     var redirect = URLRedirectMgr.redirect;
//     var location = redirect ? redirect.location : null;
//     if (!location) {
//         // check if a custom object is configured for the requested path
//         var CustomObjectMgr = require('dw/object/CustomObjectMgr');
//         var rootRequest = CustomObjectMgr.getCustomObject('RootRequest', URLRedirectMgr.redirectOrigin);
//         if (rootRequest) {
//             res.cachePeriod = 24; // eslint-disable-line no-param-reassign
//             res.cachePeriodUnit = 'hours'; // eslint-disable-line no-param-reassign
//             res.setContentType(rootRequest.custom.responseType);
//             res.print(rootRequest.custom.responseBody);
//             // we have now rendered the response for the requested path, no need to continue
//             this.emit('route:Complete', req, res);
//             return;
//         }
//     }
//     next();
// });
/**
 * RedirectURL-Hostname : The RedirectURL-Hostname endpoint handles Hostname-only URL redirects
 * @name Base/RedirectURL-Hostname
 * @function
 * @memberof RedirectURL
 * @param {querystringparameter} - Location - optional parameter to provide a URL to redirect to
 * @param {category} - non-sensitive
 * @param {serverfunction} - get
 */
server.get('Hostname', function (req, res, next) {
    var URLUtils = require('dw/web/URLUtils');

    var url = req.querystring.Location.stringValue;
    var hostRegExp = new RegExp('^https?://' + req.httpHost + '(?=/|$)');
    var location;

    if (!url || !hostRegExp.test(url)) {
        location = URLUtils.httpHome().toString();
    } else {
        location = url;
    }

    res.redirect(location);
    next();
});

module.exports = server.exports();
