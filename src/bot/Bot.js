import {spamFillter, textFillter, cmdFillter, shortCodeFillter } from '../fillter/index'


export class Bot {
    constructor({ my_id, my_name }) {
        this.my_id = my_id
        this.my_name = my_name
    }

    get() {
        return this.output
    }
    set({ input, sender_id, sender_name }) {
        this.input = input
        this.sender_id = sender_id
        this.sender_name = sender_name

        this.output = ""
        var currentdate = new Date();
        var dayName = new Array("Chủ nhật", "Thứ hai", "Thứ ba", "Thứ tư", "Thứ năm", "Thứ sáu", "Thứ bảy")
        this.time = currentdate.getHours() + ":"
            + currentdate.getMinutes() + ":"
            + currentdate.getSeconds();
        this.day = dayName[currentdate.getDay()]
        return this
    }
    _think(text) {
        var result = false
        var cmd_fillter = new cmdFillter(text)
        var short_code_fillter = new shortCodeFillter(text)
        var text_fillter = new textFillter(text)
        var spam_fillter = new spamFillter(text)
        var list_fillter = []
        if (this.my_id === this.sender_id) list_fillter = [cmd_fillter, short_code_fillter]
        else list_fillter = [short_code_fillter, text_fillter, spam_fillter]
        var _matched = false
        list_fillter.forEach((el) => {
            if (el.fill().isMatch() && !_matched) {
                _matched = true
                result = el.get()
                console.log("matched!")
                return
            }
        });
        console.log("not matched!")
        return result
    }
    reply() {
        var think = this._think(this.input)
        if (think) {
            if (think.type == "TEXT") think.value = this._replace(think.value)
            this.output = think
        }
        else {
            if (this.my_id != this.sender_id) {
                // var rd = Math.floor((Math.random() * 3) + 1);
                // if (rd == 2) {
                    this.output = {
                        type: "SIMSIM",
                        value: this.input
                   // }
                }
            }

        }
        console.log("output: ", this.output)
        return this
    }
    _replace(text) {
        text = text.replace(/@yourname/g, this.sender_name);
        text = text.replace(/@myname/g, this.my_name);
        text = text.replace(/@nowtime/g, this.time);
        text = text.replace(/@nowday/g, this.day);
        return text
    }
}