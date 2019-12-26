import assert      from "assert";
import { extract } from "../../../src/core/scrapers.js";

describe("Scraper: My Cloud Player", function () {
    it("should return URL when it's not an audio", async function () {
        const url = "https://mycloudplayers.com/?featured=tracks";
        const expected = url;

        const file = await extract(new URL(url), { "depth": 0 });
        assert.strictEqual(file, expected);
    });

    it("should return audio id", async function () {
        const url = "https://mycloudplayers.com/?play=176387011";
        const expected = "plugin://plugin.audio.soundcloud/play/" +
                                                          "?audio_id=176387011";

        const file = await extract(new URL(url), { "depth": 0 });
        assert.strictEqual(file, expected);
    });

    it("should return audio id when protocol is HTTP", async function () {
        const url = "http://mycloudplayers.com/?play=176387011";
        const expected = "plugin://plugin.audio.soundcloud/play/" +
                                                          "?audio_id=176387011";

        const file = await extract(new URL(url), { "depth": 0 });
        assert.strictEqual(file, expected);
    });
});
