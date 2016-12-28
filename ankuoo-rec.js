// ankuoo-rec.js
// ========
module.exports = function AnkuooRecApi(ip,mac,onCode,offCode) {

    const PORT = '18530';
	const HOST = '0.0.0.0';

    var switchStatus = false;

	var headerString = "01"+"44"+mac.replace(/:/g, '')+"10";
	var headerData = Buffer.from(headerString,'hex');
	
	var onCodeData = Buffer.from(onCode,'hex');
	var onMessageData = Buffer.concat([headerData, onCodeData]);
	var offCodeData = Buffer.from(offCode,'hex');
	var offMessageData = Buffer.concat([headerData, offCodeData]);

	function sendPacket(message){
		var client = dgram.createSocket('udp4');
		client.send(message, 0, message.length, PORT, ip, function(err, bytes) {
		    // DEBUG: Commented out to avoid crashing homebridge
			//if (err) throw err;
		    client.close();
		});
	}

    var dgram = require('dgram');
	var server = dgram.createSocket('udp4');

	server.on('listening', function () {
	    var address = server.address();
	    //DEBUG: comment out, not useful while testing with homebridge.
		//console.log('UDP Server listening on ' + address.address + ":" + address.port);
	});

	server.on('message', function (message, remote) {
		// consider only the payload
		var messageCode = message.slice(9);
		// consider valid only packets sent by the switch and that are not identical to the ones we sent (avoids duplicates)
		if(remote.address==ip && !messageCode.equals(onCodeData) && !messageCode.equals(offCodeData)){
			switchStatus = !switchStatus;
		}
	});

	server.bind(PORT, HOST);

    return {
        getStatus: function() {
            return switchStatus;
        },
		setStatus: function(status) {
			if(status)
				sendPacket(onMessageData);
			else
				sendPacket(offMessageData);
		}
    };
};