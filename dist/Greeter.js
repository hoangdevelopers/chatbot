(function (global, factory) {
    if (typeof define === "function" && define.amd) {
        define("Greeter", ["request", "atob", "request", "atob", "fs", "facebook-chat-api", 'flickr-sdk', 'request', 'path', 'express', "string_score", "string_score"], factory);
    } else if (typeof exports !== "undefined") {
        factory(require("request"), require("atob"), require("request"), require("atob"), require("fs"), require("facebook-chat-api"), require('flickr-sdk'), require('request'), require('path'), require('express'), require("string_score"), require("string_score"));
    } else {
        var mod = {
            exports: {}
        };
        factory(global.request, global.atob, global.request, global.atob, global.fs, global.facebookChatApi, global.flickrSdk, global.request, global.path, global.express, global.string_score, global.string_score);
        global.Greeter = mod.exports;
    }
})(this, function (request$1, atob, request$2, atob$1, fs, login, Flickr, request, path, express) {
    'use strict';

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var _createClass = function () {
        function defineProperties(target, props) {
            for (var i = 0; i < props.length; i++) {
                var descriptor = props[i];
                descriptor.enumerable = descriptor.enumerable || false;
                descriptor.configurable = true;
                if ("value" in descriptor) descriptor.writable = true;
                Object.defineProperty(target, descriptor.key, descriptor);
            }
        }

        return function (Constructor, protoProps, staticProps) {
            if (protoProps) defineProperties(Constructor.prototype, protoProps);
            if (staticProps) defineProperties(Constructor, staticProps);
            return Constructor;
        };
    }();

    var GirlAPI = function () {
        function GirlAPI() {
            _classCallCheck(this, GirlAPI);

            this._tumblrKey = process.env.TUMBLR_TOKEN || atob("STVKWUNTVnFueXBET1lrYjdZdHBZN1JLME91ZmRHT0ZKZ1FTNUZFaXp2eFNHcXEwRjA=");
            this._tumblrUrl = "https://api.tumblr.com/v2/blog/xkcn.info/posts/photo";

            this._fbToken = "EAAaPavD3y7YBAAdxFdPvgbAbaQ5WUKTUZBR3zkhMKy3vJTpQMmm2M3TZAaTe4apkrw2he3ZADtsZAMW6TGyInQsTokoSFZAVrZAZBQKXPjPPJjWXYyh5wEJ2YjsdXwZBAhoe6tWV4opZC99b5X95wFewQHSOZBwpw19vSKtbDaFXZCjMQZDZD";
            this._pageId = "637434912950811";
            this._fbUrl = "https://graph.facebook.com/v2.6/" + this._pageId + "/photos/";
        }

        _createClass(GirlAPI, [{
            key: "getRandomGirlImage",
            value: function getRandomGirlImage() {
                var _this = this;

                console.log("Xinh nhe nhang page");
                var max = 4500;
                var randomIndex = Math.floor(Math.random() * max);

                return new Promise(function (resolve, reject) {
                    request$1({
                        url: _this._tumblrUrl,
                        qs: {
                            api_key: _this._tumblrKey,
                            limit: 1,
                            offset: randomIndex
                        },
                        method: "GET"
                    }, function (err, response, body) {
                        if (err) {
                            reject(err);
                            return;
                        }

                        var rs = JSON.parse(body);
                        var imageUrl = rs.response.posts[0].photos[0].original_size.url;
                        resolve(imageUrl);
                    });
                });
            }
        }, {
            key: "getRandomSexyImage",
            value: function getRandomSexyImage(pageId, maxIndex) {
                var _this2 = this;

                var randomIndex = Math.floor(Math.random() * maxIndex);

                return new Promise(function (resolve, reject) {
                    request$1({
                        url: "https://graph.facebook.com/v2.6/" + pageId + "/photos/",
                        qs: {
                            type: "uploaded",
                            fields: "images",
                            limit: 1,
                            offset: randomIndex,
                            access_token: _this2._fbToken
                        },
                        method: "GET"
                    }, function (err, response, body) {
                        if (err) {
                            reject(err);
                            return;
                        }

                        var rs = JSON.parse(body);
                        var imageUrl = rs.data[0].images[0].source;
                        resolve(imageUrl);
                    });
                });
            }
        }]);

        return GirlAPI;
    }();

    var SimsimiAPI = function () {
        function SimsimiAPI() {
            _classCallCheck(this, SimsimiAPI);

            this._key = process.env.SIM_TOKEN || atob$1("ODZlZmJlNjktY2U1Yi00MzZmLWJhNGEtMWE5NDMxMGUyMGY2");
            this._url = "http://api.simsimi.com/request.p?key=" + this._key + "&lc=vn&text=";

            this._freeUrl = "http://newapp.simsimi.com/v1/simsimi/talkset?uid=10034&av=6.7.1&lc=vn&cc=vn&tz=Vietnam&os=a&isFilter=0&message_sentence=";
        }

        _createClass(SimsimiAPI, [{
            key: "getMessage",
            value: function getMessage(text) {
                var _this3 = this;

                return new Promise(function (resolve, reject) {
                    request$2({
                        url: _this3._url + encodeURI(text),
                        method: "GET"
                    }, function (err, response, body) {
                        if (err) {
                            reject();
                            return;
                        }

                        var rs = JSON.parse(body);
                        if (rs.result === 100) {
                            resolve(rs.response);
                        } else if (rs.result === 509) {
                            resolve("Các bạn chat nhiều quá API hết 100 limit cmnr. Mai bạn quay lại nhé :'(. ");
                        } else {
                            reject();
                        }
                    });
                });
            }
        }, {
            key: "getMessageFree",
            value: function getMessageFree(text) {
                var _this4 = this;

                return new Promise(function (resolve, reject) {
                    request$2({
                        url: _this4._freeUrl + encodeURI(text),
                        method: "GET"
                    }, function (err, response, body) {
                        if (err) {
                            reject();
                            return;
                        }

                        var rs = JSON.parse(body);
                        var reply = rs.simsimi_talk_set.answers[0].sentence;
                        resolve(reply);
                    });
                });
            }
        }]);

        return SimsimiAPI;
    }();

    var data = [{
        "input": ["blabala", "bla bla"],
        "output": "xàm xí"
    }, {
        "input": ["benh v~", "benh vai"],
        "output": "@yourname bệnh hoạn chứ j?"
    }, {
        "input": ["vai l", "vai leu"],
        "output": "ngon"
    }, {
        "input": ["xin chao", "hi", "hello", "alo"],
        "output": "chào @yourname"
    }, {
        "input": ["ban ten la gi"],
        "output": "đại ca là @myname"
    }, {
        "input": ["du", "dm cut", "cut", "dm", "dau ma", "dcm", "vkl", "vl", "du ma", "bi dien", "bo lao", "me may", "ccmm", "ccmn", "fuck", "con cac"],
        "output": "mất dạy"
    }, {
        "input": ["sao day", "bi sao", "nam thao"],
        "output": "Bị bình thường thôi!"
    }, {
        "input": ["la sao"],
        "output": "Anh không biết bao nhiêu sao trên trời?"
    }, {
        "input": ["thoi", "stop", "dung lai"],
        "output": "Nữa đi mà?"
    }, {
        "input": ["noi gi"],
        "output": "nói gì thì nói?"
    }, {
        "input": ["khong hieu", "k hieu", "khong biet", "k biet"],
        "output": "Hiểu sao được?"
    }, {
        "input": ["choi khong", "choi ko", "choi"],
        "output": "ko, có việc r"
    }, {
        "input": ["bot tu dong", "botchat", "bot chat"],
        "output": "đúng rồi mình là chat bot của @myname"
    }, {
        "input": [":))", "=))"],
        "output": "cười cái gì"
    }, {
        "input": [":((", "=(("],
        "output": "nín"
    }, {
        "input": [":P"],
        "output": "nàm thao"
    }, {
        "input": ["khong biet", "k biet"],
        "output": "tại sao phải biết"
    }, {
        "input": [":v"],
        "output": ":)"
    }, {
        "input": ["sao phai", "thi sao"],
        "output": "ý kiến gì"
    }, {
        "input": ["ngu", "dot"],
        "output": "@yourname cũng vậy :v"
    }, {
        "input": ["bot kem", "may kem"],
        "output": "từ từ sẽ gỏi"
    }, {
        "input": ["kaka", "kk", "haha"],
        "output": "có gì vui?"
    }, {
        "input": ["may gio", "bay gio", "may gio rui", "may gio roi"],
        "output": "bây giờ là @nowtime"
    }, {
        "input": ["hom nay", "ngay nao", "thu may"],
        "output": "hôm nay là @nowday"
    }, {
        "input": ["di lam", "dang lam", "lam gi", "lam j"],
        "output": "đang ở nhà ăn bám"
    }, {
        "input": ["dang lam gi"],
        "output": "ngồi trả lời tin nhắn @yourname thôi"
    }, {
        "input": ["password", "mat khau"],
        "output": "*******"
    }, {
        "input": ["hoang", "a hoang", "e ku", "m oi"],
        "output": "a đây"
    }, {
        "input": ["e oi"],
        "output": "e nào"
    }, {
        "input": ["cho hoi", "hoi cai"],
        "output": "cái j a cũng không biết trừ ngày giờ là a biết"
    }, {
        "input": ["?", "??", "hoi cham"],
        "output": "thắc mắc lên phường"
    }, {
        "input": [":3"],
        "output": "B-)"
    }, {
        "input": ["ngu hoc", "oc cho"],
        "output": "@yourname óc chó"
    }, {
        "input": ["bo tay", "chiu may", "chiu roi"],
        "output": "hahah hay k?"
    }, {
        "input": ["cam on", "thank", "nice", "hay qua", "gioi qua", "good job", "hay nhi", "hay ghe"],
        "output": "Không có chi. Rất vui vì đã giúp được cho @yourname ^_^"
    }, {
        "input": ["cut", "bien"],
        "output": "tát vỡ mồm thằng @yourname"
    }, {
        "input": ["@trai", "@gay"],
        "output": "Lêu lêu đồ biến thái"
    }, {
        "input": ["good", "luck", "nice"],
        "output": "cảm ơn nha!"
    }, {
        "input": ["la tu gi", "tu gi", "tu j", "tu nao"],
        "output": "từ NGHIÊNG!"
    }];

    var textFillter = function () {
        function textFillter(str) {
            _classCallCheck(this, textFillter);

            this.input = str;
            this.result = "";
            this.match = false;
        }

        _createClass(textFillter, [{
            key: "fill",
            value: function fill() {
                var _this5 = this;

                var max_core = 0;
                var obj = null;
                data.forEach(function (data_row) {
                    var inputs = data_row.input;
                    var score = 0;
                    var num = 0;
                    inputs.forEach(function (input_row) {
                        var new_score = _this5.input.score(input_row);
                        var re_new_score = input_row.score(_this5.input);
                        re_new_score = re_new_score > 0.4 ? re_new_score : 0;

                        score += Math.max(new_score, re_new_score);
                        if (new_score > 0.3) ++num;
                    });
                    if (score / inputs.length + num > max_core) {
                        max_core = score;
                        obj = data_row;
                    }
                });
                if (obj !== null) {
                    this.match = true;
                    this.result = {
                        type: "TEXT",
                        value: obj.output
                    };
                }
                return this;
            }
        }, {
            key: "isMatch",
            value: function isMatch() {
                return this.match;
            }
        }, {
            key: "get",
            value: function get() {
                return this.result;
            }
        }]);

        return textFillter;
    }();

    var cmdFillter = function () {
        function cmdFillter(str) {
            _classCallCheck(this, cmdFillter);

            this.input = str;
            this.result = "";
            this.match = false;
        }

        _createClass(cmdFillter, [{
            key: "fill",
            value: function fill() {
                if (this.input.indexOf("thacho") !== -1) {
                    this.match = true;
                    this.result = {
                        type: "CMD",
                        value: "START"
                    };
                } else if (this.input.indexOf("nhocho") !== -1) {
                    this.match = true;
                    this.result = {
                        type: "CMD",
                        value: "STOP"
                    };
                }

                return this;
            }
        }, {
            key: "isMatch",
            value: function isMatch() {
                return this.match;
            }
        }, {
            key: "get",
            value: function get() {
                return this.result;
            }
        }]);

        return cmdFillter;
    }();

    var shortCodeFillter = function () {
        function shortCodeFillter(str) {
            _classCallCheck(this, shortCodeFillter);

            this.input = str;
            this.result = "";
            this.match = false;
        }

        _createClass(shortCodeFillter, [{
            key: "fill",
            value: function fill() {
                if (this.input.indexOf("@img") !== -1 || this.input.indexOf("img") !== -1) {
                    this.match = true;
                    var key = this.input.substring(4, this.input.length);
                    var anwser = ["mu\u1ED1n xem h\xECnh " + key + " \xE0 \u0111\u1EE3i t\u1EB9o", key + " c\xF2n c\u1EA3 \u0111\u1ED1ng \u0111\u1EC3 t\xECm cho", "\u1EA3nh " + key + " \u0111\xE2y, ahihi!"];
                    this.result = {
                        type: "IMG",
                        value: { src: "FLICKR", key: key, text: anwser[Math.floor(Math.random() * anwser.length)] }
                    };
                } else if (this.input === "@sexy" || this.input === "anh nong" || this.input === "@fap" || this.input === "@sex") {
                    this.match = true;
                    this.result = {
                        type: "IMG",
                        value: { src: "FACEBOOK", key: "sexy", text: "Cái đồ dại gái =))" }
                    };
                } else if (this.input === "@girl" || this.input === "@gái" || this.input === "@gai") {
                    this.match = true;
                    this.result = {
                        type: "IMG",
                        value: { src: "FACEBOOK", key: "nice", text: "Cái đồ dại gái =))" }
                    };
                } else if (this.input === "@help") {
                    this.match = true;
                    this.result = {
                        type: "TEXT",
                        value: "Do bot m\u1EDBi \u0111\u01B0\u1EE3c ph\xE1t tri\u1EC3n n\xEAn ch\u1EC9 c\xF3 1 s\u1ED1 t\xEDnh n\u0103ng sau:\n1. H\u1ECFi linh tinh (Dang dev).\n2. Ch\xE9m gi\xF3 vui.\n3. Xem h\xECnh g\xE1i xinh v\u1EDBi c\xFA ph\xE1p @g\xE1i, @fap).\n4. T\xECm nh\u1EA1c v\u1EDBi c\xFA ph\xE1p @music (@music s\u01A1n t\xF9ng)\n"
                    };
                }

                return this;
            }
        }, {
            key: "isMatch",
            value: function isMatch() {
                return this.match;
            }
        }, {
            key: "get",
            value: function get() {
                return this.result;
            }
        }]);

        return shortCodeFillter;
    }();

    var spamFillter = function () {
        function spamFillter(str) {
            _classCallCheck(this, spamFillter);

            this.input = str.trim();
            this.result = "";
            this.match = false;
        }

        _createClass(spamFillter, [{
            key: "fill",
            value: function fill() {
                var _this6 = this;

                if (this.input == null || this.input.length < 3) {
                    this.match = true;
                    this.result = "Viết dài hơn đê! viết tắt quá éo hiểu";
                } else {
                    var res = this.input.split(" ");
                    res.forEach(function (el) {
                        if (el.length > 7) {
                            _this6.match = true;
                            _this6.result = "Từ dài nhất trong tiếng việt có 7 chữ thôi";
                        }
                    });
                }
                return this;
            }
        }, {
            key: "isMatch",
            value: function isMatch() {
                return this.match;
            }
        }, {
            key: "get",
            value: function get() {
                return this.result;
            }
        }]);

        return spamFillter;
    }();

    var Bot = function () {
        function Bot(_ref) {
            var my_id = _ref.my_id,
                my_name = _ref.my_name;

            _classCallCheck(this, Bot);

            this.my_id = my_id;
            this.my_name = my_name;
        }

        _createClass(Bot, [{
            key: "get",
            value: function get() {
                return this.output;
            }
        }, {
            key: "set",
            value: function set(_ref2) {
                var input = _ref2.input,
                    sender_id = _ref2.sender_id,
                    sender_name = _ref2.sender_name;

                this.input = input;
                this.sender_id = sender_id;
                this.sender_name = sender_name;

                this.output = "";
                var currentdate = new Date();
                var dayName = new Array("Chủ nhật", "Thứ hai", "Thứ ba", "Thứ tư", "Thứ năm", "Thứ sáu", "Thứ bảy");
                this.time = currentdate.getHours() + ":" + currentdate.getMinutes() + ":" + currentdate.getSeconds();
                this.day = dayName[currentdate.getDay()];
                return this;
            }
        }, {
            key: "_think",
            value: function _think(text) {
                var result = false;
                var cmd_fillter = new cmdFillter(text);
                var short_code_fillter = new shortCodeFillter(text);
                var text_fillter = new textFillter(text);
                var spam_fillter = new spamFillter(text);
                var list_fillter = [];
                if (this.my_id === this.sender_id) list_fillter = [cmd_fillter, short_code_fillter];else list_fillter = [short_code_fillter, text_fillter, spam_fillter];
                var _matched = false;
                list_fillter.forEach(function (el) {
                    if (el.fill().isMatch() && !_matched) {
                        _matched = true;
                        result = el.get();
                        console.log("matched!");
                        return;
                    }
                });
                console.log("not matched!");
                return result;
            }
        }, {
            key: "reply",
            value: function reply() {
                var think = this._think(this.input);
                if (think) {
                    if (think.type == "TEXT") think.value = this._replace(think.value);
                    this.output = think;
                } else {
                    if (this.my_id != this.sender_id) {
                        this.output = {
                            type: "SIMSIM",
                            value: this.input
                        };
                    }
                }
                console.log("output: ", this.output);
                return this;
            }
        }, {
            key: "_replace",
            value: function _replace(text) {
                text = text.replace(/@yourname/g, this.sender_name);
                text = text.replace(/@myname/g, this.my_name);
                text = text.replace(/@nowtime/g, this.time);
                text = text.replace(/@nowday/g, this.day);
                return text;
            }
        }]);

        return Bot;
    }();

    var app = express();
    var PORT = process.env.PORT || 3001;

    var staticPath = path.join(__dirname, '/public');
    app.use(express.static(staticPath));
    app.get('/', function (req, res) {
        res.send('login!');
        _login();
    });
    app.get('/logout', function (req, res) {
        res.send('logout!');
        _api.logout();
    });

    app.listen(PORT, function () {
        console.log('listening');
    });
    var _api;
    var flickr = new Flickr({
        "apiKey": "7c5c8c4592462a24bbc7f0482de14d30",
        "apiSecret": "0fba93f4f9d42d94",

        "accessToken": "xxxxxxxxxxxxxxxxx-xxxxxxxxxxxxxxxx",
        "accessTokenSecret": "xxxxxxxxxxxxxxxx"
    });
    var simsimiAPI = new SimsimiAPI();
    var girlAPI = new GirlAPI();
    function download(uri, filename, callback) {
        request.head(uri, function (err, res, body) {
            console.log('content-type:', res.headers['content-type']);
            console.log('content-length:', res.headers['content-length']);

            request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
        });
    }

    function _login() {
        login(JSON.parse(fs.readFileSync('appstate.json', 'utf8')), function (err, api) {
            _api = api;
            if (err) {
                api.logout();
                _login();
            }
            api.setOptions({
                listenEvents: true,
                selfListen: true
            });

            var userID = api.getCurrentUserID();
            var listeningState = true;

            var listen = api.listen(function (err, event) {
                if (err) return console.error(err);
                api.markAsRead(event.threadID, function (err) {
                    if (err) console.error(err);
                });
                var bot = new Bot({ my_id: api.getCurrentUserID(), my_name: "Hoàng đẹp trai" });
                switch (event.type) {
                    case "message":
                        api.getUserInfo(event.senderID, function (err, friend) {
                            var input = event.body,
                                sender_id = event.senderID,
                                sender_name = friend[event.senderID].name;
                            var _res = bot.set({ input: input, sender_id: sender_id, sender_name: sender_name }).reply().get();
                            if (_res && _res.type) {
                                switch (_res.type) {
                                    case "TEXT":
                                        api.sendMessage(_res.value, event.threadID);
                                        break;
                                    case "IMG":
                                        if (_res.value.src === "FLICKR") {
                                            if (_res.value.text) api.sendMessage(_res.value.text, event.threadID);
                                            _loadImageFromFlick(_res.value.key, api, event);
                                        }
                                        if (_res.value.src === "FACEBOOK") {
                                            if (_res.value.text) api.sendMessage(_res.value.text, event.threadID);
                                            _loadImageFromFacebook(_res.value.key, api, event);
                                        }
                                        break;
                                    case "SIMSIM":
                                        {
                                            simsimiAPI.getMessage(_res.value).then(function (result) {
                                                api.sendMessage(result, event.threadID);
                                            }, function (result) {
                                                var output = "Xin lỗi bot còn nhỏ dại nên không hiểu. Bạn gõ help xem?";
                                                api.sendMessage(output, event.threadID);
                                            });
                                            break;
                                        }
                                    default:
                                        break;
                                }
                            } else console.log("_res: ", _res);
                            api.sendMessage(_res, event.threadID);
                        });
                        break;
                    case "event":
                        console.log(event);
                        break;
                }
            });
        });
    }
    function _loadImageFromFlick(key, api, event) {
        flickr.request().media().search(key).get().then(function (response) {
            var rd = Math.floor(Math.random() * 99 + 1);
            var photo = response.body.photos.photo[rd];
            var url = "https://farm" + photo.farm + ".staticflickr.com/" + photo.server + "/" + photo.id + "_" + photo.secret + ".jpg";
            download(url, 'image.png', function () {
                var messageData = {
                    body: "",
                    attachment: fs.createReadStream(__dirname + '/../image.png')
                };
                api.sendMessage(messageData, event.threadID);
            });
        });
    }
    function _loadImageFromFacebook(key, api, event) {
        console.log(key);
        switch (key) {
            case "sexy":
                {
                    var _func = girlAPI.getRandomSexyImage.bind(girlAPI, "169971983104176", 1070);
                    break;
                }
            case "nice":
                {
                    var _func = girlAPI.getRandomGirlImage.bind(girlAPI);
                    break;
                }
            case "cute":
                {
                    var _func = girlAPI.getRandomSexyImage.bind(girlAPI, "169971983104176", 1070);
                    break;
                }
            case "baby":
                {
                    var _func = girlAPI.getRandomSexyImage.bind(girlAPI, "169971983104176", 1070);
                    break;
                }
            default:
                {
                    var _func = girlAPI.getRandomGirlImage.bind(girlAPI);
                    break;
                }
        }
        _func().then(function (imgUrl) {
            download(imgUrl, 'image.png', function () {
                var messageData = {
                    body: "",
                    attachment: fs.createReadStream(__dirname + '/../image.png')
                };
                api.sendMessage(messageData, event.threadID);
            });
        });
    }
    _login();
});