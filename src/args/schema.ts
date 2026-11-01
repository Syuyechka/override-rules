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
     * 链式代理：命中这些关键词的节点会被打上 `dialer-proxy: "前置代理"`，从而生成
     * 「前置代理」/「落地节点」两组。留空 = 不启用（完全跟随订阅里的 dialer-proxy）。
     * 当前启用：香港-Wawo、韩国-Hosthatch 作为落地节点（前端走美国节点或 DIRECT）。
     */
    chainKeywords: ["香港-Wawo", "Hosthatch"] as string[],
} as const;
