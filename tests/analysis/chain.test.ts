import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { applyChainTag } from "../../src/analysis/chain";
import type { ProxyNode } from "../../src/types/proxy";

describe("applyChainTag", () => {
    it("关键词为空时完全不改节点", () => {
        const proxies: ProxyNode[] = [{ name: "韩国-Hosthatch" }, { name: "日本-Zouter" }];
        assert.equal(applyChainTag(proxies, []), 0);
        assert.equal(proxies[0]["dialer-proxy"], undefined);
    });

    it("命中关键词的节点被打上 dialer-proxy=前置代理", () => {
        const proxies: ProxyNode[] = [
            { name: "韩国-Hosthatch" },
            { name: "日本-Zouter" },
            { name: "香港-Wawo" },
        ];
        assert.equal(applyChainTag(proxies, ["韩国"]), 1);
        assert.equal(proxies[0]["dialer-proxy"], "前置代理");
        assert.equal(proxies[1]["dialer-proxy"], undefined);
        assert.equal(proxies[2]["dialer-proxy"], undefined);
    });

    it("多个关键词取并集，且支持子串匹配", () => {
        const proxies: ProxyNode[] = [
            { name: "韩国-Hosthatch" },
            { name: "香港-Wawo" },
            { name: "美国-Bitsflow" },
        ];
        assert.equal(applyChainTag(proxies, ["Hosthatch", "Wawo"]), 2);
        assert.equal(proxies[2]["dialer-proxy"], undefined);
    });

    it("已有 dialer-proxy 的节点不被覆盖", () => {
        const proxies: ProxyNode[] = [{ name: "韩国-Hosthatch", "dialer-proxy": "自定义前置" }];
        assert.equal(applyChainTag(proxies, ["韩国"]), 0);
        assert.equal(proxies[0]["dialer-proxy"], "自定义前置");
    });

    it("空关键词被忽略，不会命中所有节点", () => {
        const proxies: ProxyNode[] = [{ name: "韩国-Hosthatch" }];
        assert.equal(applyChainTag(proxies, ["", "  "]), 0);
        assert.equal(proxies[0]["dialer-proxy"], undefined);
    });
});
