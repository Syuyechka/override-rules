/**
 * 前置代理组候选（本 fork 定制）。
 *
 * 上游默认把「各地区节点组 + DIRECT + 每个非落地节点」都塞进前置代理组，
 * 这里改成：按固定地区顺序单独列举节点（美国 → 日本）+ `DIRECT`，前置线路一目了然。
 *
 * 注意：落地节点不得出现在此列表（会与 `dialer-proxy: "前置代理"` 形成循环引用）——
 * `countryNodes` 本身只包含非落地节点，天然满足该约束。
 */

import { COUNTRY_KEYS } from "./countries";
import type { GroupBuildContext, ProxyGroupCandidate } from "../types/proxy";

/** 前置代理组按此地区顺序列举节点；想加减前置地区改这里即可。 */
const FRONT_PROXY_COUNTRIES: readonly string[] = [COUNTRY_KEYS.unitedStates, "日本"];

/**
 * 构建「前置代理」组的候选列表。
 * @param ctx - 代理组构建上下文
 * @returns 美国、日本各节点名（按订阅顺序）+ `DIRECT`；无可用节点时只留 `DIRECT`
 */
export function buildFrontProxyCandidates({ nodes }: GroupBuildContext): ProxyGroupCandidate[] {
    const names = FRONT_PROXY_COUNTRIES.flatMap((country) =>
        (nodes.countryNodes[country] ?? [])
            .map((node) => node.name)
            .filter((name): name is string => Boolean(name))
    );

    return names.length > 0 ? [...names, "DIRECT"] : ["DIRECT"];
}
