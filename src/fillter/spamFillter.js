import { Ultilities } from '../lib/index'
import { data } from './constants'
require("string_score");

export class spamFillter {
    constructor(str) {
        this.input = str.trim()
        this.result = ""
        this.match = false
    }
    fill() {
        if(this.input == null || this.input.length < 3) {
            this.match = true
            this.result = "Viết dài hơn đê! viết tắt quá éo hiểu"
        }
        else {
            var res = this.input.split(" ");
            res.forEach((el) =>{
                if(el.length > 7){
                    this.match = true
                    this.result = "Từ dài nhất trong tiếng việt có 7 chữ thôi"
                }
            });
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