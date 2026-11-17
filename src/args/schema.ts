/**
 * 参数默认值的唯一来源。
 *
 * 若需修改脚本的默认行为（例如默认开启 IPv6），只需调整此处的取值。
 */
export const ARG_DEFAULTS = {
    /** 地区代理组类型：0=select，1=url-test，2=load-balance。 */
    groupType: 1,
    /** 地区节点数量小于该值时不生成地区组（1 = 单节点地区也成组，如只有一台的韩国）。 */
    countryThreshold: 1,
    /** 默认使用 fake-ip 增强模式。 */
    fakeIPEnabled: true,
    /**
     * 链式代理：命中「节点名关键词」或「server 地址」的节点会被打上 `dialer-proxy: "前置代理"`，
     * 从而生成「前置代理」/「落地节点」两组。留空 = 不启用。
     * 当前：落地节点只放「日本-Zouter」（Zouter 仅当落地，其余全部节点作为前置候选）。
     */
    chainKeywords: ["日本-Zouter"] as string[],
    /** 按 server:port 打标（精确匹配），节点改名后仍生效；同一台机器有多个入站时必须带端口。 */
    chainServers: ["216.23.122.158:11160"] as string[],
} as const;
