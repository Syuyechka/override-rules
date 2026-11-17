/**
 * 前置代理组候选（本 fork 定制）。
 *
 * 上游默认把「各地区节点组 + DIRECT + 每个非落地节点」都塞进前置代理组；
 * 这里改成：`DIRECT`（首位 = 默认不链）+ 逐个列举全部非落地节点，方便自由组合。
 *
 * 注意：落地节点绝不能出现在此列表——`dialer-proxy: "前置代理"` 若解析回落地节点自身，
 * mihomo 会无限递归并 stack overflow 崩溃（已实测），因此这里显式排除落地与 Tailscale。
 */

import type { GroupBuildContext, ProxyGroupCandidate } from "../types/proxy";

/**
 * 构建「前置代理」组的候选列表。
 * @param ctx - 代理组构建上下文
 * @returns `DIRECT` + 全部非落地（且非 Tailscale）节点名，按订阅顺序
 */
export function buildFrontProxyCandidates({ nodes }: GroupBuildContext): ProxyGroupCandidate[] {
    const names = nodes.nonLandingNodes
        .filter((node) => node.type !== "tailscale")
        .map((node) => node.name)
        .filter((name): name is string => Boolean(name));

    return ["DIRECT", ...names];
}
