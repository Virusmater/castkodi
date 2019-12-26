import assert      from "assert";
import { extract } from "../../../src/core/scrapers.js";

describe("Scraper: YouTube", function () {
    it("should return URL when it's not a video", async function () {
        browser.storage.local.set({ "youtube-playlist": "playlist" });

        const url = "https://www.youtube.com/watch?x=123456";
        const expected = url;

        const file = await extract(new URL(url), { "depth": 0 });
        assert.strictEqual(file, expected);

        browser.storage.local.clear();
    });

    it("should return playlist id from video in playlist", async function () {
        browser.storage.local.set({ "youtube-playlist": "playlist" });

        const url = "https://www.youtube.com/watch?v=avt4ZWlVjdY" +
                                     "&list=PL7nedIL_qbuZBS5ZAiGkjB1LW9C3zZvum";
        const expected = "plugin://plugin.video.youtube/play/" +
                              "?playlist_id=PL7nedIL_qbuZBS5ZAiGkjB1LW9C3zZvum";

        const file = await extract(new URL(url), { "depth": 0 });
        assert.strictEqual(file, expected);

        browser.storage.local.clear();
    });

    it("should return video id", async function () {
        browser.storage.local.set({ "youtube-playlist": "video" });

        const url = "https://www.youtube.com/watch?v=avt4ZWlVjdY" +
                                     "&list=PL7nedIL_qbuZBS5ZAiGkjB1LW9C3zZvum";
        const expected = "plugin://plugin.video.youtube/play/" +
                                                        "?video_id=avt4ZWlVjdY";

        const file = await extract(new URL(url), { "depth": 0 });
        assert.strictEqual(file, expected);

        browser.storage.local.clear();
    });

    it("should return video id even with playlist option", async function () {
        browser.storage.local.set({ "youtube-playlist": "playlist" });

        const url = "https://www.youtube.com/watch?v=sWfAtMQa_yo";
        const expected = "plugin://plugin.video.youtube/play/" +
                                                        "?video_id=sWfAtMQa_yo";

        const file = await extract(new URL(url), { "depth": 0 });
        assert.strictEqual(file, expected);

        browser.storage.local.clear();
    });

    it("should return video id when protocol is HTTP", async function () {
        browser.storage.local.set({ "youtube-playlist": "playlist" });

        const url = "http://www.youtube.com/watch?v=sWfAtMQa_yo";
        const expected = "plugin://plugin.video.youtube/play/" +
                                                        "?video_id=sWfAtMQa_yo";

        const file = await extract(new URL(url), { "depth": 0 });
        assert.strictEqual(file, expected);

        browser.storage.local.clear();
    });

    it("should return URL when it's not a video from mobile",
                                                             async function () {
        browser.storage.local.set({ "youtube-playlist": "video" });

        const url = "https://m.youtube.com/watch?a=dQw4w9WgXcQ";
        const expected = url;

        const file = await extract(new URL(url), { "depth": 0 });
        assert.strictEqual(file, expected);

        browser.storage.local.clear();
    });

    it("should return video id from mobile", async function () {
        browser.storage.local.set({ "youtube-playlist": "playlist" });

        const url = "https://m.youtube.com/watch?v=dQw4w9WgXcQ";
        const expected = "plugin://plugin.video.youtube/play/" +
                                                        "?video_id=dQw4w9WgXcQ";

        const file = await extract(new URL(url), { "depth": 0 });
        assert.strictEqual(file, expected);

        browser.storage.local.clear();
    });

    it("should return URL when it's not a video from music", async function () {
        browser.storage.local.set({ "youtube-playlist": "video" });

        const url = "https://music.youtube.com/watch?m=abcdef";
        const expected = url;

        const file = await extract(new URL(url), { "depth": 0 });
        assert.strictEqual(file, expected);

        browser.storage.local.clear();
    });

    it("should return video id from music", async function () {
        browser.storage.local.set({ "youtube-playlist": "video" });

        const url = "https://music.youtube.com/watch?v=IOqxarVWKRs" +
                                                      "&list=RDAMVMIOqxarVWKRs";
        const expected = "plugin://plugin.video.youtube/play/" +
                                                        "?video_id=IOqxarVWKRs";

        const file = await extract(new URL(url), { "depth": 0 });
        assert.strictEqual(file, expected);

        browser.storage.local.clear();
    });

    it("should return URL when it's not a playlist", async function () {
        const url = "https://www.youtube.com/playlist?v=dQw4w9WgXcQ";
        const expected = url;

        const file = await extract(new URL(url), { "depth": 0 });
        assert.strictEqual(file, expected);
    });

    it("should return playlist id", async function () {
        const url = "https://www.youtube.com/playlist" +
                                     "?list=PLd8UclkuwTj9vaRGP3859UHcdmlrkAd-9";
        const expected = "plugin://plugin.video.youtube/play/" +
                              "?playlist_id=PLd8UclkuwTj9vaRGP3859UHcdmlrkAd-9";

        const file = await extract(new URL(url), { "depth": 0 });
        assert.strictEqual(file, expected);
    });

    it("should return URL when it's not a playlist from mobile",
                                                             async function () {
        const url = "https://m.youtube.com/playlist?video=PL3A5849BDE0581B19";
        const expected = url;

        const file = await extract(new URL(url), { "depth": 0 });
        assert.strictEqual(file, expected);
    });

    it("should return playlist id from mobile", async function () {
        const url = "https://m.youtube.com/playlist?list=PL3A5849BDE0581B19";
        const expected = "plugin://plugin.video.youtube/play/" +
                                              "?playlist_id=PL3A5849BDE0581B19";

        const file = await extract(new URL(url), { "depth": 0 });
        assert.strictEqual(file, expected);
    });

    it("should return embed video id", async function () {
        const url = "https://www.youtube.com/embed/v3gefWEggSc";
        const expected = "plugin://plugin.video.youtube/play/" +
                                                        "?video_id=v3gefWEggSc";

        const file = await extract(new URL(url), { "depth": 0 });
        assert.strictEqual(file, expected);
    });

    it("should return video id without cookie", async function () {
        const url = "https://www.youtube-nocookie.com/embed/u9gVaeb9le4";
        const expected = "plugin://plugin.video.youtube/play/" +
                                                        "?video_id=u9gVaeb9le4";

        const file = await extract(new URL(url), { "depth": 0 });
        assert.strictEqual(file, expected);
    });

    it("should return video id from tiny URL", async function () {
        const url = "https://youtu.be/NSFbekvYOlI";
        const expected = "plugin://plugin.video.youtube/play/" +
                                                        "?video_id=NSFbekvYOlI";

        const file = await extract(new URL(url), { "depth": 0 });
        assert.strictEqual(file, expected);
    });
});
