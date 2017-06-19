const fs = require("fs")
const login = require("facebook-chat-api")
const Flickr = require('flickr-sdk')
const request = require('request')
var path = require('path');
var express = require('express');
import { GirlAPI, SimsimiAPI } from "./api/index"

var app = express();
import { Bot } from './bot/index'
const PORT = process.env.PORT || 3001;

var staticPath = path.join(__dirname, '/public');
app.use(express.static(staticPath));
app.get('/', function (req, res) {
    res.send('login!')
    _login()
})
app.get('/logout', function (req, res) {
    res.send('logout!')
    _api.logout()
})

app.listen(PORT, function () {
    console.log('listening');
});
var _api
var flickr = new Flickr({
    "apiKey": "7c5c8c4592462a24bbc7f0482de14d30",
    "apiSecret": "0fba93f4f9d42d94",
    // you can optionally include these values for testing
    // with your own account, but DO NOT use them for authenticating
    // users, see Authentication section below.
    "accessToken": "xxxxxxxxxxxxxxxxx-xxxxxxxxxxxxxxxx",
    "accessTokenSecret": "xxxxxxxxxxxxxxxx"
});
var simsimiAPI = new SimsimiAPI()
var girlAPI = new GirlAPI()
function download(uri, filename, callback) {
    request.head(uri, function (err, res, body) {
        console.log('content-type:', res.headers['content-type']);
        console.log('content-length:', res.headers['content-length']);

        request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
    });
}


// Simple echo bot. It will repeat everything that you say.
// Will stop when you say '/stop'
function _login() {
    login(JSON.parse(fs.readFileSync('appstate.json', 'utf8')), (err, api) => {
        _api = api
        if (err) {
            api.logout()
            _login()
        }
        api.setOptions({
            listenEvents: true,
            selfListen: true
        })

        var userID = api.getCurrentUserID()
        var listeningState = true;

        var listen = api.listen((err, event) => {
            if (err) return console.error(err);
            api.markAsRead(event.threadID, (err) => {
                if (err) console.error(err);
            });
            var bot = new Bot({ my_id: api.getCurrentUserID(), my_name: "Hoàng đẹp trai" })
            switch (event.type) {
                case "message":
                    api.getUserInfo(event.senderID, (err, friend) => {
                        var input = event.body,
                            sender_id = event.senderID,
                            sender_name = friend[event.senderID].name
                        var _res = bot.set({ input, sender_id, sender_name }).reply().get()
                        if (_res && _res.type) {
                            switch (_res.type) {
                                case "TEXT":
                                    api.sendMessage(_res.value, event.threadID);
                                    break
                                case "IMG":
                                    if (_res.value.src === "FLICKR") {
                                        if (_res.value.text) api.sendMessage(_res.value.text, event.threadID);
                                        _loadImageFromFlick(_res.value.key, api, event)
                                    }
                                    if (_res.value.src === "FACEBOOK") {
                                        if (_res.value.text) api.sendMessage(_res.value.text, event.threadID);
                                        _loadImageFromFacebook(_res.value.key, api, event)
                                    }
                                    break
                                case "SIMSIM": {
                                    simsimiAPI.getMessage(_res.value).then(result => {
                                        api.sendMessage(result, event.threadID);
                                    }, result => {
                                        var output = "Xin lỗi bot còn nhỏ dại nên không hiểu. Bạn gõ help xem?"
                                        api.sendMessage(output, event.threadID);  
                                    });
                                    break
                                }
                                default:
                                break
                            }
                        }
                        else console.log("_res: ", _res)
                        api.sendMessage(_res, event.threadID);
                    })
                    break;
                case "event":
                    console.log(event);
                    break;
            }

        });
    });
}
function _loadImageFromFlick(key, api, event) {
    flickr
        .request()
        .media()
        .search(key)
        .get()
        .then(function (response) {
            var rd = Math.floor((Math.random() * 99) + 1);
            var photo = response.body.photos.photo[rd]
            var url = `https://farm${photo.farm}.staticflickr.com/${photo.server}/${photo.id}_${photo.secret}.jpg`
            download(url, 'image.png', function () {
                var messageData = {
                    body: "",
                    attachment: fs.createReadStream(__dirname + '/../image.png')
                }
                api.sendMessage(messageData, event.threadID);
            })
        });
}
function _loadImageFromFacebook(key, api, event) {
    console.log(key)
    switch (key) {
        case "sexy": {
            var _func = girlAPI.getRandomSexyImage.bind(girlAPI, "169971983104176", 1070)
            break
        }
        case "nice": {
            var _func = girlAPI.getRandomGirlImage.bind(girlAPI)
            break
        }
        case "cute": {
            var _func = girlAPI.getRandomSexyImage.bind(girlAPI, "169971983104176", 1070)
            break
        }
        case "baby": {
            var _func = girlAPI.getRandomSexyImage.bind(girlAPI, "169971983104176", 1070)
            break
        }
        default: {
            var _func = girlAPI.getRandomGirlImage.bind(girlAPI)
            break
        }
    }
    _func().then(imgUrl => {
        download(imgUrl, 'image.png', function () {
            var messageData = {
                body: "",
                attachment: fs.createReadStream(__dirname + '/../image.png')
            }
            api.sendMessage(messageData, event.threadID);
        })
    });
}
_login()