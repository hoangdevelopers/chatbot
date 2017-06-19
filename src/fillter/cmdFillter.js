import { Ultilities } from '../lib/index'

export class cmdFillter {
    constructor(str) {
        this.input = str
        this.result = ""
        this.match = false
    }
    fill() {
        if(this.input.indexOf("thacho")!== -1){
            this.match = true
            this.result = {
                type: "CMD",
                value: "START"
            }
        }
        else if(this.input.indexOf("nhocho")!== -1){
            this.match = true
            this.result = {
                type: "CMD",
                value: "STOP"
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