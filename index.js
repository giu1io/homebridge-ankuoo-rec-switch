/*
 * homebridge-ankuoo-rec-switch plugin
 */

var AnkuooRecApi = require('./ankuoo-rec')

var Service, Characteristic;

module.exports = function(homebridge) {
	Service = homebridge.hap.Service;
	Characteristic = homebridge.hap.Characteristic;
	homebridge.registerAccessory("homebridge-ankuoo-rec-switch", "AnkuooRecSwitch", AnkuooRecSwitch);
}

function AnkuooRecSwitch(log, config) {
	
	if (config.name  === undefined) {
		return log("Name missing from configuration.");
	}
	if (config.ip  === undefined) {
		return log("ip address missing from configuration.");
	}
	if (config.mac  === undefined) {
		return log("mac address missing from configuration.");
	}
	if (config.onCode  === undefined || config.offCode  === undefined ) {
		return log("onCode or offCode address missing from configuration.");
	}

	var arApi = new AnkuooRecApi(config.ip,config.mac,config.onCode,config.offCode);
	
	var informationService = new Service.AccessoryInformation();
	
	informationService
		.setCharacteristic(Characteristic.Name, "Rec Switch")
		.setCharacteristic(Characteristic.Manufacturer, "Ankuoo")
		.setCharacteristic(Characteristic.Model, "v1.0.0")
		.setCharacteristic(Characteristic.SerialNumber, config.mac);

	var switchService = new Service.Switch(config.name);

	switchService
		.getCharacteristic(Characteristic.On)
		.on('set', function(value, callback) {
		    arApi.setStatus(value);
		    callback();
	});
	
	switchService
		.getCharacteristic(Characteristic.On)
		.on('get', function(callback){
		    callback(null, arApi.getStatus());
		});

	this.services = [ informationService, switchService ];
}

AnkuooRecSwitch.prototype = {
    getServices : function (){
        return this.services;
    }
}