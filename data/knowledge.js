window.KNOWLEDGE = {
  generatedAt: "2026-10-10",
  sourceCount: 28,
  modules: {
    export: { name: "出口管制与海关合规", short: "出口管制", color: "#2f80ed" },
    ip: { name: "知识产权海外布局", short: "知识产权", color: "#8b5cf6" },
    labor: { name: "跨境用工合规", short: "跨境用工", color: "#0f9f7a" },
    political: { name: "东道国政治与法律主权", short: "政治与投资", color: "#e08131" }
  },
  sources: [
    {
      id: "cn-dual-use", title: "中华人民共和国两用物项出口管制条例", category: "中国法规", module: "export", type: "DOCX", jurisdiction: "中国", dated: "2024-09-30",
      path: "knowledge-base/中国法律法规/中华人民共和国两用物项出口管制条例_20240930.docx", excerptFile: "knowledge-base/中国法律法规/法规文本摘录/中华人民共和国两用物项出口管制条例_20240930.txt",
      summary: "规范两用物项出口许可、最终用户与最终用途管理、管控名单及监督检查。",
      tags: ["两用物项", "出口许可", "最终用户", "合规义务"], keyPoints: ["出口前进行物项识别与清单比对", "关注最终用户和最终用途证明", "未经许可不得出口受控物项"]
    },
    {
      id: "cn-export-control-law", title: "中华人民共和国出口管制法", category: "中国法规", module: "export", type: "DOCX", jurisdiction: "中国", dated: "2020-10-17",
      path: "knowledge-base/中国法律法规/中华人民共和国出口管制法_20201017.docx", excerptFile: "knowledge-base/中国法律法规/法规文本摘录/中华人民共和国出口管制法_20201017.txt",
      summary: "确立出口管制清单、许可、域外适用、管控名单和法律责任制度。",
      tags: ["出口管制", "许可证", "管控名单", "法律责任"], keyPoints: ["判断货物、技术和服务的管制属性", "保存交易与许可档案", "关注域外适用与再出口风险"]
    },
    {
      id: "cn-customs-law", title: "中华人民共和国海关法", category: "中国法规", module: "export", type: "DOCX", jurisdiction: "中国", dated: "2021-04-29",
      path: "knowledge-base/中国法律法规/中华人民共和国海关法_20210429.docx", excerptFile: "knowledge-base/中国法律法规/法规文本摘录/中华人民共和国海关法_20210429.txt",
      summary: "规定申报、查验、征税、保税监管及走私违法责任，是出口申报与海关稽查的基础法。",
      tags: ["海关申报", "查验", "征税", "走私"], keyPoints: ["申报信息必须真实、准确、完整", "许可证及随附单证应保持一致", "不得以藏匿等方式逃避海关监管"]
    },
    {
      id: "case-customs-penalty", title: "通关缉查字〔2026〕01号行政处罚决定书", category: "执法案例", module: "export", type: "PDF", jurisdiction: "中国", dated: "2026",
      path: "knowledge-base/行政处罚决定书/通关缉查字【2026】01号 行政处罚决定书.pdf",
      summary: "海关缉查行政处罚决定书，可用于校验申报不实、单证一致性及处罚裁量的风险规则。",
      tags: ["海关处罚", "缉查", "申报不实", "案例"], keyPoints: ["将处罚决定作为高风险案例样本", "核验申报要素和货物实际状态", "在内部审批中设置单证复核节点"]
    },
    {
      id: "eu-cbam", title: "CBAM（碳边境调节机制）", category: "外国法律", module: "export", type: "PDF", jurisdiction: "欧盟", dated: "欧盟规则",
      path: "knowledge-base/国际条约、外国法律/CBAM（碳边境调节机制）.pdf",
      summary: "欧盟对钢铁、铝等高碳产品建立碳边境申报与成本调节机制，影响对欧出口成本和数据义务。",
      tags: ["CBAM", "碳关税", "钢铁", "铝", "碳排放"], keyPoints: ["核验产品是否落入CBAM覆盖范围", "建立可审计的碳排放数据链", "评估报关成本和第三方核查费用"]
    },
    {
      id: "eu-anti-dumping", title: "欧盟反倾销条例", category: "外国法律", module: "export", type: "PDF", jurisdiction: "欧盟", dated: "欧盟规则",
      path: "knowledge-base/国际条约、外国法律/欧盟反倾销条例.pdf",
      summary: "规定欧盟反倾销调查、倾销与损害认定、措施和复审程序。",
      tags: ["反倾销", "贸易救济", "欧盟", "应诉"], keyPoints: ["关注立案公告与问卷时限", "准备成本、价格和出口数据", "评估申请市场经济待遇或单独税率"]
    },
    {
      id: "eu-anti-subsidy", title: "欧盟反补贴条例", category: "外国法律", module: "export", type: "PDF", jurisdiction: "欧盟", dated: "欧盟规则",
      path: "knowledge-base/国际条约、外国法律/欧盟反补贴条例.pdf",
      summary: "规定欧盟反补贴调查、补贴认定、损害分析及反补贴措施。",
      tags: ["反补贴", "贸易救济", "欧盟", "补贴"], keyPoints: ["梳理政府支持与财政资助", "建立可追溯的申报台账", "准备联合应诉和价格承诺方案"]
    },
    {
      id: "trips", title: "TRIPS协定", category: "国际条约", module: "ip", type: "PDF", jurisdiction: "国际", dated: "WTO协定",
      path: "knowledge-base/国际条约、外国法律/TRIPS协定.pdf",
      summary: "WTO知识产权最低保护标准，覆盖商标、专利、著作权、执法和边境措施。",
      tags: ["TRIPS", "知识产权", "边境措施", "执法"], keyPoints: ["了解成员国最低保护义务", "利用边境扣留和民事救济", "关注侵权刑事化与证据保全"]
    },
    {
      id: "madrid-cn", title: "WIPO商标国际注册马德里体系（中文）", category: "国际条约", module: "ip", type: "PDF", jurisdiction: "国际", dated: "WIPO",
      path: "knowledge-base/国际条约、外国法律/WIPO商标国际注册马德里体系 中文.pdf",
      summary: "介绍通过马德里体系进行商标国际注册的申请路径、指定国和后续管理。",
      tags: ["马德里体系", "商标注册", "海外布局", "WIPO"], keyPoints: ["以国内基础申请或注册为入口", "按目标市场指定成员国", "建立续展、异议和监测台账"]
    },
    {
      id: "madrid-en", title: "WIPO Madrid System Guide (English)", category: "国际条约", module: "ip", type: "PDF", jurisdiction: "国际", dated: "WIPO",
      path: "knowledge-base/国际条约、外国法律/WIPO商标国际注册马德里体系English.pdf",
      summary: "马德里体系英文指南，适合对海外代理和境外商标程序进行交叉核验。",
      tags: ["Madrid System", "Trademark", "WIPO", "国际注册"], keyPoints: ["核对国际申请基础", "跟踪指定国审查状态", "按期处理驳回和异议"]
    },
    {
      id: "madrid-protocol", title: "《马德里议定书》", category: "国际条约", module: "ip", type: "PDF", jurisdiction: "国际", dated: "国际条约",
      path: "knowledge-base/国际条约、外国法律/《马德里议定书》.pdf",
      summary: "规范商标国际注册的法律基础、程序衔接和成员国义务。",
      tags: ["马德里议定书", "商标", "国际注册", "程序"], keyPoints: ["国际注册与国内基础申请的关系", "指定国审查的独立性", "国际注册的续展与转让"]
    },
    {
      id: "madrid-protocol-original", title: "《马德里议定书》原文", category: "国际条约", module: "ip", type: "PDF", jurisdiction: "国际", dated: "国际条约",
      path: "knowledge-base/国际条约、外国法律/《马德里议定书》原文.pdf",
      summary: "马德里议定书原文，用于法律条款级核验和争议检索。",
      tags: ["马德里议定书", "原文", "条约", "条款"], keyPoints: ["核验条款原文", "处理国际注册程序争议", "作为法律检索底稿"]
    },
    {
      id: "turkey-ip-law", title: "土耳其《工业产权法》", category: "外国法律", module: "ip", type: "PDF", jurisdiction: "土耳其", dated: "土耳其法律",
      path: "knowledge-base/国际条约、外国法律/土耳其《工业产权法》.pdf",
      summary: "土耳其商标、专利、外观设计等工业产权的注册、保护和执法规则。",
      tags: ["土耳其", "工业产权", "商标抢注", "异议"], keyPoints: ["出口前完成商标在先检索", "对抢注及时提出异议或撤销", "同步保存品牌使用证据"]
    },
    {
      id: "eu-trademark-regulation", title: "欧盟《商标条例》", category: "外国法律", module: "ip", type: "PDF", jurisdiction: "欧盟", dated: "欧盟规则",
      path: "knowledge-base/国际条约、外国法律/欧盟《商标条例》.pdf",
      summary: "欧盟商标注册、权利范围、异议、无效和侵权救济规则。",
      tags: ["欧盟商标", "EUTM", "异议", "侵权"], keyPoints: ["评估欧盟商标整体保护", "监测近似商标申请", "准备使用证据和市场调查报告"]
    },
    {
      id: "us-patent-law", title: "美国《专利法》", category: "外国法律", module: "ip", type: "PDF", jurisdiction: "美国", dated: "美国法律",
      path: "knowledge-base/国际条约、外国法律/美国《专利法》.pdf",
      summary: "美国专利授权、权利要求、侵权和救济规则，是产品自由实施分析的重要依据。",
      tags: ["美国专利", "FTO", "侵权", "损害赔偿"], keyPoints: ["产品进入美国前进行FTO检索", "核查设计规避空间", "保留研发和使用证据"]
    },
    {
      id: "us-lanham-act", title: "美国《兰哈姆法》（商标法）", category: "外国法律", module: "ip", type: "PDF", jurisdiction: "美国", dated: "美国法律",
      path: "knowledge-base/国际条约、外国法律/美国《兰哈姆法》（商标法）.pdf",
      summary: "美国联邦商标注册、混淆可能性、侵权与不正当竞争规则。",
      tags: ["美国商标", "兰哈姆法", "侵权", "平台投诉"], keyPoints: ["核验美国商标和在先使用", "保存跨境销售与宣传证据", "应对平台商标投诉与诉讼"]
    },
    {
      id: "cn-labor-contract-law", title: "中华人民共和国劳动合同法", category: "中国法规", module: "labor", type: "DOCX", jurisdiction: "中国", dated: "2012-12-28",
      path: "knowledge-base/中国法律法规/中华人民共和国劳动合同法_20121228.docx", excerptFile: "knowledge-base/中国法律法规/法规文本摘录/中华人民共和国劳动合同法_20121228.txt",
      summary: "规范劳动合同订立、履行、解除、经济补偿及劳务派遣等用工关系。",
      tags: ["劳动合同", "派遣", "解除", "经济补偿"], keyPoints: ["书面合同和工资支付留痕", "依法处理解除与补偿", "区分本地雇佣与对外劳务合作"]
    },
    {
      id: "cn-labor-law", title: "中华人民共和国劳动法", category: "中国法规", module: "labor", type: "DOCX", jurisdiction: "中国", dated: "2018-12-29",
      path: "knowledge-base/中国法律法规/中华人民共和国劳动法_20181229.docx", excerptFile: "knowledge-base/中国法律法规/法规文本摘录/中华人民共和国劳动法_20181229.txt",
      summary: "规定工时、休息休假、工资、劳动安全和社会保险等基础劳动标准。",
      tags: ["工时", "休息休假", "工资", "社保"], keyPoints: ["加班需符合法定条件和上限", "保障休息休假和劳动安全", "社保和工资记录应可核验"]
    },
    {
      id: "cn-foreign-labor", title: "对外劳务合作管理条例", category: "中国法规", module: "labor", type: "DOCX", jurisdiction: "中国", dated: "2012-06-04",
      path: "knowledge-base/中国法律法规/对外劳务合作管理条例_20120604.docx", excerptFile: "knowledge-base/中国法律法规/法规文本摘录/对外劳务合作管理条例_20120604.txt",
      summary: "规范对外劳务合作经营资格、合同、培训、收费和境外突发事件处置。",
      tags: ["对外劳务", "经营资格", "合同", "培训"], keyPoints: ["未取得资格不得开展对外劳务合作", "依法签订服务合同与劳动合同", "落实出国前培训及使领馆报告"]
    },
    {
      id: "eu-csddd", title: "CSDDD（企业可持续尽职调查指令）", category: "外国法律", module: "labor", type: "PDF", jurisdiction: "欧盟", dated: "欧盟规则",
      path: "knowledge-base/国际条约、外国法律/CSDDD（企业可持续尽职调查指令）.pdf",
      summary: "要求企业识别并处理供应链中的人权、劳工和环境负面影响。",
      tags: ["CSDDD", "尽职调查", "供应链人权", "劳工风险"], keyPoints: ["建立供应链人权尽职调查", "对高风险供应商开展审计", "保存申诉和整改闭环记录"]
    },
    {
      id: "eu-csrd", title: "CSRD（企业可持续发展报告指令）", category: "外国法律", module: "political", type: "PDF", jurisdiction: "欧盟", dated: "欧盟规则",
      path: "knowledge-base/国际条约、外国法律/CSRD（企业可持续发展报告指令）.pdf",
      summary: "扩展企业可持续发展信息披露范围，影响在欧盟经营企业的治理、劳工和环境数据准备。",
      tags: ["CSRD", "可持续发展报告", "ESG", "信息披露"], keyPoints: ["识别适用主体和报告边界", "完善ESG数据治理", "建立第三方鉴证准备机制"]
    },
    {
      id: "bit", title: "BIT双边投资协定", category: "国际条约", module: "political", type: "PDF", jurisdiction: "国际", dated: "投资条约",
      path: "knowledge-base/国际条约、外国法律/BIT双边投资协定.pdf",
      summary: "规定投资保护、公平公正待遇、征收补偿、汇兑和争端解决机制。",
      tags: ["BIT", "投资保护", "征收", "仲裁"], keyPoints: ["核查投资是否符合协定定义", "识别征收与公平公正待遇条款", "评估磋商和仲裁触发条件"]
    },
    {
      id: "icsid", title: "ICSID公约（《华盛顿公约》）", category: "国际条约", module: "political", type: "PDF", jurisdiction: "国际", dated: "国际条约",
      path: "knowledge-base/国际条约、外国法律/ICSID公约（《华盛顿公约》）.pdf",
      summary: "建立国际投资争端解决中心及投资者—国家仲裁制度。",
      tags: ["ICSID", "投资仲裁", "国家争端", "救济"], keyPoints: ["确认条约与仲裁同意基础", "评估管辖、属时和属物条件", "提前保存损失与因果关系证据"]
    },
    {
      id: "miga", title: "MIGA Convention (April 2018)", category: "国际条约", module: "political", type: "PDF", jurisdiction: "国际", dated: "2018-04",
      path: "knowledge-base/国际条约、外国法律/MIGA Convention (April 2018).pdf",
      summary: "多边投资担保机构公约，覆盖征收、汇兑限制、战争和内乱等政治风险担保。",
      tags: ["MIGA", "政治风险保险", "征收", "汇兑限制"], keyPoints: ["评估项目是否可投保", "核对战争、征收和汇兑风险覆盖", "将保险成本纳入投资测算"]
    },
    {
      id: "cn-overseas-investment", title: "国务院关于对外投资的规定", category: "中国法规", module: "political", type: "DOCX", jurisdiction: "中国", dated: "2026-05-05",
      path: "knowledge-base/中国法律法规/国务院关于对外投资的规定_20260505.docx", excerptFile: "knowledge-base/中国法律法规/法规文本摘录/国务院关于对外投资的规定_20260505.txt",
      summary: "规范对外投资备案、核准、合规经营、风险防控和境外权益保护。",
      tags: ["对外投资", "备案核准", "境外合规", "风险防控"], keyPoints: ["确认投资路径和备案核准义务", "建立境外项目合规治理", "重大风险及时报告"]
    },
    {
      id: "us-fcpa", title: "美国FCPA", category: "外国法律", module: "political", type: "PDF", jurisdiction: "美国", dated: "美国法律",
      path: "knowledge-base/国际条约、外国法律/美国FCPA.pdf",
      summary: "美国反海外腐败法，禁止向外国官员行贿并规范账簿和内部控制。",
      tags: ["FCPA", "反腐败", "域外管辖", "内部控制"], keyPoints: ["识别高风险第三方和官员接触", "开展反腐败尽职调查", "保留账簿记录和审批凭证"]
    },
    {
      id: "us-sherman-act", title: "美国《谢尔曼法》", category: "外国法律", module: "political", type: "PDF", jurisdiction: "美国", dated: "美国法律",
      path: "knowledge-base/国际条约、外国法律/美国《谢尔曼法》.pdf",
      summary: "美国核心反垄断法，规制垄断化、横向和纵向限制竞争行为。",
      tags: ["反垄断", "谢尔曼法", "垄断", "域外管辖"], keyPoints: ["审视经销协议和价格政策", "避免竞争者间敏感信息交换", "评估美国市场和商业效果联系"]
    },
    {
      id: "us-clayton-act", title: "美国《克莱顿法》", category: "外国法律", module: "political", type: "PDF", jurisdiction: "美国", dated: "美国法律",
      path: "knowledge-base/国际条约、外国法律/美国《克莱顿法》.pdf",
      summary: "规制价格歧视、排他交易、搭售和可能实质减少竞争的并购。",
      tags: ["反垄断", "克莱顿法", "排他交易", "并购"], keyPoints: ["审查渠道政策和排他安排", "评估并购申报和竞争影响", "避免无正当理由的价格歧视"]
    }
  ]
};
