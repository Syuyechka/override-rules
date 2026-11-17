/**
 * 链式代理打标：把命中的节点标记为「落地节点」。
 *
 * 上游脚本按 `dialer-proxy === "前置代理"` 判定落地节点，但订阅里的节点通常不带该字段，
 * 因此这里在分类之前按「节点名关键词」或「服务器地址」补写，让「前置代理」/「落地节点」两组得以生成。
 *
 * 为什么同时支持按 server 匹配：节点名会随订阅/机场改名（如「香港-Wawo | IPV6」），
 * 按 IP 匹配才不会静默失效、导致两组凭空消失。
 */

import { PROXY_GROUPS } from "../catalog/group-names";
import type { ProxyNode } from "../types/proxy";

/** 节点名是否命中任一关键词（空关键词列表永远不命中）。 */
function matchesKeyword(name: string, keywords: string[]): boolean {
    return keywords.some((keyword) => keyword.length > 0 && name.includes(keyword));
}

/** 节点的 server[:port] 是否命中地址列表。 */
function matchesServer(node: ProxyNode, servers: string[]): boolean {
    const server = node.server;
    if (!server) return false;

    // 支持 "1.2.3.4"（仅比对地址）与 "1.2.3.4:443"（地址+端口精确比对，同机多入站时必须用这种）
    return servers.some((target) => {
        if (target.length === 0) return false;
        const [targetServer, targetPort] = target.split(":");
        if (targetServer !== server) return false;
        if (typeof targetPort === "undefined") return true;
        return String(node.port ?? "") === targetPort;
    });
}

/**
 * 就地给命中「名称关键词或 server 地址」的节点写入 `dialer-proxy: "前置代理"`。
 *
 * - 关键词与地址都为空时不做任何事（完全尊重订阅自带配置）
 * - 已带 `dialer-proxy` 的节点保持原值，不覆盖
 * @returns 被新打上标记的节点数量
 */
export function applyChainTag(
    proxies: ProxyNode[],
    keywords: string[] = [],
    servers: string[] = []
): number {
    if (keywords.length === 0 && servers.length === 0) return 0;

    let tagged = 0;
    for (const node of proxies) {
        const name = node.name;
        if (!name) continue;
        if (typeof node["dialer-proxy"] === "string" && node["dialer-proxy"] !== "") continue;
        if (!matchesKeyword(name, keywords) && !matchesServer(node, servers)) continue;

        node["dialer-proxy"] = PROXY_GROUPS.FRONT_PROXY;
        tagged += 1;
    }

    return tagged;
}
