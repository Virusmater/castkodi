import assert      from "assert";
import { extract } from "../../../src/core/scrapers.js";

describe("Scraper: 20 Minutes", function () {
    it("should return URL when it's not a video", async function () {
        const url = "https://www.20minutes.fr/high-tech" +
                                       "/2694715-20200114-mozilla-devoile-son" +
                                        "-assistant-virtuel-pense-pour-firefox";
        const options = { depth: 0, incognito: false };

        const file = await extract(new URL(url), options);
        assert.strictEqual(file, url);
    });

    it("should return video URL", async function () {
        const url = "https://www.20minutes.fr/sciences" +
                    "/2697215-20200117-ariane-5-succes-premier-lancement-annee";
        const options = { depth: 0, incognito: false };

        const file = await extract(new URL(url), options);
        assert.ok(file.endsWith("/59/6b/596b282e57e592e47df9a6f0434f3281f82b7" +
                                                       "9df.mp4?mdtk=01357940"),
                  `"${file}".endsWith(...)`);
    });
});
