import { Ultilities } from '../lib/index'

export class shortCodeFillter {
    constructor(str) {
        this.input = str
        this.result = ""
        this.match = false
    }
    fill() {
        if (this.input.indexOf("@img") !== -1 || this.input.indexOf("img") !== -1) {
            this.match = true
            var key = this.input.substring(4, this.input.length)
            var anwser = [
                `muốn xem hình ${key} à đợi tẹo`,
                `${key} còn cả đống để tìm cho`,
                `ảnh ${key} đây, ahihi!`
            ]
            this.result = {
                type: "IMG",
                value: { src: "FLICKR", key: key , text: anwser[Math.floor((Math.random() * anwser.length))]}
            }
        }
        else if (this.input === "@sexy" || this.input === "anh nong" || this.input === "@fap" || this.input === "@sex") {
            this.match = true
            this.result = {
                type: "IMG",
                value: { src: "FACEBOOK", key: "sexy", text: "Cái đồ dại gái =))" }
            }
        }
        else if (this.input === "@girl" || this.input === "@gái" || this.input === "@gai") {
            this.match = true
            this.result = {
                type: "IMG",
                value: { src: "FACEBOOK", key: "nice", text: "Cái đồ dại gái =))" }
            }
        }
        else if (this.input === "@help") {
            this.match = true
            this.result = {
                type: "TEXT",
                value: `Do bot mới được phát triển nên chỉ có 1 số tính năng sau:\n1. Hỏi linh tinh (Dang dev).\n2. Chém gió vui.\n3. Xem hình gái xinh với cú pháp @gái, @fap).\n4. Tìm nhạc với cú pháp @music (@music sơn tùng)\n`
            }
        }

        return this
    }
    isMatch() {
        return this.match
    }
    get() {
        return this.result
    }
}