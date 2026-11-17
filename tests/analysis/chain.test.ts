import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { applyChainTag } from "../../src/analysis/chain";
import type { ProxyNode } from "../../src/types/proxy";

describe("applyChainTag", () => {
    it("关键词与地址都为空时完全不改节点", () => {
        const proxies: ProxyNode[] = [
            { name: "日本-Zouter", server: "216.23.122.158", port: 11160 },
        ];
        assert.equal(applyChainTag(proxies, [], []), 0);
        assert.equal(proxies[0]["dialer-proxy"], undefined);
    });

    it("命中名称关键词的节点被打上 dialer-proxy=前置代理", () => {
        const proxies: ProxyNode[] = [
            { name: "日本-Zouter" },
            { name: "香港-Wawo | IPV6" },
            { name: "美国-Hosthatch" },
        ];
        assert.equal(applyChainTag(proxies, ["日本-Zouter"], []), 1);
        assert.equal(proxies[0]["dialer-proxy"], "前置代理");
        assert.equal(proxies[1]["dialer-proxy"], undefined);
        assert.equal(proxies[2]["dialer-proxy"], undefined);
    });

    it("命中 server:port 的节点被打标（改名也不失效）", () => {
        const proxies: ProxyNode[] = [
            { name: "改名后的节点", server: "216.23.122.158", port: 11160 },
            { name: "别的节点", server: "10.0.0.1", port: 11160 },
        ];
        assert.equal(applyChainTag(proxies, [], ["216.23.122.158:11160"]), 1);
        assert.equal(proxies[0]["dialer-proxy"], "前置代理");
        assert.equal(proxies[1]["dialer-proxy"], undefined);
    });

    it("同机多入站时只按端口命中目标入站（Zouter: 11160 是落地，29629 不是）", () => {
        const proxies: ProxyNode[] = [
            { name: "日本-Zouter", server: "216.23.122.158", port: 11160 },
            { name: "香港-电信", server: "216.23.122.158", port: 29629 },
        ];
        assert.equal(applyChainTag(proxies, [], ["216.23.122.158:11160"]), 1);
        assert.equal(proxies[0]["dialer-proxy"], "前置代理");
        assert.equal(proxies[1]["dialer-proxy"], undefined);
    });

    it("只写地址时匹配该地址下所有入站", () => {
        const proxies: ProxyNode[] = [
            { name: "A", server: "216.23.122.158", port: 11160 },
            { name: "B", server: "216.23.122.158", port: 29629 },
        ];
        assert.equal(applyChainTag(proxies, [], ["216.23.122.158"]), 2);
    });

    it("已有 dialer-proxy 的节点不被覆盖", () => {
        const proxies: ProxyNode[] = [{ name: "日本-Zouter", "dialer-proxy": "自定义前置" }];
        assert.equal(applyChainTag(proxies, ["日本-Zouter"], []), 0);
        assert.equal(proxies[0]["dialer-proxy"], "自定义前置");
    });

    it("空关键词被忽略，不会命中所有节点", () => {
        const proxies: ProxyNode[] = [{ name: "日本-Zouter" }];
        assert.equal(applyChainTag(proxies, ["", "  "], []), 0);
        assert.equal(proxies[0]["dialer-proxy"], undefined);
    });
});
