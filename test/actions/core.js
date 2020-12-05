var assert = require('assert');

module.exports = class Core
{
    constructor()
    {
        this._compareText = "";
        this._infoText = "";
        this._endIsCalled = false;
    }

    startGroup(text) {
        this._compareText = text;
    }

    endGroup() {
        this._endIsCalled = true;
    }

    info(text) {
        this._infoText = text;
    }

    getGroup() {
        return this._compareText;
    }

    getInfo() {
        return this._infoText;
    }

    isEndCalled() {
        return this._endIsCalled;
    }
}