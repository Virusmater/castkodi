import assert      from "assert";
import { extract } from "../../../src/core/scrapers.js";

describe("Scraper: Rutube", function () {
    it("should return URL when it's not a video", async function () {
        const url = "https://rutube.ru/video/no_id/";
        const expected = url;

        const file = await extract(new URL(url), { "depth": 0 });
        assert.strictEqual(file, expected);
    });

    it("should return null when it's not a video with id", async function () {
        const url = "https://rutube.ru/video/0a1b2c3d4e5/";
        const expected = url;

        const file = await extract(new URL(url), { "depth": 0 });
        assert.strictEqual(file, expected);
    });

    it("should return video URL", async function () {
        const url = "https://rutube.ru/video" +
                                          "/c3290999478b6c11addf33b26f4ca81c/" +
                                                  "?pl_id=2664175&pl_type=user";
        const expected = "https://bl.rutube.ru/route" +
                                      "/c3290999478b6c11addf33b26f4ca81c.m3u8?";

        const file = await extract(new URL(url), { "depth": 0 });
        assert.ok(file.startsWith(expected), `"${file}".startsWith(expected)`);
    });

    it("should return null when access isn't allowed", async function () {
        const url = "https://rutube.ru/play/embed/1";
        const expected = url;

        const file = await extract(new URL(url), { "depth": 0 });
        assert.strictEqual(file, expected);
    });

    it("should return video embed URL", async function () {
        const url = "https://rutube.ru/play/embed/11318635";
        const expected = "https://bl.rutube.ru/route" +
                                      "/7fa99a98331d643cc44d4f529fba762a.m3u8?";

        const file = await extract(new URL(url), { "depth": 0 });
        assert.ok(file.startsWith(expected), `"${file}".startsWith(expected)`);
    });

    it("should return video embed URL when protocol is HTTP",
                                                             async function () {
        const url = "http://rutube.ru/play/embed/11318635";
        const expected = "https://bl.rutube.ru/route" +
                                      "/7fa99a98331d643cc44d4f529fba762a.m3u8?";

        const file = await extract(new URL(url), { "depth": 0 });
        assert.ok(file.startsWith(expected), `"${file}".startsWith(expected)`);
    });
});
