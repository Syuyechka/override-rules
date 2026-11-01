/**
 * 前置代理组候选（本 fork 定制）。
 *
 * 上游默认把「各地区节点组 + DIRECT + 每个非落地节点」都塞进前置代理组，
 * 这里改成：单独列举美国节点 + `DIRECT`，前置线路一目了然。
 *
 * 注意：落地节点不得出现在此列表（会与 `dialer-proxy: "前置代理"` 形成循环引用）——
 * `countryNodes` 本身只包含非落地节点，天然满足该约束。
 */

import { COUNTRY_KEYS } from "./countries";
import type { GroupBuildContext, ProxyGroupCandidate } from "../types/proxy";

/**
 * 构建「前置代理」组的候选列表。
 * @param ctx - 代理组构建上下文
 * @returns 美国各节点名 + `DIRECT`；没有可用美国节点时只留 `DIRECT`
 */
export function buildFrontProxyCandidates({ nodes }: GroupBuildContext): ProxyGroupCandidate[] {
    const usNodeNames = (nodes.countryNodes[COUNTRY_KEYS.unitedStates] ?? [])
        .map((node) => node.name)
        .filter((name): name is string => Boolean(name));

    return usNodeNames.length > 0 ? [...usNodeNames, "DIRECT"] : ["DIRECT"];
}
