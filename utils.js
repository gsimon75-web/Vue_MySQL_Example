var log4js = require('log4js');
var logger = log4js.getLogger('utils.js');
var http = require('http');
var https = require('https');

module.exports.gwRESTCall = function(config, reqdata) {
    return new Promise((resolve, reject) => {
        var data = {
            "channel": config.channel,
            "chaincode": config.chaincode_name,
            "method": reqdata.method,
            "args": reqdata.args,
            "chaincodeVer": config.chaincode_ver
        };
        var dataStr = JSON.stringify(data);
        logger.debug('REQ BODY: ' + dataStr);
        var endpoint = config.gw_endpoint.replace(/https?:\/\//, '');
        var parts = endpoint.split(':');
        var options = {
            hostname: parts[0],
            port: parts[1],
            path: `/bcsgw/rest/v1/transaction/${reqdata.action}`,
            method: 'POST',
            auth: `${config.username}:${config.password}`,
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(dataStr)
            }
        };
        // options.agent = new http.Agent(options);

        var client = (config.gw_endpoint.indexOf('https:') == -1) ? http : https;
        const httpreq = client.request(options, (httpres) => {
            logger.debug('STATUS: ' + httpres.statusCode);
            logger.debug('HEADERS: ' + JSON.stringify(httpres.headers));
            if (httpres.statusCode >= 400) {
                resolve(JSON.stringify({error: "HTTP rejected", code: httpres.statusCode, reason: httpres.statusMessage}));
                return;
            }
            httpres.setEncoding('utf8');
            var body = '';
            httpres.on('data', function(chunk) {
                body += chunk;
            });
            httpres.on('end', function() {
                logger.debug('RESP BODY: ' + body)
                var obj = JSON.parse(body);
                if (obj.returnCode != 'Success')
                    reject(JSON.stringify({error: "BCS rejected", reason: obj.info}));
                else if (reqdata.action == 'query')
                    resolve(obj.result);
                else // 'invoke'
                    resolve(obj); // FIXME: maybe just "{}"
            });
        });

        httpreq.on('error', (e) => {
            console.error(e);
            reject(JSON.stringify({error: "REST Proxy error", reason: e.toString()}));
        });
        httpreq.write(dataStr);
        httpreq.end();
    });
}

// vim: set ts=4 sw=4 et:
