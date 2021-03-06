import assert                from "assert";
import sinon                 from "sinon";
import { Kodi }              from "../../../../src/core/jsonrpc/kodi.js";
import { JSONRPC }           from "../../../../src/tools/jsonrpc.js";
import { NotificationEvent } from "../../../../src/tools/notificationevent.js";

describe("core/jsonrpc/kodi.js", function () {
    describe("check()", function () {
        it("should return promise rejected", async function () {
            try {
                await Kodi.check("");
                assert.fail();
            } catch (err) {
                assert.strictEqual(err.name, "PebkacError");
            }
        });

        it("should return promise fulfilled", async function () {
            const fake = sinon.fake.resolves({ bar: "baz" });
            const stub = sinon.stub(JSONRPC, "open").resolves({
                addEventListener: () => {},
                send:             fake,
                close:            () => {},
            });

            const result = await Kodi.check("foo.com");
            assert.deepStrictEqual(result, { bar: "baz" });

            assert.strictEqual(stub.callCount, 1);
            assert.deepStrictEqual(stub.firstCall.args, [
                new URL("ws://foo.com:9090/jsonrpc"),
            ]);
            assert.strictEqual(fake.callCount, 1);
            assert.deepStrictEqual(fake.firstCall.args, [
                "JSONRPC.Version",
                undefined,
            ]);

            stub.restore();
        });
    });

    describe("close()", function () {
        it("should close WebSocket", async function () {
            const fake = sinon.fake();
            const stub = sinon.stub(JSONRPC, "open").resolves({
                addEventListener: () => {},
                send:             () => Promise.resolve({}),
                close:            fake,
            });

            const kodi = new Kodi("localhost");
            await kodi.send("foo");
            kodi.close();
            // Fermer la connexion une deuxième fois (qui a aucun effet).
            kodi.close();

            assert.strictEqual(stub.callCount, 1);
            assert.deepStrictEqual(stub.firstCall.args, [
                new URL("ws://localhost:9090/jsonrpc"),
            ]);
            assert.strictEqual(fake.callCount, 1);
            assert.deepStrictEqual(fake.firstCall.args, []);

            stub.restore();
        });
    });

    describe("send()", function () {
        it("should return error when no host", async function () {
            try {
                const kodi = new Kodi("");
                await kodi.send("foo");
                assert.fail();
            } catch (err) {
                assert.strictEqual(err.name, "PebkacError");
                assert.strictEqual(err.type, "unconfigured");
            }
        });

        it("should return error when host is invalid", async function () {
            try {
                const kodi = new Kodi("bad host");
                await kodi.send("foo");
                assert.fail();
            } catch (err) {
                assert.strictEqual(err.name, "PebkacError");
                assert.strictEqual(err.type, "badHost");
            }
        });

        it("should return error when IP is invalid", async function () {
            try {
                const kodi = new Kodi("192.168");
                await kodi.send("foo");
                assert.fail();
            } catch (err) {
                assert.strictEqual(err.name, "PebkacError");
                assert.strictEqual(err.type, "badHost");
            }
        });

        it("should return error when receive 400", async function () {
            const stub = sinon.stub(JSONRPC, "open").rejects();

            try {
                const kodi = new Kodi("localhost");
                await kodi.send("foo");
                assert.fail();
            } catch (err) {
                assert.strictEqual(err.name, "PebkacError");
                assert.strictEqual(err.type, "notFound");
            }

            assert.strictEqual(stub.callCount, 1);
            assert.deepStrictEqual(stub.firstCall.args, [
                new URL("ws://localhost:9090/jsonrpc"),
            ]);

            stub.restore();
        });

        it("should return error when receive Kodi's error", async function () {
            const fake = sinon.fake.rejects(new Error("FooError"));
            const stub = sinon.stub(JSONRPC, "open").resolves({
                addEventListener: () => {},
                send:             fake,
            });

            try {
                const kodi = new Kodi("localhost");
                await kodi.send("Foo");
                assert.fail();
            } catch (err) {
                assert.strictEqual(err.name, "Error");
                assert.strictEqual(err.message, "FooError");
            }

            assert.strictEqual(stub.callCount, 1);
            assert.deepStrictEqual(stub.firstCall.args, [
                new URL("ws://localhost:9090/jsonrpc"),
            ]);
            assert.strictEqual(fake.callCount, 1);
            assert.deepStrictEqual(fake.firstCall.args, ["Foo", undefined]);

            stub.restore();
        });

        it("should send request", async function () {
            const fake = sinon.fake.resolves("OK");
            const stub = sinon.stub(JSONRPC, "open").resolves({
                addEventListener: () => {},
                send:             fake,
            });

            const kodi = new Kodi("foo");
            let result = await kodi.send("Bar.Baz");
            assert.strictEqual(result, "OK");
            result = await kodi.send("Qux.Quux", 42);
            assert.strictEqual(result, "OK");

            assert.strictEqual(stub.callCount, 1);
            assert.deepStrictEqual(stub.firstCall.args, [
                new URL("ws://foo:9090/jsonrpc"),
            ]);
            assert.strictEqual(fake.callCount, 2);
            assert.deepStrictEqual(fake.firstCall.args, ["Bar.Baz", undefined]);
            assert.deepStrictEqual(fake.secondCall.args, ["Qux.Quux", 42]);

            stub.restore();
        });

        it("should send request from configuration", async function () {
            browser.storage.local.set({
                "server-list":   [{ host: "localhost" }, { host: "127.0.0.1" }],
                "server-active": 0,
            });
            const fake = sinon.fake.resolves("OK");
            const stub = sinon.stub(JSONRPC, "open").resolves({
                addEventListener: () => {},
                close:            () => {},
                send:             fake,
            });

            const kodi = new Kodi();
            let result = await kodi.send("Foo.Bar");
            assert.strictEqual(result, "OK");
            kodi.close();
            browser.storage.local.set({ "server-active": 1 });
            result = await kodi.send("Baz.Qux", true);
            assert.strictEqual(result, "OK");

            assert.strictEqual(stub.callCount, 2);
            assert.deepStrictEqual(stub.firstCall.args, [
                new URL("ws://localhost:9090/jsonrpc"),
            ]);
            assert.deepStrictEqual(stub.secondCall.args, [
                new URL("ws://127.0.0.1:9090/jsonrpc"),
            ]);
            assert.strictEqual(fake.callCount, 2);
            assert.deepStrictEqual(fake.firstCall.args, ["Foo.Bar", undefined]);
            assert.deepStrictEqual(fake.secondCall.args, ["Baz.Qux", true]);

            browser.storage.local.clear();
            stub.restore();
        });

        it("should listen close event", async function () {
            const listeners = {};
            const stub = sinon.stub(JSONRPC, "open").resolves({
                addEventListener: (type, listener) => {
                    listeners[type] = listener;
                },
                close:            () => {},
                send:             () => Promise.resolve({ corge: true }),
            });

            const kodi = new Kodi("foo");
            let result = await kodi.send("Bar.Baz");
            assert.deepStrictEqual(result, { corge: true });
            listeners.close();
            result = await kodi.send("Qux.Quux");
            assert.deepStrictEqual(result, { corge: true });

            assert.strictEqual(stub.callCount, 2);
            assert.deepStrictEqual(stub.firstCall.args, [
                new URL("ws://foo:9090/jsonrpc"),
            ]);
            assert.deepStrictEqual(stub.secondCall.args, [
                new URL("ws://foo:9090/jsonrpc"),
            ]);

            stub.restore();
        });

        it("should listen notification event", async function () {
            const listeners = {};
            const stubJSONRPC = sinon.stub(JSONRPC, "open").resolves({
                addEventListener: (type, listener) => {
                    listeners[type] = listener;
                },
                close:            () => {},
                send:             () => Promise.resolve({}),
            });

            const kodi = new Kodi("foo");
            const stubApplication = sinon.stub(kodi.application,
                                               "handleNotification");
            await kodi.send("Bar.Baz");
            listeners.notification(new NotificationEvent("notification", {
                method: "Qux",
                params: { data: "Quux" },
            }));

            assert.strictEqual(stubApplication.callCount, 1);
            assert.strictEqual(stubApplication.firstCall.args[0].type,
                               "notification");
            assert.strictEqual(stubApplication.firstCall.args[0].method, "Qux");
            assert.deepStrictEqual(stubApplication.firstCall.args[0].params, {
                data: "Quux",
            });

            stubJSONRPC.restore();
            stubApplication.restore();
        });
    });
});
