"use strict";

const assert    = require("assert");
const requirejs = require("requirejs");

requirejs.config({
    "baseUrl":     "src/core",
    "nodeRequire": require
});

describe("scraper/vimeo", function () {
    let module;

    before(function (done) {
        requirejs(["scrapers"], function (scrapers) {
            module = scrapers;
            done();
        });
    });

    describe("#patterns", function () {
        it("should return error when it's not a video", function () {
            const url = "https://developer.vimeo.com/";
            const expected = "unsupported";
            return module.extract(url).then(function () {
                assert.fail();
            }, function (error) {
                assert.strictEqual(error.name, "PebkacError");
                assert.ok(error.title.includes(expected));
                assert.ok(error.message.includes(expected));
            });
        });
    });

    describe("https://vimeo.com/*", function () {
        it("should return error when it's not a video", function () {
            const url = "https://vimeo.com/channels";
            const expected = "novideo";
            return module.extract(url).then(function () {
                assert.fail();
            }, function (error) {
                assert.strictEqual(error.name, "PebkacError");
                assert.ok(error.title.includes(expected));
                assert.ok(error.message.includes(expected));
            });
        });

        it("should return video id", function () {
            const url = "https://vimeo.com/228786490";
            const expected = "plugin://plugin.video.vimeo/play/" +
                                                          "?video_id=228786490";
            return module.extract(url).then(function (file) {
                assert.strictEqual(file, expected);
            });
        });
    });

    describe("https://player.vimeo.com/video/*", function () {
        it("should return error when it's not a video", function () {
            const url = "https://player.vimeo.com/video/foobar";
            const expected = "novideo";
            return module.extract(url).then(function () {
                assert.fail();
            }, function (error) {
                assert.strictEqual(error.name, "PebkacError");
                assert.ok(error.title.includes(expected));
                assert.ok(error.message.includes(expected));
            });
        });

        it("should return video id", function () {
            const url = "https://player.vimeo.com/video/228786490";
            const expected = "plugin://plugin.video.vimeo/play/" +
                                                          "?video_id=228786490";
            return module.extract(url).then(function (file) {
                assert.strictEqual(file, expected);
            });
        });
    });
});
