import assert      from "assert";
import { extract } from "../../../../src/core/scraper/vidlox.js";

describe("core/scraper/vidlox.js", function () {
    describe("extract()", function () {
        it("should return null when it's a unsupported URL", async function () {
            const url = "https://twitter.com/vidloxtv";

            const file = await extract(new URL(url));
            assert.strictEqual(file, null);
        });

        it("should return null when it's not a video", async function () {
            const url = "https://vidlox.me/foo";
            const content = {
                html: () => Promise.resolve(new DOMParser().parseFromString(`
                    <html>
                      <body><script></script></body>
                    </html>`, "text/html")),
            };

            const file = await extract(new URL(url), content);
            assert.strictEqual(file, null);
        });

        it("should return video URL", async function () {
            const url = "https://vidlox.me/foo";
            const content = {
                html: () => Promise.resolve(new DOMParser().parseFromString(`
                    <html>
                      <body>
                        <script>
                            var player = new Clappr.Player({
                                sources: ["https://bar.baz/qux.m3u8","QUUX"]
                            })
                        </script>
                      </body>
                    </html>`, "text/html")),
            };

            const file = await extract(new URL(url), content);
            assert.strictEqual(file, "https://bar.baz/qux.m3u8");
        });
    });
});
