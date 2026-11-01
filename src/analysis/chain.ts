/**
 * 链式代理打标：把命中关键词的节点标记为「落地节点」。
 *
 * 上游脚本按 `dialer-proxy === "前置代理"` 判定落地节点，但订阅里的节点通常不带该字段，
 * 因此这里在分类之前按节点名关键词补写，让「前置代理」/「落地节点」两组得以生成。
 */

import { PROXY_GROUPS } from "../catalog/group-names";
import type { ProxyNode } from "../types/proxy";

/** 节点是否命中任一关键词（空关键词列表永远不命中）。 */
function matchesAny(name: string, keywords: string[]): boolean {
    return keywords.some((keyword) => keyword.length > 0 && name.includes(keyword));
}

/**
 * 就地给命中关键词的节点写入 `dialer-proxy: "前置代理"`。
 *
 * - 关键词列表为空时不做任何事（完全尊重订阅自带配置）
 * - 已带 `dialer-proxy` 的节点保持原值，不覆盖
 * @returns 被新打上标记的节点数量
 */
export function applyChainTag(proxies: ProxyNode[], keywords: string[]): number {
    if (keywords.length === 0) return 0;

    let tagged = 0;
    for (const node of proxies) {
        const name = node.name;
        if (!name) continue;
        if (typeof node["dialer-proxy"] === "string" && node["dialer-proxy"] !== "") continue;
        if (!matchesAny(name, keywords)) continue;

        node["dialer-proxy"] = PROXY_GROUPS.FRONT_PROXY;
        tagged += 1;
    }

    return tagged;
}
