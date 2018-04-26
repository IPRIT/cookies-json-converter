// https://regex101.com/r/4f1Nx6/1/
var COOKIE_REGEXP = /^(\.?([a-zA-Zа-яА-ЯёЁ0-9-_]+\.?)*)\s(true|false)\s(\/([a-zA-Zа-яА-ЯёЁ0-9-_.]+\/?)*)\s(true|false)\s(\d+)\s(.*)\t(.*)/gmiu;
var DEFAULT_OPTIONS = {
    ignoreErrors: false,
    domainRegExp: null
};

/**
 * @param {object} options target
 * @param {object} defaultOptions
 */
function mergeOptions (options, defaultOptions) {
    return Object.assign({}, defaultOptions, options || {});
}

/**
 * Throws errors conditionally if `ignoreErrors` is true
 * @param {string|*} error
 * @param {boolean} ignoreErrors
 */
function throwError (error, ignoreErrors) {
    if (!ignoreErrors) {
        throw (typeof error === 'string' ? new Error(error) : error);
    }
}

/**
 * @param {string} string - source text
 * @param {object} options
 */
function convert (string, options) {
    options = mergeOptions(options, DEFAULT_OPTIONS);

    var domainRegExp = options.domainRegExp;
    var ignoreErrors = options.ignoreErrors;

    if (!string) {
        throwError('Source string not specified', ignoreErrors);
    }

    var match, list = [];
    while ((match = COOKIE_REGEXP.exec(string)) !== null) {
        // This is necessary to avoid infinite loops with zero-width matches
        if (match.index === COOKIE_REGEXP.lastIndex) {
            COOKIE_REGEXP.lastIndex++;
        }
        var isSecure = match[6] === 'TRUE';
        var expiry = Number(match[7]);
        var expiryObject = {
            expires: new Date(expiry * 1000).toUTCString(),
            expiry: expiry
        };

        var cookieObject = {
            domain: match[1],
            httponly: isSecure,
            name: match[8],
            path: match[4],
            secure: isSecure,
            value: match[9]
        };

        if (expiry) {
            Object.assign(cookieObject, expiryObject);
        }

        list.push(cookieObject);
    }

    if (!domainRegExp) {
        return list;
    }

    return list.filter(function (cookieObject) {
        return domainRegExp.test( cookieObject.domain );
    });
}

module.exports = convert;