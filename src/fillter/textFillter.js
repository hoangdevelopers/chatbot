import { Ultilities } from '../lib/index'
import { data } from './constants'
require("string_score");

export class textFillter {
    constructor(str) {
        this.input = str
        this.result = ""
        this.match = false
    }
    fill() {
        var max_core = 0
        var obj = null
        data.forEach((data_row) => {
            var inputs = data_row.input
            var score = 0
            var num = 0
            inputs.forEach((input_row) => {
                let new_score = this.input.score(input_row);
                let re_new_score = input_row.score(this.input);
                re_new_score = re_new_score>0.4?re_new_score:0;

                score += Math.max(new_score, re_new_score)
                if(new_score>0.3) ++num
            })
            if (score / inputs.length + num > max_core) {
                max_core = score
                obj = data_row
            }
        })
        if (obj !== null) {
            this.match = true
            this.result = {
                type: "TEXT",
                value: obj.output
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