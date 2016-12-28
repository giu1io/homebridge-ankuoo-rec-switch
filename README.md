# homebridge-ankuoo-rec-switch
[Homebridge](https://github.com/nfarina/homebridge/) plugin that integrates with Ankuoo Rec Switch

# Installation

1. Install homebridge: `npm install -g homebridge`
1. Install homebridge-rcswitch-gpiomem: `npm install -g  homebridge-ankuoo-rec-switch`
1. Update your homebridge configuration file.

# Configuration

See `sample-config.json`

All fields are required.To determine the onCode and offCode for your switch you have to sniff the packets transmitted from the mobile app to the switch (protocol UDP, port 18530) when you turn on and off the switch. The packet content (hex) will have the following structure:

- `0144` <- 2 bytes, constant
- `accf23xxxxxx` <- 6 bytes, mac address of your device
- `10` <- 1 byte, 10, length in bytes of the decrypted payload that follows
- `fd344f402a3f6299b530xxxxxxxxxxxx` <- encrypted payload, 16 bytes **this is your on/off code**.


##Fields:
- `accessory`: Must be `AnkuooRecSwitch` (case sensitive)
- `name` :: string :: What you want to call the switch. Keep in mind
  that Siri will prefer anything other than your homebridge switch if there's
  any confusion, so name it something unique
- `mac` :: string :: the mac address of your switch
- `ip` :: string :: the ip address of your switch (use a static ip)
- `onCode`, `offCode` :: string :: see instruction above on how to find your codes.

#FAQ

##Can I use this plugin with more than one Ankuoo switch?
In theory it should work, however I haven't tested it because I only own one switch. If you find any issues please let me know I will try to fix them.

##The switch is 'on' however my iPhone says it's 'off' (or vice versa)
With the knowledge I have right now (see next question) there's is not a reliable way to determine the switch status. The plugin assumes that all your switches are off when you start homebridge, then uses broadcast packets sent by the switch to keep track of the on/off status. If one of this packets gets lost or if the switch was on when you started homebridge, then the status will be inconsistent. To fix this turn off your switch and then restart homebridge.

##Why do I have to sniff the packets to find the on/off codes?
The packet structure is known ([source](https://forum.fhem.de/index.php/topic,57612.msg504597.html#msg504597)), because it's basically the same for all the manufactures that use **yunext.com** as a platform. However, the AES 128bit key used to encrypt the payload it's not the same (["0123456789abcdef"](https://forum.fhem.de/index.php/topic,38112.msg309817.html#msg309817)). If you find the key used to encrypt the payload please let me know and I will gladly update my plugin to not require this codes anymore. I would even rewrite it as a platform so you have to only set username and password and it does the rest by itself.

##I'm not convinced of your explanation...
I will have a post, explaining everything that I have tried to get this to work, up on my blog shortly.
