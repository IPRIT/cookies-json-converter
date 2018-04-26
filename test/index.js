var fs = require('fs');
var path = require('path');
var convert = require('../index');

var sourceFile = fs.readFileSync(path.join(__dirname, './source.txt')).toString();

/**
 * @param {string|number} postfix
 * @param {object} debugObject
 */
function writeDebugFile (postfix, debugObject) {
    postfix = postfix || '';
    var debugFilePath = path.join(__dirname, './results/result' + postfix + '.json');
    try {
        // ensure we haven't any files with specified name
        fs.unlinkSync( debugFilePath );
    } catch (e) {}
    fs.writeFileSync( debugFilePath, JSON.stringify(debugObject, null, 2) );
}

var testDomains = [
    /^(\.hh\.ru)/,
    /nanosemantics\.ru/,
    /\.vb\.yandex\.addons/,
    null
];

for (var domainIndex in testDomains) {
    writeDebugFile(
        domainIndex,
        convert(sourceFile, {
            domainRegExp: testDomains[ domainIndex ],
            ingoreErrors: true
        })
    );
}