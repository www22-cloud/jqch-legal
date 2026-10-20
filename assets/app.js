(() => {
  "use strict";

  const MODULE_META = {
    export: { name: "出口管制与海关合规", short: "出口管制", icon: "01" },
    ip: { name: "知识产权海外布局", short: "知识产权", icon: "02" },
    labor: { name: "跨境用工合规", short: "跨境用工", icon: "03" },
    political: { name: "东道国政治与法律主权", short: "政治与投资", icon: "04" }
  };

  const CASES = {
    export: [
      { tag: "河北案例 · 2026", title: "廊坊振创借名申报案", text: "实际货主无出口资质，借用企业名义申领出口许可证并申报热轧卷板，被认定申报不实，罚款10.1万元。" },
      { tag: "河北案例 · 2026", title: "唐山中厚板材许可证超额案", text: "许可证数量操作失误，实际超出核定数量264.513吨，被海关罚款7.2万元。" },
      { tag: "河北案例", title: "邯郸群帮耐火材料税务案", text: "隐匿出口应征税货物收入偷税，被追缴税费款、滞纳金并处罚款合计550.91万元。" }
    ],
    ip: [
      { tag: "河北案例 · 2026", title: "河北车企土耳其商标抢注", text: "多家重点车企商标在土耳其疑似遭遇恶意抢注，凸显出口前的商标检索与异议机制。" },
      { tag: "河北案例", title: "南宫毛毡企业涉美诉讼", text: "30余家毛毡企业被美国同一原告以专利、商标侵权等名义追加为被告。" },
      { tag: "河北案例", title: "白沟箱包企业涉美商标诉讼", text: "国际品牌对白沟箱包企业提起商标侵权诉讼，平台与海关执法风险叠加。" }
    ],
    labor: [
      { tag: "河北案例 · 2025", title: "河北中信境外就业资质被吊销", text: "允许其他单位以本企业名义组织劳务、未安排培训、未签书面合同、未向使领馆报告，被吊销对外劳务合作资格。" },
      { tag: "典型风险", title: "墨西哥“996”停工案", text: "制造企业推行超时工作方式，被认定强迫劳动，全员停工，赔偿超过200万美元。" },
      { tag: "典型风险", title: "塞尔维亚“用工双标”", text: "中方外派员工承担当地员工下班后的兜底任务，引发跨境劳动标准与客户审查风险。" }
    ],
    political: [
      { tag: "河北案例 · 2025-2026", title: "敬业集团英国钢铁被国有化", text: "英国政府先接管控制权并推动国有化立法，敬业集团依据中英BIT启动磋商并要求赔偿。" },
      { tag: "河北实践", title: "河钢集团应对欧美贸易壁垒", text: "面对双反、301、337等调查，组建中外法律团队联合应诉并推进本地化生产。" },
      { tag: "国际案例", title: "荷兰冻结安世半导体资产", text: "东道国以国家安全为由干预已完成交易，显示政治与法律主权风险可追溯发生。" }
    ]
  };

  const CASE_LESSONS = {
    export: "重点观察：许可证主体与数量、申报一致性、最终用途，以及借名申报等高频违规形态。",
    ip: "重点观察：目标市场商标是否提前注册、是否建立监测异议机制，以及平台投诉和专利FTO准备。",
    labor: "重点观察：对外劳务经营资格、合同三件套、出国前培训、属地工时与社保合规。",
    political: "重点观察：东道国立法干预、国家安全审查、BIT救济路径，以及政治风险保险。"
  };

  const state = { results: {}, quick: null, kbFilter: "all", kbType: "all", kbSearch: "" };
  const byId = (id) => document.getElementById(id);
  const clamp = (n, min = 0, max = 100) => Math.max(min, Math.min(max, Math.round(n)));
  const escapeHtml = (value) => String(value ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const levelInfo = (score) => score >= 75 ? { label: "极高风险", cls: "critical" } : score >= 50 ? { label: "高风险", cls: "high" } : score >= 25 ? { label: "中风险", cls: "medium" } : { label: "低风险", cls: "low" };
  const sourceById = (id) => (window.KNOWLEDGE?.sources || []).find((item) => item.id === id);

  const PERSIST_KEY = "jqch-risk-state-v1";
  function loadPersistedState() {
    let raw = null;
    try { if (window.name && window.name.startsWith("JQCH:")) raw = window.name.slice(5); } catch (error) {}
    if (!raw) { try { raw = localStorage.getItem(PERSIST_KEY); } catch (error) {} }
    if (!raw) return;
    try { const saved = JSON.parse(raw); state.results = saved.results || {}; state.reportIncluded = saved.reportIncluded || {}; } catch (error) {}
  }
  function persistState() {
    try {
      const raw = JSON.stringify({ results: state.results, reportIncluded: state.reportIncluded || {} });
      window.name = "JQCH:" + raw;
      localStorage.setItem(PERSIST_KEY, raw);
    } catch (error) {}
  }

  function showToast(message) {
    const el = byId("toast");
    if (!el) return;
    el.textContent = message;
    el.classList.add("show");
    window.clearTimeout(showToast.timer);
    showToast.timer = window.setTimeout(() => el.classList.remove("show"), 2600);
  }

  function openFile(path) {
    const anchor = document.createElement("a");
    anchor.href = path;
    anchor.target = "_blank";
    anchor.rel = "noopener";
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
  }

  function downloadFile(path) {
    const anchor = document.createElement("a");
    anchor.href = path;
    anchor.download = "";
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
  }

  function openModal(title, subtitle, actions, bodyHtml) {
    byId("modalTitle").textContent = title;
    byId("modalSubtitle").textContent = subtitle || "";
    const actionHtml = (actions || []).map((item, index) => `<button class="btn small${item.primary ? " primary" : ""}" type="button" data-modal-index="${index}">${escapeHtml(item.label)}</button>`).join("");
    byId("modalActions").innerHTML = `${actionHtml}<button class="btn small" type="button" data-close-modal>关闭</button>`;
    byId("modalBody").innerHTML = bodyHtml || "";
    byId("modal").classList.add("open");
    byId("modal").setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    (actions || []).forEach((item, index) => {
      const button = byId("modalActions").querySelector(`[data-modal-index="${index}"]`);
      if (button) button.addEventListener("click", item.handler);
    });
  }

  function closeModal() {
    byId("modal").classList.remove("open");
    byId("modal").setAttribute("aria-hidden", "true");
    byId("modalBody").innerHTML = "";
    document.body.style.overflow = "";
  }

  function moduleReferences(module) {
    return (window.KNOWLEDGE?.sources || []).filter((item) => item.module === module).slice(0, 6);
  }

  function renderReferences(ids) {
    const items = (ids || []).map(sourceById).filter(Boolean);
    if (!items.length) return "";
    return `<div class="result-section"><h4>知识库依据</h4>${items.map((item) => `<div class="reference-item"><div class="dot"></div><div><a href="${escapeHtml(item.path)}" target="_blank" rel="noopener">${escapeHtml(item.title)}</a><small>${escapeHtml(item.category)} · ${escapeHtml(item.jurisdiction)} · ${escapeHtml(item.type)}</small></div></div>`).join("")}</div>`;
  }

  function renderCases(module) {
    return `<div class="case-grid">${(CASES[module] || []).map((item) => `<div class="case-card"><small>${escapeHtml(item.tag)}</small><b>${escapeHtml(item.title)}</b><p>${escapeHtml(item.text)}</p></div>`).join("")}</div>`;
  }

  function renderRisk(module, result) {
    const score = clamp(result.score);
    const level = levelInfo(score);
    const findings = result.findings.length ? result.findings : ["当前输入未发现明显高风险信号，仍需保存完整交易和合规档案。"];
    const actions = result.actions.length ? result.actions : ["按季度复核最新法规、处罚案例和业务变化。"];
    const refs = result.refs || moduleReferences(module).map((item) => item.id);
    const servicePromise = module === "export" ? `<div class="service-promise">AI体检不收费 · 分级建议不推销 · 律师对接不强制</div><div class="triage-flow"><span>填写信息</span><i>→</i><span>AI初筛</span><i>→</i><span>风险分级</span><i>→</i><span>建议行动</span></div>` : "";
    return `
      ${servicePromise}
      <div class="risk-header">
        <div class="risk-score">${score}</div>
        <div><b>${escapeHtml(result.title)} <span class="risk-level">${level.label}</span></b><p>${escapeHtml(result.summary)}</p></div>
      </div>
      <div class="risk-meter"><span style="transform:scaleX(${score / 100})"></span></div>
      <div class="result-section"><h4>发现的问题</h4>${findings.map((item) => `<div class="finding"><i class="dot"></i><span>${escapeHtml(item)}</span></div>`).join("")}</div>
      <div class="result-section"><h4>建议行动</h4>${actions.map((item) => `<div class="action-item"><i class="dot"></i><span>${escapeHtml(item)}</span></div>`).join("")}</div>
      ${renderReferences(refs)}
      <div class="split-note"><span><em class="legal-disclaimer">（初筛参考，不替代正式法律意见）</em> 本结果由规则引擎基于当前输入和本地知识库生成，属于初步筛查。</span><a href="#knowledge">查看法规原文 →</a></div>`;
  }

  function setResult(module, result) {
    state.results[module] = result;
    persistState();
    const el = byId(`${module}Result`);
    if (el) el.innerHTML = renderRisk(module, result);
    const addBtn = document.querySelector(`[data-add-report="${module}"]`);
    if (addBtn) { addBtn.textContent = "✅ 加入全局报告"; addBtn.classList.remove("is-added"); }
    updateMetric(module, result.score);
  }

  function resetModule(module) {
    state.results[module] = null;
    state.reportIncluded = state.reportIncluded || {};
    state.reportIncluded[module] = false;
    const result = byId(`${module}Result`);
    if (result) result.innerHTML = `<h3>风险初筛结果</h3>${module === "export" ? '<div class="service-promise">AI体检不收费 · 分级建议不推销 · 律师对接不强制</div><div class="triage-flow"><span>填写信息</span><i>→</i><span>AI初筛</span><i>→</i><span>风险分级</span><i>→</i><span>建议行动</span></div>' : ''}<div class="empty">填写信息后生成风险等级、问题清单、法规依据和行动建议。</div>`;
    const addBtn = document.querySelector(`[data-add-report="${module}"]`);
    if (addBtn) { addBtn.textContent = "✅ 加入全局报告"; addBtn.classList.remove("is-added"); }
    updateMetric(module, null);
    persistState();
  }

  function updateMetric(module, score) {
    const value = byId(`metric${module[0].toUpperCase()}${module.slice(1)}`);
    const note = byId(`metric${module[0].toUpperCase()}${module.slice(1)}Note`);
    if (!value) return;
    if (score == null) {
      value.textContent = "待评估";
      value.style.color = "";
      if (note) note.textContent = "";
      return;
    }
    const level = levelInfo(score);
    value.textContent = `${score}分 · ${level.label}`;
    value.style.color = score >= 75 ? "#d64545" : score >= 50 ? "#d77621" : score >= 25 ? "#9b6b13" : "#128a6a";
    if (note) note.textContent = MODULE_META[module].name;
  }
  function runExport(event) {
    event.preventDefault();
    let score = 0;
    const findings = [];
    const actions = [];
    const product = byId("exportType").value;
    const market = byId("exportMarket").value;
    const hs = byId("exportHs").value.trim();
    const screening = document.querySelector('input[name="exportScreening"]:checked')?.value || "unknown";
    const classification = document.querySelector('input[name="exportClassification"]:checked')?.value || "none";
    const mode = document.querySelector('input[name="exportMode"]:checked')?.value || "self";
    const productPoints = { steel: 20, dual: 30, chemical: 26, technology: 27, agri: 14, general: 6 };
    score += productPoints[product] || 8;
    if (["dual", "chemical", "technology"].includes(product)) findings.push("管制属性：产品可能涉及出口管制、危险化学品、技术出口或最终用途审查，需要完成清单与参数比对。");
    if (!hs) { score += 24; findings.push("管制属性：缺少HS编码和产品参数，无法完成受控物项初筛。"); }
    else {
      if (/^(72|73)/.test(hs)) { score += 15; findings.push("管制属性：HS编码落入钢铁或金属制品范围，需进一步核查元素含量、合金成分和技术参数。"); }
      else if (/^(28|29|30|31|32|33|34|35|36|37|38|39)/.test(hs)) { score += 12; findings.push("管制属性：可能涉及化学品、农药、医药或高分子材料，成分与用途申报需重点核验。"); }
      else if (/^(84|85|90)/.test(hs)) { score += 12; findings.push("管制属性：设备、电子或精密仪器可能包含受控软件、技术参数或两用功能。"); }
      if (hs.replace(/[^0-9]/g, "").length < 6 && !/[\u4e00-\u9fa5]{3,}/.test(hs)) findings.push("归类风险：HS编码或产品描述不完整，当前只能执行低精度初筛。");
    }
    const marketPoints = { eu: 10, us: 8, uk: 7, turkey: 5, sea: 6, other: 5 };
    score += marketPoints[market] || 5;
    const screeningRules = {
      verified: [0, "许可要求：企业已开展系统性排查，但仍需保留清单比对和许可判断记录。"],
      partial: [18, "许可要求：仅核对HS编码不代表无需许可，管制认定还可能依据元素含量、技术指标和最终用途。"],
      freight: [30, "许可要求：依赖货代或报关行判断，最终行政和刑事责任仍由出口企业承担。"],
      unknown: [40, "许可要求：尚未开展管制属性排查，存在无意识违规风险。"]
    };
    const [screeningScore, screeningFinding] = screeningRules[screening] || [25, ""]; score += screeningScore; if (screeningFinding) findings.push(screeningFinding);
    const classificationRules = {
      predetermination: [0, "归类风险：已使用预裁定或专业归类服务，仍需关注目的国编码差异。"],
      self: [14, "归类风险：自行归类可能存在材质、功能或用途争议，建议申请预裁定或专业复核。"],
      history: [30, "归类风险：曾被海关质疑或调整，应评估信用等级影响并建立归类复核机制。"],
      none: [26, "归类风险：尚未关注归类问题，建议启动HS编码辅助归类和历史申报复核。"]
    };
    const [classificationScore, classificationFinding] = classificationRules[classification] || [20, ""]; score += classificationScore; if (classificationFinding) findings.push(classificationFinding);
    if (mode === "agent") { score += 24; findings.push("业务模式：委托代理出口需核查代理是否以自营名义报关，避免形成“买单出口”或借名申报风险。"); actions.push("保留完整委托合同、货权凭证、付款记录和代理报关授权，禁止代理方以自营名义伪报货主。"); }
    if (byId("exportUSOrigin")?.checked) { score += 18; findings.push("管制属性：产品包含美国原产技术或软件成分，可能触发EAR再出口或视同出口规则。"); }
    if (byId("exportTech")?.checked) { score += 12; findings.push("管制属性：涉及技术资料、软件或再出口，需核验技术出口目录和境外流转链条。"); }
    if (byId("exportTradeRemedy")?.checked) { score += 12; findings.push("贸易救济：该产品可能涉及双反、301或337措施，应核验目的国税率、配额和调查状态。"); }
    if (byId("exportMilitary")?.checked) { score += 40; findings.push("最终用户：最终用户涉及军事、警用或政府机构，应暂停交易并核查军品出口管理和最终用途证明。"); }
    if (byId("exportSensitiveUse")?.checked) { score += 50; findings.push("红线预警：最终用途可能涉及核、导、生化等敏感领域，建议立即暂停交易并咨询专业律师。"); }
    if (["steel", "dual"].includes(product) && market === "eu") { score += 15; findings.push("碳关税：钢铁/金属产品出口欧盟可能触发CBAM申报和第三方碳数据要求，建议评估碳足迹数据能力。"); }
    if (["eu", "us"].includes(market)) actions.push("同步核查目的国反倾销、反补贴、301/337、CBAM和供应链审查要求。");
    actions.push("建立“HS编码—管制清单—技术参数—许可证—最终用户—报关单”六项交叉核验表。");
    actions.push("保存产品成分、技术参数、许可判断、归类依据和最终用途证明，形成可追溯证据链。");
    if (screening !== "verified") actions.push("不要仅依赖货代或HS编码判断，建议由专业律师或合规团队复核管制属性。");
    if (classification !== "predetermination") actions.push("针对争议产品申请归类预裁定或专业归类意见，并复核历史申报。");
    if (byId("exportSensitiveUse")?.checked) actions.push("该情形超出AI初筛能力范围，请立即暂停交易并联系出口管制专业律师。");
    const result = { score: clamp(score), title: `出口风险指数 ${clamp(score)} / 100`, summary: "综合产品属性、HS编码、管制排查进度、归类风险和业务模式生成的初筛结果。", findings, actions, refs: ["cn-export-control-law", "cn-dual-use", "cn-customs-law", "case-customs-penalty", "eu-cbam", "eu-antidumping".replace("antidumping","anti-dumping")] };
    setResult("export", result);
  }

  function runIp(event) {
    event.preventDefault();
    let score = 0;
    const findings = [];
    const actions = [];
    const market = byId("ipMarket").value;
    const brandStage = document.querySelector('input[name="ipBrandStage"]:checked')?.value || "partial";
    const ftoStatus = document.querySelector('input[name="ipFtoStatus"]:checked')?.value || "none";
    const marketPoints = { turkey: 24, us: 18, eu: 17, uk: 14, sea: 12, other: 10 };
    score += marketPoints[market] || 10;
    if (market === "turkey") findings.push("商标抢注风险：土耳其是河北车企商标抢注重点市场，应优先完成在先检索、异议和监测预案。");
    if (["us", "eu"].includes(market)) findings.push("市场合规：美国和欧盟平台投诉及知识产权诉讼活跃，应同步准备商标、专利和版权布局。");
    const brandRules = {
      registered: [0, "商标抢注风险：核心市场已注册并有监测机制，仍应持续跟踪公告和近似商标申请。"],
      partial: [18, "商标抢注风险：部分国家或类别未覆盖，未注册市场可能存在抢注、下架和诉讼风险。"],
      oem: [16, "商标与代工风险：使用客户商标或代工需在合同中明确授权范围、知识产权归属和侵权担保责任。"],
      dispute: [35, "紧急争议：商标已被抢注或收到侵权指控，应立即固定证据并评估异议、无效、撤销或应诉策略。"]
    };
    const [brandScore, brandFinding] = brandRules[brandStage] || [15, ""]; score += brandScore; if (brandFinding) findings.push(brandFinding);
    const ftoRules = {
      ready: [0, "专利风险：已完成FTO检索和核心专利申请，仍需关注年费维护和竞争对手专利动态。"],
      patentOnly: [18, "专利风险：专利申请不等于不侵权，若技术方案落入在先专利保护范围仍可能被诉。"],
      none: [30, "技术侵权风险：未做专利布局和FTO检索，进入市场可能面临临时禁令、TRO和账户冻结。"],
      warning: [40, "紧急专利争议：已收到警告函或平台投诉，应立即评估不侵权抗辩、无效宣告和规避设计。"]
    };
    const [ftoScore, ftoFinding] = ftoRules[ftoStatus] || [20, ""]; score += ftoScore; if (ftoFinding) findings.push(ftoFinding);
    if (byId("ipEcommerce")?.checked) { score += 10; findings.push("平台合规：跨境电商平台投诉处置周期短，商标、图片、专利或版权问题均可能导致链接下架。"); }
    if (byId("ipComplaint")?.checked) { score += 28; findings.push("紧急争议：已收到侵权投诉、律师函或平台下架通知，应在72小时内固定证据并启动申诉或应诉。"); }
    if (byId("ipOemIndemnity")?.checked) { score += 12; findings.push("代工风险：客户要求承担知识产权担保责任，应在合同中限定授权范围、责任边界和赔偿条件。"); }
    if (byId("ipGeneric")?.checked) { score += 8; findings.push("显著性风险：品牌名称或设计辨识度较低，海外注册和维权可能面临显著性不足。"); }
    if (!byId("ipCustomsFiled")?.checked) { score += 12; findings.push("海关备案：尚未完成知识产权海关备案，无法充分利用海关主动依职权扣留机制。"); }
    if (byId("ipUsPatentHeavy")?.checked) { score += 15; findings.push("美国专利风险：产品出口美国且涉及专利密集型技术，应重点排查337调查和专利诉讼风险。"); }
    if (byId("ipTradeCase")?.checked) { score += 20; findings.push("贸易救济：目的国曾发生337调查或知识产权诉讼，需核查排除令、禁止令和历史涉案产品。"); }
    if (brandStage !== "registered") actions.push("补齐目标市场商标检索和核心类别注册，建立公告监测、异议和撤销预案。");
    if (ftoStatus !== "ready") actions.push("对主销产品开展FTO检索，形成规避设计、许可或无效宣告方案。");
    if (byId("ipComplaint")?.checked || ftoStatus === "warning" || brandStage === "dispute") actions.push("立即启动72小时应急响应：保存销售、设计、授权和沟通证据，联系当地律师评估平台申诉、临时禁令和应诉策略。");
    if (!byId("ipCustomsFiled")?.checked) actions.push("对核心商标和著作权评估海关知识产权备案，建立侵权货物扣留应对机制。");
    actions.push("建立“商标—专利—版权—外观设计—域名—平台店铺”一体化知识产权台账。");
    actions.push("高风险或已发生争议的案件，建议对接河北省知识产权保护中心或专业涉外律师。");
    const result = { score: clamp(score), title: `知识产权风险指数 ${clamp(score)} / 100`, summary: "综合目标市场、品牌保护阶段、FTO状态、平台投诉、海关备案和337风险生成的初筛结果。", findings, actions, refs: ["trips", "madrid-cn", "madrid-protocol", "turkey-ip-law", "eu-trademark-regulation", "us-patent-law", "us-lanham-act"] };
    setResult("ip", result);
  }

  function runLabor(event) {
    event.preventDefault();
    let score = 0;
    const findings = [];
    const actions = [];
    const market = byId("laborMarket").value;
    const workers = Number(byId("laborWorkers").value || 1);
    const mode = document.querySelector('input[name="laborMode"]:checked')?.value || "local";
    const qualification = document.querySelector('input[name="laborQualification"]:checked')?.value || "na";
    const contracts = document.querySelector('input[name="laborContracts"]:checked')?.value || "unknown";
    const hours = document.querySelector('input[name="laborHours"]:checked')?.value || "unknown";
    const social = document.querySelector('input[name="laborSocial"]:checked')?.value || "unknown";
    const union = document.querySelector('input[name="laborUnion"]:checked')?.value || "unknown";
    const marketPoints = { saudi: 22, eu: 17, us: 15, uk: 14, mexico: 24, brazil: 24, sea: 13, other: 10 };
    score += marketPoints[market] || 10;
    if (market === "saudi") findings.push("双法域风险：沙特实施Nitaqat本地化用工制度，应核验沙化率、沙特籍员工社保状态和行业配额。");
    if (market === "eu") findings.push("双法域风险：欧盟禁止强迫劳动产品规则和供应链尽调要求可能影响工时、加班和用工证明。");
    if (["mexico", "brazil"].includes(market)) findings.push("双法域风险：拉美市场对工时上限、社保、工会和集体协商敏感，应避免直接套用国内管理方式。");
    const modeRules = {
      local: [0, "用工路径：目标国本地雇佣应完全适用当地劳动法，重点核查社保、最低工资、工时和解雇保护。"],
      dispatch: [20, "用工路径：外派模式需同时满足中国对外劳务合作监管和东道国劳动法，存在双法域叠加风险。"],
      mixed: [15, "用工路径：本地雇佣与外派混合容易出现同工不同酬、工时双标和管理权冲突。"],
      outsourcing: [25, "用工路径：外包不等于免责，若被认定为虚假外包，企业仍可能承担雇主责任。"]
    };
    const [modeScore, modeFinding] = modeRules[mode] || [12, ""]; score += modeScore; if (modeFinding) findings.push(modeFinding);
    const qualificationRules = {
      qualified: [0, "资质备案：已取得对外劳务合作资格并完成外派备案，仍需保留备用金和使领馆报告记录。"],
      partial: [15, "资质备案：部分外派备案未完成，属于违法跨境用工高风险情形，应尽快补办。"],
      none: [30, "资质备案：未取得资格、借用资质或委托第三方组织劳务，可能面临吊销资质、罚款甚至刑事责任。"],
      na: [0, "资质备案：当前不涉及对外劳务合作，应转向目标国本地劳动法评估。"]
    };
    const [qualScore, qualFinding] = qualificationRules[qualification] || [18, ""]; score += qualScore; if (qualFinding) findings.push(qualFinding);
    const contractRules = {
      full: [0, "合同证据：合同齐全且完成公证认证，仍需核对东道国对试用期、竞业限制和解雇条款的强制性要求。"],
      partial: [15, "合同证据：合同部分缺失，发生解雇、欠薪或工伤争议时可能缺乏有效证据。"],
      none: [28, "合同证据：未签书面合同或仅口头约定，劳动争议举证和救济风险极高。"],
      domesticTemplate: [20, "合同证据：直接套用国内模板可能导致条款无效，应进行目标国合同条款对照和属地化改造。"]
    };
    const [contractScore, contractFinding] = contractRules[contracts] || [18, ""]; score += contractScore; if (contractFinding) findings.push(contractFinding);
    const hourRules = {
      local: [0, "劳动基准：工时制度已按目标国标准制定，仍需保存考勤、审批和工会告知记录。"],
      domestic: [18, "劳动基准：沿用国内工时制度可能违反目标国加班上限、休息休假和带薪假期规定。"],
      overtime: [14, "劳动基准：存在超时加班但已记录，应尽快补发加班工资或安排调休。"],
      noRecord: [30, "劳动基准：存在无记录加班或未支付加班费，可能触发劳动监察和强迫劳动审查。"]
    };
    const [hourScore, hourFinding] = hourRules[hours] || [18, ""]; score += hourScore; if (hourFinding) findings.push(hourFinding);
    const socialRules = {
      full: [0, "薪酬社保：工资、个税、社保和福利记录完整，仍需关注当地强制福利变化。"],
      partial: [15, "薪酬社保：部分缴纳或存在差额，可能被要求补缴并产生罚款。"],
      none: [25, "薪酬社保：未缴纳或未建立当地记录，双法域社保适用边界不清。"],
      unknown: [14, "薪酬社保：尚未确认缴纳状态，应先完成社保合规快速排查。"]
    };
    const [socialScore, socialFinding] = socialRules[social] || [15, ""]; score += socialScore; if (socialFinding) findings.push(socialFinding);
    const unionRules = {
      handled: [0, "工会协商：已识别工会要求并建立沟通机制，仍需持续跟踪集体协商议题。"],
      aware: [10, "工会协商：了解基本要求但未正式沟通，劳资纠纷可能升级为集体争议。"],
      unknown: [18, "工会协商：完全不清楚目标国工会要求，应开展工会制度和集体协商排查。"],
      dispute: [35, "工会协商：已发生工会投诉或集体协商争议，应立即启动应急处置和律师介入。"]
    };
    const [unionScore, unionFinding] = unionRules[union] || [18, ""]; score += unionScore; if (unionFinding) findings.push(unionFinding);
    if (workers >= 50) { score += 6; findings.push("规模风险：用工人数较多，劳动争议、工会谈判和供应链审查影响面扩大。"); }
    if (["dispatch", "mixed", "outsourcing"].includes(mode)) actions.push("核验对外劳务合作资格、外派备案、使领馆报告和风险处置备用金状态。");
    if (contracts !== "full") actions.push("补齐对外劳务合作合同、服务合同和劳动合同，并完成外文证据公证认证和翻译。");
    if (["domestic", "overtime", "noRecord"].includes(hours)) actions.push("按目标国法律重做排班、加班审批、休息休假和工资补偿制度。");
    if (social !== "full") actions.push("核验工资、个税、社保和商业保险缴纳，建立月度对账和员工可查询记录。");
    if (union !== "handled") actions.push("识别目标国工会、员工代表和集体协商要求，建立沟通和争议升级预案。");
    if (mode === "outsourcing") actions.push("审查外包商资质、实际用工控制权和劳动关系归属，避免被认定为虚假外包。");
    if (byId("laborMarket")?.value === "saudi") actions.push("核查沙特Nitaqat沙化率、行业配额和沙特籍员工社保状态。");
    if (union === "dispute" || qualification === "none") actions.push("该情形可能已超出AI初筛能力范围，请立即联系劳动法律师或河北省对外劳务合作服务平台。");
    const result = { score: clamp(score), title: `跨境用工风险指数 ${clamp(score)} / 100`, summary: "综合目标国、用工模式、资质备案、合同证据、工时、社保和工会协商要求生成的初筛结果。", findings, actions, refs: ["cn-foreign-labor", "cn-labor-contract-law", "cn-labor-law", "eu-csddd"] };
    setResult("labor", result);
  }

  function runPolitical(event) {
    event.preventDefault();
    let score = 0;
    const findings = [];
    const actions = [];
    const market = byId("politicalMarket").value;
    const scale = byId("investmentScale").value;
    const control = document.querySelector('input[name="investmentControl"]:checked')?.value || "control";
    const asset = document.querySelector('input[name="assetType"]:checked')?.value || "factory";
    const review = document.querySelector('input[name="securityReview"]:checked')?.value || "uncertain";
    const bit = document.querySelector('input[name="bitStatus"]:checked')?.value || "unknown";
    const insurance = document.querySelector('input[name="insurance"]:checked')?.value || "none";
    const marketPoints = { uk: 24, eu: 20, us: 21, turkey: 15, latam: 18, sea: 12, other: 12 };
    score += marketPoints[market] || 12;
    if (market === "uk") findings.push("征收与国有化：英国近年强化钢铁等战略产业干预，已完成交易仍可能因关键产业认定被追溯处理。");
    if (["eu", "us"].includes(market)) findings.push("审查风险：欧美国家安全审查和外资审查可能出现政治化适用，应预留救济与退出路径。");
    const scalePoints = { small: 5, medium: 10, large: 18, xlarge: 25 };
    score += scalePoints[scale] || 8;
    const controlPoints = { control: 15, influence: 12, passive: 0 };
    score += controlPoints[control] || 10;
    if (control === "influence") findings.push("控制权风险：即使持股低于25%，若拥有否决权、董事席位或技术访问权，仍可能触发安全审查。");
    const assetPoints = { sales: 4, factory: 18, resource: 26, tech: 23, ma: 22 };
    score += assetPoints[asset] || 12;
    if (asset === "factory") findings.push("关键产业风险：生产制造基地若被目标国认定为关键或战略产业，可能触发外资安全审查甚至国有化。");
    if (asset === "resource") findings.push("资源民族主义：能源、矿产和关键基础设施可能面临特许权使用费上调、国有持股和渐进式征收。");
    if (asset === "tech") findings.push("敏感技术风险：高科技、数据和敏感技术更容易触发国家安全审查和技术保护措施。");
    if (asset === "ma") findings.push("并购审查：并购现有企业可能同时触发反垄断、国家安全、劳工承接和债务诉讼审查。");
    const reviewRules = {
      cleared: [0, "国家安全审查：已确认无需申报，应保留对照强制申报清单的记录。"],
      preparing: [15, "国家安全审查：需要申报，应准备投资方案、控制权结构和最终受益人信息。"],
      uncertain: [22, "国家安全审查：不确定是否需要申报，建议立即开展触发条件自测。"],
      completed: [35, "国家安全审查：已完成交易但未申报，存在追溯申报、罚款和交易无效风险。"]
    };
    const [reviewScore, reviewFinding] = reviewRules[review] || [20, ""]; score += reviewScore; if (reviewFinding) findings.push(reviewFinding);
    const bitRules = {
      covered: [0, "BIT保护：已确认BIT覆盖并包含ICSID仲裁条款，仍需核查征收补偿和岔路口条款。"],
      limited: [10, "BIT保护：仲裁条款覆盖有限，可能只涵盖征收补偿额争议。"],
      none: [22, "BIT保护：非ICSID成员或无仲裁条款，需评估国内法院、PCA或ICC路径。"],
      unknown: [16, "BIT保护：尚未核查BIT状态，建议启动目标国BIT自动检索。"]
    };
    const [bitScore, bitFinding] = bitRules[bit] || [15, ""]; score += bitScore; if (bitFinding) findings.push(bitFinding);
    const insuranceRules = {
      sinosure: [0, "保险覆盖：已投保中国信保，应核查征收、汇兑、战争和政府违约的覆盖范围。"],
      miga: [0, "保险覆盖：已投保MIGA或多边机构担保，应关注承保条件和主权信用要求。"],
      intended: [12, "保险覆盖：有意向但尚未落实，建议尽快评估申请条件和项目可保性。"],
      none: [20, "保险覆盖：未安排政治风险保险，征收、汇兑和战争损失可能无法对冲。"]
    };
    const [insuranceScore, insuranceFinding] = insuranceRules[insurance] || [15, ""]; score += insuranceScore; if (insuranceFinding) findings.push(insuranceFinding);
    if (byId("politicalCriticalIndustry")?.checked) { score += 15; findings.push("关键产业：目标国将该行业列为关键或战略产业，国有化风险上升。"); }
    if (byId("politicalGovDependency")?.checked) { score += 10; findings.push("政策依赖：高度依赖政府补贴、电价或税收优惠，政策变化可能改变项目经济性。"); }
    if (byId("politicalGovJV")?.checked) { score += 12; findings.push("政府合资：与东道国政府或国有企业存在合资安排，控制权和利润分配争议风险上升。"); }
    if (byId("politicalNoStability")?.checked) { score += 15; findings.push("合同保护：投资协议缺少稳定条款或征收补偿条款，发生政策变化时缺少合同救济。"); }
    if (byId("politicalNoExit")?.checked) { score += 12; findings.push("退出机制：未设置退出、转让或争议解决机制，政治风险发生时难以及时止损。"); }
    if (byId("politicalNoInsurance")?.checked) { score += 15; findings.push("保险缺口：未购买政治风险保险，损失无法通过保险机制部分对冲。"); }
    if (review !== "cleared") actions.push("交易前完成国家安全审查和外资准入分析，设计申报、缓解条件和交易终止条款。");
    if (bit !== "covered") actions.push("核查适用BIT、投资定义、征收和公平公正待遇条款，以及ICSID或其他仲裁同意基础。");
    if (insurance === "intended" || insurance === "none") actions.push("评估中国信保海外投资保险、MIGA和商业政治风险保险的覆盖范围及理赔条件。");
    if (control !== "passive") actions.push("在股东协议、融资文件和治理安排中设置控制权、关键资产和知识产权的保护性条款。");
    if (asset === "factory" || asset === "resource") actions.push("核查目标国关键产业清单、资源税、国有持股政策和外资安全审查触发条件。");
    actions.push("持续保存投资、成本、利润、资产价值和政策沟通证据，为BIT磋商、调解或国际仲裁保留证据链。");
    const result = { score: clamp(score), title: `政治与投资风险指数 ${clamp(score)} / 100`, summary: "综合目标国、控制权、资产类型、国家安全审查、BIT保护和保险覆盖生成的初筛结果。", findings, actions, refs: ["bit", "icsid", "miga", "cn-overseas-investment", "us-fcpa", "us-sherman-act", "us-clayton-act"] };
    setResult("political", result);
  }

  function scrollToTarget(target) {
    const el = byId(target.replace(/^#/, ''));
    if (!el) return;
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function initCommandPalette() {
    const palette = byId('commandPalette');
    const input = byId('commandSearch');
    const list = byId('commandList');
    const trigger = byId('openCommand');
    if (!palette || !input || !list || !trigger) return;
    const commands = [
      { id: 'overview', label: '总览', hint: '总览', target: '#overview' },
      { id: 'new-feature', label: '石家庄跨境电商新功能', hint: '特色场景', target: '#new-feature' },
      { id: 'export', url: 'modules/export.html', label: '出口管制与海关合规', hint: '模块 01', target: '#module-export' },
      { id: 'ip', url: 'modules/ip.html', label: '知识产权海外布局', hint: '模块 02', target: '#module-ip' },
      { id: 'labor', url: 'modules/labor.html', label: '跨境用工合规', hint: '模块 03', target: '#module-labor' },
      { id: 'political', url: 'modules/political.html', label: '东道国政治与投资', hint: '模块 04', target: '#module-political' },
      { id: 'knowledge', label: '系统知识库', hint: '28 份资料', target: '#knowledge' },
      { id: 'report', label: '生成综合报告', hint: '操作', action: openReport },
      { id: 'steel', label: '载入河北钢铁案例', hint: '样例', action: () => loadSample('export') },
      { id: 'brand', label: '载入河北车企案例', hint: '样例', action: () => loadSample('ip') }
    ];
    let filtered = commands.slice();
    let activeIndex = 0;

    function renderCommands() {
      const query = input.value.trim().toLowerCase();
      filtered = commands.filter((item) => (item.label + ' ' + item.hint).toLowerCase().includes(query));
      activeIndex = Math.min(activeIndex, Math.max(filtered.length - 1, 0));
      if (!filtered.length) {
        list.innerHTML = '<div class="empty" style="margin:.5rem">没有匹配的操作。</div>';
        return;
      }
      list.innerHTML = filtered.map((item, index) => `<button class="command-item${index === activeIndex ? ' is-active' : ''}" type="button" role="option" aria-selected="${index === activeIndex}" data-command-index="${index}"><span class="command-icon">${String(index + 1).padStart(2, '0')}</span><span>${escapeHtml(item.label)}</span><small>${escapeHtml(item.hint)}</small></button>`).join('');
    }

    function openPalette() {
      palette.classList.add('open');
      palette.setAttribute('aria-hidden', 'false');
      input.value = '';
      activeIndex = 0;
      renderCommands();
      window.setTimeout(() => input.focus(), 0);
    }

    function closePalette() {
      palette.classList.remove('open');
      palette.setAttribute('aria-hidden', 'true');
    }

    function chooseCommand(index) {
      const item = filtered[index];
      if (!item) return;
      closePalette();
      if (item.action) item.action();
      else if (item.url) window.location.href = item.url;
      else scrollToTarget(item.target);
    }

    trigger.addEventListener('click', openPalette);
    input.addEventListener('input', () => { activeIndex = 0; renderCommands(); });
    input.addEventListener('keydown', (event) => {
      if (event.key === 'ArrowDown') { event.preventDefault(); activeIndex = Math.min(activeIndex + 1, filtered.length - 1); renderCommands(); }
      if (event.key === 'ArrowUp') { event.preventDefault(); activeIndex = Math.max(activeIndex - 1, 0); renderCommands(); }
      if (event.key === 'Enter') { event.preventDefault(); chooseCommand(activeIndex); }
      if (event.key === 'Escape') closePalette();
    });
    list.addEventListener('click', (event) => {
      const button = event.target.closest('[data-command-index]');
      if (button) chooseCommand(Number(button.dataset.commandIndex));
    });
    palette.addEventListener('click', (event) => { if (event.target === palette) closePalette(); });
    document.addEventListener('keydown', (event) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        palette.classList.contains('open') ? closePalette() : openPalette();
      }
    });
    renderCommands();
  }

  function initReveal() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || window.innerWidth < 640) return;
    const targets = [...document.querySelectorAll('.hero, .metrics, .module-card, #knowledge')];
    targets.forEach((el, index) => { el.classList.add('reveal'); el.style.setProperty('--i', String(index)); });
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => { if (entry.isIntersecting) { entry.target.classList.add('is-in'); observer.unobserve(entry.target); } });
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.08 });
    targets.forEach((el) => observer.observe(el));
  }

  function initModuleCases() {
    document.querySelectorAll('.module-card').forEach((card) => {
      const module = card.dataset.module;
      const items = CASES[module] || [];
      const layout = card.querySelector('.module-layout');
      if (!items.length || !layout) return;
      const strip = document.createElement('section');
      strip.className = 'module-cases';
      strip.setAttribute('aria-label', `${MODULE_META[module].name}典型案例`);
      strip.innerHTML = `
        <div class="case-strip-head">
          <div><span>REFERENCE CASES</span><strong>典型案例</strong></div>
          <button class="btn tiny" type="button" data-case-load="${module}">载入模块示例</button>
        </div>
        <p class="case-strip-note">${escapeHtml(CASE_LESSONS[module] || '')}</p>
        <div class="case-strip-grid">
          ${items.map((item) => `<article class="case-strip-card"><small>${escapeHtml(item.tag)}</small><b>${escapeHtml(item.title)}</b><p>${escapeHtml(item.text)}</p></article>`).join('')}
        </div>`;
      layout.after(strip);
      const loadButton = strip.querySelector('[data-case-load]');
      if (loadButton) loadButton.addEventListener('click', () => {
        loadSample(module);
        layout.scrollIntoView({ behavior: 'smooth', block: 'center' });
      });
    });
  }

  function initModuleRouting() {
    const moduleIds = ["module-export", "module-ip", "module-labor", "module-political"];
    const workspace = document.querySelector(".workspace");
    const cards = [...document.querySelectorAll(".workspace .module-card")];
    if (!workspace || !cards.length) return;
    if (window.__INITIAL_MODULE__) document.documentElement.classList.add("module-page");
    const sync = () => {
      const id = window.location.hash.replace("#", "") || (window.__INITIAL_MODULE__ ? `module-${window.__INITIAL_MODULE__}` : "");
      const active = moduleIds.includes(id);
      workspace.classList.toggle("is-active", active);
      cards.forEach((card) => card.classList.toggle("is-active", card.id === id));
      if (active) {
        document.querySelectorAll(".nav a").forEach((link) => {
          const href = link.getAttribute("href") || "";
          link.classList.toggle("active", window.__INITIAL_MODULE__ && href === `modules/${window.__INITIAL_MODULE__}.html`);
        });
        window.setTimeout(() => document.getElementById(id)?.scrollIntoView({ block: "start" }), 80);
      }
    };
    window.addEventListener("hashchange", sync);
    sync();
  }

  function initReportActions() {
    document.querySelectorAll("[data-add-report]").forEach((button) => {
      button.addEventListener("click", () => {
        const module = button.dataset.addReport;
        if (!state.results[module]) { showToast("请先生成该模块风险清单"); return; }
        state.reportIncluded = state.reportIncluded || {};
        state.reportIncluded[module] = true;
        persistState();
        button.textContent = "✅ 已加入报告";
        button.classList.add("is-added");
      });
    });
    const runAll = byId("runAllModules");
    if (runAll) runAll.addEventListener("click", () => {
      ["export", "ip", "labor", "political"].forEach((module) => submitForm(`${module}Form`));
      state.reportIncluded = { export: true, ip: true, labor: true, political: true };
      persistState();
      openReport();
    });
  }

  function updateExportCategoryHint() {
    const el = byId("exportCategoryHint");
    if (!el) return;
    const type = byId("exportType")?.value || "general";
    const market = byId("exportMarket")?.value || "other";
    const hints = {
      steel: "⚠️ 该品类高频管制关注：含镉/钕铁硼永磁材料、钛合金制品、特种石墨、工业反应换热设备。请进一步核对元素含量和技术参数。",
      dual: "⚠️ 该品类可能涉及两用物项清单、最终用户/最终用途审查和技术参数判定，不能仅凭HS编码判断是否受控。",
      chemical: "⚠️ 化学品需重点核对成分、浓度、危险特性、用途和目的国化学品法规，避免仅按商品名称归类。",
      technology: "⚠️ 技术、软件和设备可能触发技术出口、视同出口或再出口规则，需核查技术资料和境外流转链条。",
      agri: "⚠️ 农食产品需关注检验检疫、农药残留、原产地和目的国准入标准。",
      general: "当前为一般消费品提示。仍建议核对HS编码、品牌授权和目的国产品安全要求。"
    };
    let text = hints[type] || hints.general;
    if (["steel", "dual"].includes(type) && market === "eu") text += " 出口欧盟还需评估CBAM碳足迹数据和第三方核查要求。";
    el.innerHTML = `<span>${escapeHtml(text)}</span>`;
  }

  function classifyProductText(text) {
    const value = (text || "").toLowerCase();
    if (/钢|铁|合金|热轧|冷轧|紧固件|丝网/.test(value)) return "初步提示：重点核查HS第72/73章；如含镉、钕铁硼、钛合金或特种石墨，需进一步核对两用物项管制清单和技术参数。";
    if (/化学|农药|医药|原料|试剂/.test(value)) return "初步提示：重点核查HS第28–38章或第30章，并核对成分、浓度、危险特性和最终用途。";
    if (/机器人|机械|设备|电子|仪器|数控|铣床/.test(value)) return "初步提示：重点核查HS第84/85/90章，并核对设备技术参数、软件功能和是否包含受控技术。";
    if (/纺织|毛巾|服装|箱包|皮革/.test(value)) return "初步提示：重点核查HS第42/50–63章，并关注品牌授权、标签、REACH和平台规则。";
    if (/食品|水果|梨|藜麦|宠物/.test(value)) return "初步提示：重点核查HS第1–24章，并核对检验检疫、农残、标签和原产地要求。";
    return "信息不足。请补充产品名称、主要材质、功能用途、关键成分或技术参数后再次判断。";
  }

  function updateExportFollowup() {
    const el = byId("exportFollowup");
    if (!el) return;
    const product = byId("exportType")?.value;
    const market = byId("exportMarket")?.value;
    const screening = document.querySelector('input[name="exportScreening"]:checked')?.value;
    const classification = document.querySelector('input[name="exportClassification"]:checked')?.value;
    const mode = document.querySelector('input[name="exportMode"]:checked')?.value;
    const questions = [];
    if (product === "steel") questions.push("产品是否含镉、钕、钛或特种石墨？具体元素含量和技术参数是多少？");
    if (screening === "partial" || screening === "freight") questions.push("是否能提供产品材质、元素含量、技术指标和最终用途证明？");
    if (screening === "unknown") questions.push("请先确认产品名称、材质、用途和是否可能属于两用物项。");
    if (classification === "self" || classification === "none") questions.push("产品的主要材质、功能和用途是什么？是否与同类产品存在归类争议？");
    if (mode === "agent") questions.push("代理方是否以自营名义报关？是否保留委托合同、货权凭证和付款记录？");
    if (product === "steel" && market === "eu") questions.push("是否具备欧盟CBAM所需的碳排放数据和第三方核查能力？");
    if (byId("exportSensitiveUse")?.checked) questions.push("最终用途是否涉及核、导、生化等敏感领域？请立即暂停交易并寻求专业意见。");
    if (!questions.length) questions.push("请补充产品HS编码、材质、技术参数和最终用途，系统将继续细化管制判断。");
    el.innerHTML = `<div class="followup-question"><span>AI 追问</span><ul>${questions.map((q) => `<li>${escapeHtml(q)}</li>`).join("")}</ul><small>这里是规则式追问；正式判断仍需专业律师和管制清单核验。</small></div><button class="inline-link ai-followup-btn" type="button" data-ai-context="export">让 DeepSeek 继续追问</button>`;
  }

  function initExportAssistant() {
    const type = byId("exportType");
    const market = byId("exportMarket");
    const button = byId("exportAiClassify");
    if (type) type.addEventListener("change", updateExportCategoryHint);
    if (market) market.addEventListener("change", updateExportCategoryHint);
    if (button) button.addEventListener("click", () => {
      const body = `<div class="notice">本工具提供初步归类线索，不替代海关归类决定或专业意见。</div><div class="field" style="margin-top:1rem"><label for="aiClassifyInput">产品名称、材质、用途、技术参数</label><textarea id="aiClassifyInput" placeholder="例如：热轧钢卷，主要成分铁、碳、锰，用于建筑结构，厚度3mm"></textarea></div><div class="followup-question" id="aiClassifyResult"><span>AI 辅助归类</span><p>填写产品信息后点击生成初步提示。</p></div>`;
      openModal("AI辅助归类", "输入产品信息，生成HS编码方向与管制提示", [{ label: "生成初步提示", primary: true, handler: () => { const text = byId("aiClassifyInput")?.value || ""; byId("aiClassifyResult").innerHTML = `<span>AI 辅助归类</span><p>${escapeHtml(classifyProductText(text))}</p><small>仅用于初筛，正式归类请申请预裁定或咨询专业归类师</small>`; } }], body);
    });
    updateExportCategoryHint();
  }

  function updateIpMarketHint() {
    const el = byId("ipMarketHint");
    if (!el) return;
    const market = byId("ipMarket")?.value;
    const hints = {
      turkey: "⚠️ 土耳其市场提示：河北多家车企商标在土耳其遭遇疑似恶意抢注。土耳其商标审查周期较长，建议“市场未动、商标先行”。",
      us: "⚠️ 美国市场提示：中国企业在美知识产权诉讼和跨境电商案件高发，平台投诉可能快速升级为TRO和账户冻结。",
      eu: "⚠️ 欧盟市场提示：欧盟商标覆盖广，但成员国国内法和平台规则仍需分别核查，建议同步监测商标公告。",
      uk: "⚠️ 英国市场提示：脱欧后需单独核查英国商标和专利状态，不能仅依赖欧盟权利。",
      sea: "⚠️ 东南亚市场提示：各国商标和专利制度相互独立，应逐国检索并关注当地抢注和平台投诉。",
      other: "请进一步确认目标国家的商标、专利和平台规则。"
    };
    el.innerHTML = `<span>${escapeHtml(hints[market] || hints.other)}</span>`;
  }

  function updateIpFollowup() {
    const el = byId("ipFollowup");
    if (!el) return;
    const brand = document.querySelector('input[name="ipBrandStage"]:checked')?.value;
    const fto = document.querySelector('input[name="ipFtoStatus"]:checked')?.value;
    const questions = [];
    if (brand === "registered") questions.push("是否建立了覆盖主要出口市场的商标公告监测和异议机制？");
    if (brand === "partial") questions.push("请确认未注册的目标市场，并说明是否安排了商标监测或防御性注册。");
    if (brand === "oem") questions.push("客户是否要求我方承担知识产权担保责任？合同是否明确授权范围、归属和免责条款？");
    if (brand === "dispute") questions.push("抢注或投诉发生在哪个国家？是否已保存使用证据、销售记录和对方商标信息？");
    if (fto === "patentOnly") questions.push("已申请专利是否覆盖核心市场和关键技术方案？是否做过他人在先专利检索？");
    if (fto === "none") questions.push("产品的核心技术、外观设计和主要市场是什么？是否接受FTO检索和规避设计？");
    if (fto === "warning") questions.push("警告函或投诉的具体主张是什么？是否涉及专利、商标、著作权或平台规则？");
    if (byId("ipEcommerce")?.checked) questions.push("计划进入哪些平台？是否已准备商标、图片、专利和版权授权证据？");
    if (!byId("ipCustomsFiled")?.checked) questions.push("核心商标和著作权是否已评估海关知识产权备案？");
    if (byId("ipTradeCase")?.checked) questions.push("是否涉及美国337调查或排除令？涉案产品和技术范围是什么？");
    if (!questions.length) questions.push("请补充目标市场、品牌保护阶段、FTO状态和当前争议情况。");
    el.innerHTML = `<div class="followup-question"><span>AI 追问</span><ul>${questions.map((q) => `<li>${escapeHtml(q)}</li>`).join("")}</ul><small>高风险或已发生争议时，建议转入专业律师或河北知识产权保护中心处理。</small></div><button class="inline-link ai-followup-btn" type="button" data-ai-context="ip">让 DeepSeek 继续追问</button>`;
  }

  function initIpAssistant() {
    const form = byId("ipForm");
    const market = byId("ipMarket");
    if (market) market.addEventListener("change", () => { updateIpMarketHint(); updateIpFollowup(); });
    if (form) { form.addEventListener("change", updateIpFollowup); form.addEventListener("input", updateIpFollowup); }
    updateIpMarketHint();
    updateIpFollowup();
  }

  function assistantSourceTitles(terms, limit = 3) {
    const sources = window.KNOWLEDGE?.sources || [];
    return sources.filter((item) => terms.some((term) => (item.title + item.summary + (item.tags || []).join(" ")).includes(term))).slice(0, limit).map((item) => item.title);
  }

  function moduleAnswer(module, intro) {
    const result = state.results[module];
    if (!result) return `${intro}\n\n当前还没有该模块的检测结果。建议先在首页或对应模块填写业务信息并生成风险清单。`;
    const findings = (result.findings || []).slice(0, 2).join("\n");
    const action = (result.actions || [])[0] || "建议进一步核实交易细节。";
    return `${intro}\n\n当前风险指数：${result.score}/100。\n${findings}\n\n下一步：${action}`;
  }

  function localAssistantReply(question) {
    const text = (question || "").trim();
    if (!text) return "请描述你的产品、目标市场或当前遇到的知识产权、用工、海关问题。";
    if (/你好|您好|hi|hello/i.test(text)) return "你好，我是冀企出海法律风险助手。你可以问我：两用物项怎么排查、商标被抢注怎么办、跨境用工有哪些风险，或者直接说“我的风险优先级是什么”。";
    if (/报告|汇总|优先级|总风险/.test(text)) {
      const entries = Object.entries(state.results).filter(([key, value]) => value && value.score != null && MODULE_META[key]);
      if (!entries.length) return "目前还没有可汇总的模块结果。你可以先填写首页的全局风险画像，或使用“一键生成综合评估”。";
      const ranked = entries.sort((a, b) => b[1].score - a[1].score);
      return `当前已生成模块的风险排序：\n${ranked.map(([key, value], index) => `${index + 1}. ${MODULE_META[key].name}：${value.score}分（${levelInfo(value.score).label}）`).join("\n")}\n\n建议先进入风险最高的模块查看具体问题和行动建议。`;
    }
    if (/出口|HS|海关|两用|管制|CBAM|反倾销|报关|货代/.test(text)) return moduleAnswer("export", "出口管制的核心不是“有没有报关”，而是产品是否落入管制清单、HS归类是否准确、技术参数和最终用途是否触发许可。");
    if (/知识产权|商标|专利|FTO|337|TRO|平台投诉|抢注/.test(text)) return moduleAnswer("ip", "知识产权需要同时看商标布局、FTO检索、平台投诉和海关备案。收到平台投诉或律师函时，应优先保存证据并评估72小时应急响应。");
    if (/用工|劳动|外派|劳务|社保|工时|工会/.test(text)) return moduleAnswer("labor", "跨境用工的重点是对外劳务资格、合同闭环、属地工时、社保和工会程序，不能直接照搬国内管理方式。");
    if (/政治|投资|BIT|征收|制裁|国家安全|MIGA|海外建厂/.test(text)) return moduleAnswer("political", "海外投资要同时评估外资审查、征收、汇兑限制、控制权和BIT救济路径，重资产项目尤其需要设计退出机制。");
    if (/跨境电商|石家庄|亚马逊|TikTok|Temu|独立站/.test(text)) return "石家庄跨境电商专项探索已接入独立子页面，可从首页下方“专项场景探索”进入，内容包括商品准入、AIGC素材、企业资质和数据链路检测。";
    if (/律师|专家|保护中心|法律援助/.test(text)) return "如果已出现行政处罚、刑事风险、平台冻结、337调查、商标抢注或侵权诉讼，建议不要只依赖AI初筛，应尽快整理合同、报关单、产品参数、销售记录和对方通知，联系河北知识产权保护中心或专业涉外律师。";
    if (/两用物项|无人机|特种材料|镉|钕|钛合金|石墨/.test(text)) return "判断两用物项不能只看HS编码，还要看元素含量、材料牌号、技术参数、最终用户和最终用途。建议先完成产品参数表，再对照管制清单和许可条件进行专业复核。";
    const source = assistantSourceTitles(text.split(/[，。？?\s]+/).filter(Boolean));
    if (source.length) return `我在本地知识库中找到可能相关的资料：\n${source.map((title) => `· ${title}`).join("\n")}\n\n你可以继续告诉我具体产品、目标国家或争议情况，我会按对应模块给出初筛方向。`;
    return "我可以帮你做初步分诊，但不能替代律师。请补充：产品是什么、出口到哪个国家、目前处于出口/电商/投资/用工哪个阶段，以及是否已经收到投诉、处罚或律师函。";
  }

  function getDeepSeekSettings() {
    const key = sessionStorage.getItem("jqch_deepseek_key") || window.DEEPSEEK_CONFIG?.apiKey || "";
    const model = sessionStorage.getItem("jqch_deepseek_model") || window.DEEPSEEK_CONFIG?.model || "deepseek-chat";
    return { key, model, endpoint: window.DEEPSEEK_CONFIG?.endpoint || "https://api.deepseek.com/chat/completions" };
  }
  function assistantResultContext() {
    return Object.entries(state.results || {}).filter(([module, result]) => result && result.score != null && MODULE_META[module]).map(([module, result]) => `${MODULE_META[module].name}：${result.score}/100，${result.summary}`).join("\n") || "当前尚无模块结果";
  }
  function buildModuleAiPrompt(module) {
    const parts = [];
    if (module === "export") {
      parts.push("产品类别：" + byId("exportType")?.value, "出口市场：" + byId("exportMarket")?.value, "HS/描述：" + byId("exportHs")?.value, "管制排查：" + document.querySelector('input[name="exportScreening"]:checked')?.value, "归类状态：" + document.querySelector('input[name="exportClassification"]:checked')?.value, "出口模式：" + document.querySelector('input[name="exportMode"]:checked')?.value);
    } else if (module === "ip") {
      parts.push("目标市场：" + byId("ipMarket")?.value, "品牌阶段：" + document.querySelector('input[name="ipBrandStage"]:checked')?.value, "FTO状态：" + document.querySelector('input[name="ipFtoStatus"]:checked')?.value);
    } else if (module === "labor") {
      parts.push("用工国家：" + byId("laborMarket")?.value, "用工人数：" + byId("laborWorkers")?.value, "用工模式：" + document.querySelector('input[name="laborMode"]:checked')?.value, "资质状态：" + document.querySelector('input[name="laborQualification"]:checked')?.value, "合同状态：" + document.querySelector('input[name="laborContracts"]:checked')?.value, "工时状态：" + document.querySelector('input[name="laborHours"]:checked')?.value, "社保状态：" + document.querySelector('input[name="laborSocial"]:checked')?.value, "工会状态：" + document.querySelector('input[name="laborUnion"]:checked')?.value);
    } else if (module === "political") {
      parts.push("投资国家：" + byId("politicalMarket")?.value, "控制权：" + document.querySelector('input[name="investmentControl"]:checked')?.value, "资产类型：" + document.querySelector('input[name="assetType"]:checked')?.value, "安全审查：" + document.querySelector('input[name="securityReview"]:checked')?.value, "BIT状态：" + document.querySelector('input[name="bitStatus"]:checked')?.value, "保险状态：" + document.querySelector('input[name="insurance"]:checked')?.value);
    }
    return `请作为${MODULE_META[module].name}的合规顾问，基于以下企业信息先用3个关键问题追问我，再说明我需要准备哪些材料、哪些判断需要律师复核。不要直接下结论。\n${parts.join("；")}`;
  }
  async function getAssistantReply(question, history = []) {
    const config = getDeepSeekSettings();
    const useProxy = config.endpoint.startsWith("/") || config.endpoint.includes(window.location.host);
    if (config.key || useProxy) {
      try {
        let resultContext = "当前尚无模块结果";
        try { resultContext = assistantResultContext(); } catch (contextError) { console.warn("AI 上下文生成失败，已降级为空上下文", contextError); }
        const system = `${window.DEEPSEEK_CONFIG?.systemPrompt || "你是企业出海法律风险助手，不替代律师。"}\n当前页面：${window.__INITIAL_MODULE__ || "home"}\n当前风险结果：\n${resultContext}`;
        const messages = [{ role: "system", content: system }, ...history.slice(-10), { role: "user", content: question }];
        const headers = { "Content-Type": "application/json" }; if (config.key) headers.Authorization = `Bearer ${config.key}`;
        const response = await fetch(config.endpoint, { method: "POST", headers, body: JSON.stringify({ model: config.model, messages, temperature: 0.3, max_tokens: 1000 }) });
        if (!response.ok) throw new Error(`DeepSeek API ${response.status}`);
        const data = await response.json();
        const reply = data.choices?.[0]?.message?.content;
        if (reply) return reply;
        throw new Error("DeepSeek 返回内容为空");
      } catch (error) {
        return `AI 对话暂时不可用：${error.message}。\n\n已切换本地规则助手：\n${localAssistantReply(question)}`;
      }
    }
    return localAssistantReply(question) + "\n\n提示：启动本地服务器并配置 DEEPSEEK_API_KEY，或在右上角 ⚙ 填入 API Key 后可使用真实模型对话。";
  }
  function initAiChat() {
    const toggle = byId("aiChatToggle"); const panel = byId("aiChatPanel"); const close = byId("aiChatClose"); const form = byId("aiChatForm"); const input = byId("aiChatInput"); const messages = byId("aiChatMessages"); const settings = byId("aiChatSettings"); const keyInput = byId("deepseekApiKey"); const modelSelect = byId("deepseekModel"); const saveSettings = byId("saveDeepseekSettings"); const status = byId("aiChatStatus");
    if (!toggle || !panel || !form || !input || !messages) return;
    const history = [];
    const setOpen = (open) => { panel.classList.toggle("open", open); panel.setAttribute("aria-hidden", String(!open)); toggle.setAttribute("aria-expanded", String(open)); if (open) window.setTimeout(() => input.focus(), 0); };
    const append = (role, content) => { const bubble = document.createElement("div"); bubble.className = `ai-msg ${role}`; bubble.textContent = content; messages.appendChild(bubble); messages.scrollTop = messages.scrollHeight; return bubble; };
    const updateStatus = () => { const cfg = getDeepSeekSettings(); const configured = Boolean(cfg.key) || cfg.endpoint.startsWith("/") || cfg.endpoint.includes(window.location.host); if (status) { status.textContent = configured ? `DeepSeek · ${cfg.model}` : "本地规则助手"; status.classList.toggle("is-live", configured); } };
    keyInput.value = sessionStorage.getItem("jqch_deepseek_key") || ""; if (modelSelect) modelSelect.value = sessionStorage.getItem("jqch_deepseek_model") || "deepseek-chat"; updateStatus();
    byId("aiChatSettingsToggle")?.addEventListener("click", () => { settings.hidden = !settings.hidden; });
    saveSettings?.addEventListener("click", () => { sessionStorage.setItem("jqch_deepseek_key", keyInput.value.trim()); sessionStorage.setItem("jqch_deepseek_model", modelSelect.value); settings.hidden = true; updateStatus(); append("assistant", (keyInput.value.trim() || getDeepSeekSettings().endpoint.startsWith("/")) ? "DeepSeek 已连接，可以开始对话。" : "已清除 DeepSeek 密钥，将使用本地规则助手。"); });
    toggle.addEventListener("click", () => setOpen(!panel.classList.contains("open")));
    close?.addEventListener("click", () => setOpen(false));
    document.querySelectorAll("[data-ai-prompt]").forEach((button) => button.addEventListener("click", () => { input.value = button.dataset.aiPrompt; form.requestSubmit(); }));
    document.addEventListener("click", (event) => { const button = event.target.closest("[data-ai-context]"); if (button) { setOpen(true); input.value = buildModuleAiPrompt(button.dataset.aiContext); form.requestSubmit(); } });
    window.__openAssistantPrompt = (text) => { setOpen(true); input.value = text; form.requestSubmit(); };
    form.addEventListener("submit", async (event) => {
      event.preventDefault(); const question = input.value.trim(); if (!question) return;
      append("user", question); input.value = ""; history.push({ role: "user", content: question });
      const loading = append("assistant", "DeepSeek 正在思考…");
      const reply = await getAssistantReply(question, history.slice(0, -1)); loading.textContent = reply; history.push({ role: "assistant", content: reply }); messages.scrollTop = messages.scrollHeight;
    });
    document.addEventListener("keydown", (event) => { if (event.key === "Escape" && panel.classList.contains("open")) setOpen(false); });
  }

  function updateLaborMarketHint() {
    const el = byId("laborMarketHint");
    if (!el) return;
    const market = byId("laborMarket")?.value;
    const hints = {
      saudi: "⚠️ 沙特市场提示：沙特实施Nitaqat本地化用工制度，需按行业和规模配置沙特籍员工，并确保其社保状态有效。",
      eu: "⚠️ 欧盟市场提示：欧盟禁止强迫劳动产品规则和供应链尽调要求可能带来海关扣押、客户审查和工时合规压力。",
      us: "⚠️ 美国市场提示：需关注工时记录、平等就业、反歧视、工会权利和供应链劳工审查。",
      uk: "⚠️ 英国市场提示：需核实解雇保护、工会承认、最低工资和工时记录要求。",
      mexico: "⚠️ 墨西哥市场提示：加班上限、工会协商和利润分享制度敏感，超时用工可能触发停工和集体争议。",
      brazil: "⚠️ 巴西市场提示：社保负担、工会集体协议和劳动监察力度较高，需做好工资社保和外包合规。",
      sea: "⚠️ 东南亚市场提示：各国劳动法差异较大，需逐国核查最低工资、加班上限、社保和工会制度。",
      other: "请进一步确认目标国劳动基准、社保、工会和签证要求。"
    };
    el.innerHTML = `<span>${escapeHtml(hints[market] || hints.other)}</span>`;
  }

  function updateLaborFollowup() {
    const el = byId("laborFollowup");
    if (!el) return;
    const mode = document.querySelector('input[name="laborMode"]:checked')?.value;
    const qualification = document.querySelector('input[name="laborQualification"]:checked')?.value;
    const contracts = document.querySelector('input[name="laborContracts"]:checked')?.value;
    const hours = document.querySelector('input[name="laborHours"]:checked')?.value;
    const social = document.querySelector('input[name="laborSocial"]:checked')?.value;
    const union = document.querySelector('input[name="laborUnion"]:checked')?.value;
    const questions = [];
    if (mode === "local") questions.push("当地实体是否已为员工缴纳法定社保？是否核验最低工资、工时上限和解雇保护？");
    if (mode === "dispatch") questions.push("是否已取得对外劳务合作经营资格、完成外派备案并向使领馆报告？");
    if (mode === "mixed") questions.push("外派员工与本地员工的薪酬、工时和解雇条件是否存在双轨制？");
    if (mode === "outsourcing") questions.push("外包商是否具备合法资质？实际劳动管理权是否仍由本企业控制？");
    if (qualification === "partial" || qualification === "none") questions.push("外派备案、风险处置备用金和使领馆报告分别完成到哪一步？");
    if (contracts !== "full") questions.push("目前缺少哪些合同？外文证据是否完成公证、认证和翻译？");
    if (hours === "domestic" || hours === "noRecord") questions.push("加班上限、休息休假和加班工资是否按目标国标准执行？是否有考勤记录？");
    if (social !== "full") questions.push("工资、个税、社保和福利是否存在差额？是否已建立当地可查询记录？");
    if (union === "unknown" || union === "dispute") questions.push("目标国工会是否拥有集体谈判权或罢工权？是否已发生投诉或协商争议？");
    if (!questions.length) questions.push("请补充目标国、用工模式、合同、工时、社保和工会情况。");
    el.innerHTML = `<div class="followup-question"><span>AI 追问</span><ul>${questions.map((q) => `<li>${escapeHtml(q)}</li>`).join("")}</ul><small>发生劳动监察、工会争议或人员伤亡时，请立即联系专业劳动法律师。</small></div><button class="inline-link ai-followup-btn" type="button" data-ai-context="labor">让 DeepSeek 继续追问</button>`;
  }

  function initLaborAssistant() {
    const form = byId("laborForm");
    const market = byId("laborMarket");
    if (market) market.addEventListener("change", () => { updateLaborMarketHint(); updateLaborFollowup(); });
    if (form) { form.addEventListener("change", updateLaborFollowup); form.addEventListener("input", updateLaborFollowup); }
    updateLaborMarketHint();
    updateLaborFollowup();
  }

  function updatePoliticalMarketHint() {
    const el = byId("politicalMarketHint"); if (!el) return;
    const market = byId("politicalMarket")?.value;
    const hints = { uk: "⚠️ 英国市场提示：英国对外资审查和战略产业干预趋严，钢铁等关键产业可能触发追溯性措施。", eu: "⚠️ 欧盟市场提示：需同时评估成员国外资审查和欧盟层面的补贴、反垄断与供应链规则。", us: "⚠️ 美国市场提示：CFIUS、出口管制和制裁规则可能叠加适用。", turkey: "⚠️ 土耳其市场提示：关注投资准入、外汇管制和本地化要求。", latam: "⚠️ 拉美市场提示：资源民族主义、特许权使用费和国有持股政策可能变化。", sea: "⚠️ 东南亚市场提示：逐国核查外资准入、土地法和国家安全审查。", other: "请进一步确认目标国投资准入、安全审查和BIT状态。" };
    el.innerHTML = `<span>${escapeHtml(hints[market] || hints.other)}</span>`;
  }
  function updatePoliticalFollowup() {
    const el = byId("politicalFollowup"); if (!el) return;
    const asset = document.querySelector('input[name="assetType"]:checked')?.value;
    const control = document.querySelector('input[name="investmentControl"]:checked')?.value;
    const review = document.querySelector('input[name="securityReview"]:checked')?.value;
    const bit = document.querySelector('input[name="bitStatus"]:checked')?.value;
    const insurance = document.querySelector('input[name="insurance"]:checked')?.value;
    const q = [];
    if (asset === "factory") q.push("目标国是否将该行业列为关键产业？是否涉及钢铁产能、能源或关键供应链？");
    if (asset === "resource") q.push("是否涉及特许权、资源税、国有持股或本地化要求？");
    if (asset === "tech") q.push("是否涉及数据、核心算法、敏感技术或关键技术访问权？");
    if (asset === "ma") q.push("是否涉及控制权变更、反垄断申报、劳工承接或既有债务？");
    if (control === "influence") q.push("少数股权是否包含否决权、董事席位或核心技术访问权？");
    if (review === "uncertain") q.push("是否已对照目标国强制申报清单评估行业、持股比例和控制权？");
    if (review === "completed") q.push("交易何时完成？是否具备追溯申报或补救条件？");
    if (bit === "unknown") q.push("目标国与中国BIT是否包含ICSID仲裁同意条款？是否存在岔路口条款？");
    if (insurance === "none" || insurance === "intended") q.push("是否评估中国信保海外投资保险或MIGA的征收、汇兑和战争风险覆盖？");
    if (!q.length) q.push("请补充投资结构、资产类型、控制权和目标国审查情况。");
    el.innerHTML = `<div class="followup-question"><span>AI 追问</span><ul>${q.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul><small>涉及征收、国有化或安全审查追溯时，请立即启动专业律师和BIT救济评估。</small></div><button class="inline-link ai-followup-btn" type="button" data-ai-context="political">让 DeepSeek 继续追问</button>`;
  }
  function initPoliticalAssistant() {
    const form = byId("politicalForm"); const market = byId("politicalMarket");
    if (market) market.addEventListener("change", () => { updatePoliticalMarketHint(); updatePoliticalFollowup(); });
    if (form) { form.addEventListener("change", updatePoliticalFollowup); form.addEventListener("input", updatePoliticalFollowup); }
    updatePoliticalMarketHint(); updatePoliticalFollowup();
  }

  function filteredSources() {
    const query = state.kbSearch.trim().toLowerCase();
    return (window.KNOWLEDGE?.sources || []).filter((item) => {
      if (state.kbFilter !== "all" && item.module !== state.kbFilter) return false;
      if (state.kbType !== "all" && item.type !== state.kbType) return false;
      if (!query) return true;
      return [item.title, item.summary, item.category, item.jurisdiction, item.type, ...(item.tags || []), ...(item.keyPoints || [])].join(" ").toLowerCase().includes(query);
    });
  }
  function renderKnowledge() {
    const list = byId("knowledgeList");
    if (!list) return;
    const items = filteredSources();
    const count = byId("kbVisibleCount");
    if (count) count.textContent = items.length;
    if (!items.length) { list.innerHTML = '<div class="no-results">没有匹配的资料，请更换关键词或筛选条件。</div>'; return; }
    list.innerHTML = items.map((item) => {
      const meta = MODULE_META[item.module] || { short: item.module };
      const color = (window.KNOWLEDGE.modules[item.module] || {}).color || "#1f6feb";
      return `<article class="kb-card"><div class="kb-top"><span class="kb-type">${escapeHtml(item.type)}</span><span class="kb-module" style="color:${color}">${escapeHtml(meta.short)}</span></div><h3>${escapeHtml(item.title)}</h3><p>${escapeHtml(item.summary)}</p><div class="tags">${(item.tags || []).slice(0, 4).map((tag) => `<span class="tag">${escapeHtml(tag)}</span>`).join("")}</div><div class="kb-actions"><button class="btn tiny primary" type="button" data-kb-open="${escapeHtml(item.id)}">查看简介</button><button class="btn tiny" type="button" data-kb-file="${escapeHtml(item.id)}">打开原文</button></div></article>`;
    }).join("");
  }
  function openKnowledge(id) {
    const item = sourceById(id);
    if (!item) return;
    const keyPoints = `<div class="result-section"><h4>关键规则</h4>${(item.keyPoints || []).map((text) => `<div class="finding"><i class="dot"></i><span>${escapeHtml(text)}</span></div>`).join("")}</div>`;
    if (item.type === "PDF") {
      const body = `<iframe class="pdf-frame" src="${encodeURI(item.path)}" title="${escapeHtml(item.title)}"></iframe>${keyPoints}`;
      openModal(item.title, `${item.category} · ${item.jurisdiction} · PDF`, [{ label: "新窗口打开", primary: true, handler: () => openFile(item.path) }, { label: "下载原文", handler: () => downloadFile(item.path) }], body);
    } else {
      const body = `<div class="notice">DOCX 原文可在 Word 或 WPS 中打开；网站同时保留纯文本摘录，便于全文检索。</div>${keyPoints}<div class="result-section"><h4>资料摘要</h4><div class="finding"><i class="dot"></i><span>${escapeHtml(item.summary)}</span></div></div>`;
      openModal(item.title, `${item.category} · ${item.jurisdiction} · DOCX`, [{ label: "打开DOCX原文", primary: true, handler: () => openFile(item.path) }, { label: "打开文本摘录", handler: () => item.excerptFile ? openFile(item.excerptFile) : showToast("未找到文本摘录") }], body);
    }
  }
  function reportBlockHtml(module) {
    const meta = MODULE_META[module]; const result = state.results[module];
    if (!result) return `<div class="report-block"><h3>${escapeHtml(meta.name)}</h3><p><b>状态：</b>尚未运行模块诊断。</p></div>`;
    return `<div class="report-block"><h3>${escapeHtml(meta.name)} <small>${levelInfo(result.score).label}</small></h3><p><b>风险指数：</b>${clamp(result.score)} / 100</p><p>${escapeHtml(result.summary)}</p><h4>主要发现</h4><ul>${result.findings.slice(0, 4).map((text) => `<li>${escapeHtml(text)}</li>`).join("")}</ul><h4>建议行动</h4><ul>${result.actions.slice(0, 5).map((text) => `<li>${escapeHtml(text)}</li>`).join("")}</ul></div>`;
  }
  function buildReportHtml() {
    const keys = ["export", "ip", "labor", "political"];
    const available = keys.map((key) => state.results[key] ? state.results[key].score : null).filter((value) => value != null);
    const max = available.length ? Math.max(...available) : null;
    const priority = max == null ? "尚未完成模块诊断" : keys.filter((key) => state.results[key]?.score === max).map((key) => MODULE_META[key].name).join("、");
    return `<div class="report-doc"><h1>河北企业出海法律风险初筛报告</h1><p class="report-meta">生成时间：${new Date().toLocaleString("zh-CN")} · 数据范围：${window.KNOWLEDGE.sourceCount} 份法规与案例资料</p><p><b>建议优先关注：</b>${escapeHtml(priority)}</p><div class="report-grid">${keys.map(reportBlockHtml).join("")}</div><div class="report-footer">本工具为初筛原型，输出结果不替代专业法律意见。正式交易、行政调查、诉讼或仲裁前应咨询专业律师。</div></div>`;
  }
  function downloadReport() {
    const html = `<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><title>河北企业出海法律风险初筛报告</title><style>body{font-family:'Space Grotesk','Microsoft YaHei',sans-serif;background:oklch(18% .035 255);color:oklch(96% .008 250);max-width:1000px;margin:30px auto;padding:0 24px;line-height:1.65}.report-grid{display:grid;grid-template-columns:1fr 1fr;gap:14px}.report-block{border:1px solid oklch(36% .04 255);border-radius:6px;padding:14px;break-inside:avoid}li,p{font-size:12px}@media print{.report-grid{grid-template-columns:1fr 1fr}}</style></head><body>${buildReportHtml()}</body></html>`;
    const blob = new Blob([html], { type: "text/html;charset=utf-8" }); const url = URL.createObjectURL(blob); const anchor = document.createElement("a"); anchor.href = url; anchor.download = `河北企业出海法律风险初筛报告-${new Date().toISOString().slice(0, 10)}.html`; document.body.appendChild(anchor); anchor.click(); anchor.remove(); window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  function openReport() {
    const hasResult = Object.keys(state.results).some((key) => state.results[key]);
    openModal("河北企业出海法律风险初筛报告", hasResult ? "报告已汇总当前四个模块的最近诊断结果" : "尚未运行模块诊断，报告将显示待评估状态", [{ label: "打印 / 另存为PDF", primary: true, handler: () => window.print() }, { label: "下载HTML报告", handler: downloadReport }], buildReportHtml());
  }

  const INDUSTRY_GROUPS = [
    { group: "钢铁与金属制品", items: [
      { id: "steel-smelting", label: "钢铁冶炼及加工", cluster: "唐山钢铁、邯郸钢铁", base: "steel", risks: ["反倾销/反补贴", "碳关税（CBAM）", "两用物项出口管制"] },
      { id: "metal-products", label: "金属制品", cluster: "永年紧固件、安平丝网", base: "steel", risks: ["欧盟反倾销", "知识产权侵权", "原产地规则"] }
    ]},
    { group: "装备制造", items: [
      { id: "auto-parts", label: "汽车及零部件", cluster: "保定汽车及零部件", base: "equipment", risks: ["出口管制", "知识产权", "外资审查", "产品认证（CE/EPA）"] },
      { id: "bicycle", label: "自行车/童车", cluster: "平乡自行车（童车）", base: "equipment", risks: ["反倾销", "产品安全标准", "知识产权"] },
      { id: "intelligent-equipment", label: "智能装备", cluster: "唐山智能特种机器人", base: "equipment", risks: ["出口管制", "数据安全", "知识产权"] },
      { id: "rail-equipment", label: "其他装备", cluster: "轨道交通装备（中车唐山）", base: "equipment", risks: ["出口管制", "国际标准认证", "知识产权"] }
    ]},
    { group: "纺织服装与轻工消费品", items: [
      { id: "textile-apparel", label: "纺织服装", cluster: "高阳毛巾、晋州纺织", base: "textile", risks: ["跨境电商平台合规", "劳工标准", "化学品法规（REACH）"] },
      { id: "bags-fur", label: "箱包皮草", cluster: "白沟箱包、辛集/肃宁皮草", base: "textile", risks: ["知识产权", "环保法规", "标签合规", "动物福利"] },
      { id: "home-consumer", label: "家居消费品", cluster: "霸州家具、正定板材家具", base: "textile", risks: ["知识产权", "产品认证（FSC）", "跨境电商合规"] }
    ]},
    { group: "化工与医药", items: [
      { id: "chemicals", label: "化工产品", cluster: "元氏精细化工、河间电线电缆", base: "agri", risks: ["REACH法规", "危险化学品运输", "知识产权", "数据跨境"] },
      { id: "pharma", label: "医药健康", cluster: "石家庄医药", base: "agri", risks: ["FDA/EMA认证", "数据跨境", "专利纠纷", "临床试验合规"] }
    ]},
    { group: "新能源与“新三样”", items: [
      { id: "ev", label: "电动汽车", cluster: "保定/邢台新能源车企", base: "equipment", risks: ["反倾销", "碳足迹核算", "关键矿物管制", "数据安全"] },
      { id: "battery", label: "锂离子蓄电池", cluster: "唐山国轩电池、沧州远景动力", base: "equipment", risks: ["供应链尽职调查", "碳关税", "危险品运输法规"] },
      { id: "solar", label: "光伏产品", cluster: "宁晋光伏、张北风光储", base: "equipment", risks: ["反倾销", "碳关税", "产品认证", "供应链合规"] }
    ]},
    { group: "农食产品", items: [
      { id: "food-agri", label: "食品及农产品", cluster: "泊头鲜梨、沽源藜麦", base: "agri", risks: ["检验检疫标准", "农药残留限量", "原产地认证", "动植物检疫"] },
      { id: "pet-food", label: "宠物食品", cluster: "南和宠粮", base: "agri", risks: ["检验检疫", "标签合规", "跨境电商平台规则"] }
    ]},
    { group: "服务贸易与其他", items: [
      { id: "services", label: "服务贸易", cluster: "文化、旅游、软件设计", base: "services", risks: ["数据跨境", "知识产权", "服务贸易壁垒"] },
      { id: "other-industry", label: "其他行业", cluster: "自定义输入", base: "other", risks: ["根据具体业务动态评估"] }
    ]}
  ];
  const INDUSTRY_BY_ID = Object.fromEntries(INDUSTRY_GROUPS.flatMap((group) => group.items.map((item) => [item.id, item])));

  const MARKET_GROUPS = [
    { group: "欧洲", items: [
      { id: "de", label: "德国", value: "eu" }, { id: "fr", label: "法国", value: "eu" }, { id: "it", label: "意大利", value: "eu" },
      { id: "nl", label: "荷兰", value: "eu" }, { id: "be", label: "比利时", value: "eu" }, { id: "hu", label: "匈牙利", value: "eu" },
      { id: "gr", label: "希腊", value: "eu" }, { id: "uk", label: "英国", value: "uk" }, { id: "ru", label: "俄罗斯", value: "other" },
      { id: "tr", label: "土耳其", value: "turkey" }, { id: "eu-other", label: "其他欧洲国家", value: "other" }
    ]},
    { group: "亚洲", items: [
      { id: "vn", label: "越南", value: "sea" }, { id: "id", label: "印度尼西亚", value: "sea" }, { id: "th", label: "泰国", value: "sea" },
      { id: "my", label: "马来西亚", value: "sea" }, { id: "sg", label: "新加坡", value: "sea" }, { id: "ph", label: "菲律宾", value: "sea" },
      { id: "sa", label: "沙特阿拉伯", value: "other" }, { id: "ae", label: "阿联酋", value: "other" }, { id: "kz", label: "哈萨克斯坦", value: "other" },
      { id: "uz", label: "乌兹别克斯坦", value: "other" }, { id: "jp", label: "日本", value: "other" }, { id: "kr", label: "韩国", value: "other" }, { id: "in", label: "印度", value: "other" }
    ]},
    { group: "美洲", items: [
      { id: "us", label: "美国", value: "us" }, { id: "ca", label: "加拿大", value: "us" }, { id: "mx", label: "墨西哥", value: "mexico" },
      { id: "br", label: "巴西", value: "brazil" }, { id: "latam-other", label: "其他拉美国家", value: "latam" }
    ]},
    { group: "非洲", items: [{ id: "za", label: "南非", value: "other" }, { id: "ng", label: "尼日利亚", value: "other" }, { id: "ke", label: "肯尼亚", value: "other" }]},
    { group: "大洋洲", items: [{ id: "au", label: "澳大利亚", value: "other" }, { id: "nz", label: "新西兰", value: "other" }]}
  ];

  const ACTIVITY_GROUPS = [
    { group: "传统贸易类", items: [
      { id: "b2b", label: "一般B2B货物出口", value: "export" }, { id: "market-procurement", label: "市场采购贸易（1039）", value: "export" },
      { id: "commodity-trade", label: "大宗商品/资源类贸易", value: "export" }
    ]},
    { group: "跨境零售类", items: [
      { id: "platform-ecommerce", label: "平台跨境电商（亚马逊/TikTok/Temu）", value: "ecommerce" },
      { id: "dtc", label: "独立站（DTC）", value: "ecommerce" }, { id: "overseas-warehouse", label: "跨境电商 + 海外仓", value: "ecommerce" }
    ]},
    { group: "海外投资类", items: [
      { id: "greenfield", label: "海外绿地投资建厂", value: "investment" }, { id: "ma", label: "海外并购（M&A）", value: "investment" },
      { id: "jv", label: "海外合资/合作（JV）", value: "investment" }
    ]},
    { group: "工程与劳务类", items: [
      { id: "epc", label: "对外承包工程（EPC）", value: "investment" }, { id: "labor-dispatch", label: "对外劳务合作/外派员工", value: "labor" },
      { id: "eor", label: "海外本地化雇佣（EOR）", value: "labor" }
    ]},
    { group: "服务与技术类", items: [
      { id: "tech-export", label: "技术出口/软件服务", value: "export" }, { id: "licensing", label: "品牌授权/特许经营", value: "ecommerce" }
    ]}
  ];

  function riskModuleLabel(risk) {
    const text = risk || "";
    if (/出口管制|关税|反倾销|反补贴|海关|原产地|碳关税|CBAM|危险品/.test(text)) return "出口管制";
    if (/知识产权|专利|商标/.test(text)) return "知识产权";
    if (/劳工|用工|劳务|社保|劳动争议|EOR/.test(text)) return "跨境用工";
    if (/外资审查|国家安全|数据安全|数据跨境|临床试验/.test(text)) return "政治与投资";
    return "待开发";
  }

  function initProfileControls() {
    const select = byId("profileIndustry");
    if (select) {
      select.innerHTML = INDUSTRY_GROUPS.map((group) => `<optgroup label="${escapeHtml(group.group)}">${group.items.map((item) => `<option value="${item.id}">${escapeHtml(item.label)}</option>`).join("")}</optgroup>`).join("");
      select.value = "steel-smelting";
      select.addEventListener("change", updateIndustryHint);
    }
    const market = byId("marketPicker");
    if (market) {
      const shortcuts = [
        { label: "欧盟成员国", region: "europe" },
        { label: "美国", region: "americas" },
        { label: "东南亚", region: "asia" },
        { label: "中东", region: "asia" },
        { label: "拉美", region: "americas" },
        { label: "非洲", region: "africa" },
        { label: "中亚", region: "asia" }
      ];
      market.innerHTML = `<div class="market-shortcuts">${shortcuts.map((item) => `<button type="button" class="filter-btn" data-market-shortcut="${item.region}">${item.label}</button>`).join("")}</div><input id="marketSearch" type="search" placeholder="搜索国家或地区…" /><p class="market-graph-note">欧盟是超国家组织，已拆分到成员国；区域选项仅生成区域概览，选择具体国家后才会进入高精度评估。</p><div class="market-groups">${MARKET_GROUPS.map((group) => `<section class="market-group" data-region="${group.region}"><b>${group.group}</b>${group.regionOnly ? `<label class="market-chip market-region-overview"><input type="checkbox" name="quickMarket" value="${group.regionOnly.value}" data-region-only="true" />${group.regionOnly.label}</label>` : ""}<div class="market-chips">${group.items.map((item) => `<label class="market-chip"><input type="checkbox" name="quickMarket" value="${item.value}" data-market-id="${item.id}" />${item.label}</label>`).join("")}</div></section>`).join("")}</div>`;
      market.querySelectorAll("[data-market-shortcut]").forEach((button) => button.addEventListener("click", () => {
        market.querySelectorAll("[data-market-shortcut]").forEach((item) => item.classList.toggle("active", item === button));
        const region = button.dataset.marketShortcut;
        market.querySelectorAll(".market-group").forEach((group) => { group.hidden = group.dataset.region !== region; });
      }));
      market.addEventListener("change", updateProfileFollowups);
      const search = market.querySelector("#marketSearch");
      if (search) search.addEventListener("input", () => {
        const q = search.value.trim().toLowerCase();
        market.querySelectorAll(".market-group").forEach((group) => {
          let visible = 0;
          group.querySelectorAll(".market-chip").forEach((chip) => { const show = !q || chip.textContent.toLowerCase().includes(q); chip.hidden = !show; if (show) visible += 1; });
          group.hidden = visible === 0;
        });
      });
    }
    const activity = byId("activityPicker");
    if (activity) {
      activity.innerHTML = `<button type="button" class="multi-select-trigger" id="activityTrigger" aria-expanded="false"><span id="activitySelectedLabel">请选择出海业务形式</span><span class="multi-select-chevron" aria-hidden="true">⌄</span></button><div class="multi-select-menu" id="activityMenu">${ACTIVITY_GROUPS.map((group) => `<section class="activity-group"><b>${escapeHtml(group.group)}</b><div class="activity-options">${group.items.map((item) => `<label class="activity-option"><input type="checkbox" name="quickActivity" value="${item.value}" data-activity-id="${item.id}" />${escapeHtml(item.label)}</label>`).join("")}</div></section>`).join("")}</div>`;
      const trigger = activity.querySelector("#activityTrigger");
      trigger.addEventListener("click", () => {
        const open = activity.classList.toggle("is-open");
        trigger.setAttribute("aria-expanded", String(open));
      });
      activity.addEventListener("change", () => {
        const checked = [...activity.querySelectorAll('input[name="quickActivity"]:checked')];
        const label = activity.querySelector("#activitySelectedLabel");
        if (label) label.textContent = checked.length ? `已选 ${checked.length} 项：${checked.slice(0, 2).map((item) => item.parentElement.textContent.trim()).join("、")}${checked.length > 2 ? "…" : ""}` : "请选择出海业务形式";
        updateProfileFollowups();
      });
      document.addEventListener("click", (event) => {
        if (!activity.contains(event.target)) { activity.classList.remove("is-open"); trigger.setAttribute("aria-expanded", "false"); }
      });
    }
    updateIndustryHint();
    updateProfileFollowups();
  }

  function updateIndustryHint() {
    const el = byId("industryHint");
    const item = INDUSTRY_BY_ID[byId("profileIndustry")?.value] || INDUSTRY_BY_ID["other-industry"];
    if (!el || !item) return;
    el.innerHTML = `<div class="industry-cluster">河北产业举例：${escapeHtml(item.cluster)}</div><div class="risk-tags">${item.risks.map((risk) => { const module = riskModuleLabel(risk); const supported = module !== "待开发"; return `<span class="risk-tag ${supported ? "is-supported" : "is-muted"}">${escapeHtml(risk)}<small>${supported ? "可检测 · " + module : "待开发"}</small></span>`; }).join("")}</div>`;
  }

  function updateProfileFollowups() {
    const selectedMarkets = [...document.querySelectorAll('input[name="quickMarket"]:checked')];
    const regionOnly = selectedMarkets.filter((item) => item.dataset.regionOnly === "true");
    const specificMarkets = selectedMarkets.filter((item) => item.dataset.regionOnly !== "true");
    const marketEl = byId("marketFollowup");
    if (marketEl) {
      if (!selectedMarkets.length) marketEl.innerHTML = "";
      else if (regionOnly.length) {
        const labels = regionOnly.map((item) => item.parentElement.textContent.trim()).join("、");
        marketEl.innerHTML = `<div class="followup-question"><span>AI 追问</span><p>您选择了“${escapeHtml(labels)}”。欧盟是超国家组织，东南亚、中东、中亚、拉美和非洲也不是单一主权法域，请继续选择具体国家或欧盟成员国。</p><small>当前选择只能生成区域概览，暂不进入高精度报告</small></div>`;
      } else {
        marketEl.innerHTML = `<div class="followup-question"><span>AI 追问</span><p>已选择 ${specificMarkets.length} 个具体法域。系统将匹配区域组织通用规则与对应成员国/国家国内法；如需高精度结果，请继续补充产品、HS或业务细节。</p><small>法域完整性：已具体到国家</small></div>`;
      }
    }
    const activityEl = byId("activityFollowup");
    const selectedActivityInputs = [...document.querySelectorAll('input[name="quickActivity"]:checked')];
    if (!activityEl) return;
    if (!selectedActivityInputs.length) { activityEl.innerHTML = ""; return; }
    const bases = new Set(selectedActivityInputs.map((item) => item.value));
    const radios = (name, legend, options) => `<fieldset class="followup-fieldset"><legend>${legend}</legend><div class="followup-options">${options.map(([value, label]) => `<label class="followup-option"><input type="radio" name="${name}" value="${value}" />${label}</label>`).join("")}</div></fieldset>`;
    const questions = [];
    if (bases.has("ecommerce")) questions.push(radios("ecommercePlatform", "您的目标平台是？", [["amazon","亚马逊"],["dtc","独立站"],["tiktok","TikTok Shop"],["other","其他"]]));
    if (bases.has("investment")) questions.push(radios("investmentForm", "投资形式是？", [["greenfield","绿地投资"],["ma","并购"],["jv","合资"]]), radios("investmentSensitive", "是否涉及钢铁、能源等敏感行业？", [["yes","是"],["no","否"]]));
    if (bases.has("export")) questions.push(radios("dualUse", "是否涉及两用物项（如无人机、特种材料）？", [["yes","是"],["no","否"]]), radios("tradeTerms", "贸易方式是？", [["fob","FOB"],["cif","CIF"],["other","其他"]]));
    if (bases.has("labor")) questions.push(radios("workerScale", "人员规模？", [["under10","少于10人"],["10to100","10–100人"],["over100","100人以上"]]), radios("localEntity", "是否计划设立当地实体？", [["yes","是"],["no","否"]]));
    activityEl.innerHTML = `<div class="followup-question"><span>AI 追问</span><p>已识别多类出海业务，风险将叠加评估。请补充以下关键信息。</p><small>可跨类多选 · 当前已选 ${selectedActivityInputs.length} 项</small></div>${questions.join("")}`;
  }

  function runQuickProfile(event) {
    if (event) event.preventDefault();
    const regionOnlySelected = [...document.querySelectorAll('input[name="quickMarket"][data-region-only="true"]:checked')];
    const isRegionOverview = regionOnlySelected.length > 0;
    if (isRegionOverview && !state.regionOverviewConfirmed) {
      const labels = regionOnlySelected.map((item) => item.parentElement.textContent.trim()).join('、');
      openModal('法域完整性校验', '请确认评估精度', [
        { label: '返回选择具体国家', handler: closeModal },
        { label: '继续生成区域概览', primary: true, handler: () => { closeModal(); state.regionOverviewConfirmed = true; byId('profileForm').requestSubmit(); } }
      ], '<div class="notice">您选择了“' + escapeHtml(labels) + '”。欧盟是超国家组织，其他区域也不是单一主权法域。当前未指定具体国家或成员国，将只生成区域概览；具体风险需指定国家后重新评估。</div>');
      return;
    }
    const regionOverview = isRegionOverview;
    state.regionOverviewConfirmed = false;
    const scores = { export: 8, ip: 8, labor: 8, political: 8 };
    const industryId = byId("profileIndustry").value;
    const industry = INDUSTRY_BY_ID[industryId]?.base || "other";
    const markets = [...new Set([...document.querySelectorAll('input[name="quickMarket"]:checked')].map((el) => el.value))];
    const activities = [...new Set([...document.querySelectorAll('input[name="quickActivity"]:checked')].map((el) => el.value))];
    const industryRules = {
      steel: { export: 40, political: 12, labor: 4, ip: 4 }, equipment: { export: 18, ip: 32, labor: 12, political: 8 },
      textile: { export: 10, ip: 40, labor: 8, political: 5 }, agri: { export: 32, ip: 15, labor: 7, political: 8 },
      services: { export: 4, ip: 8, labor: 34, political: 10 }, other: { export: 12, ip: 12, labor: 12, political: 12 }
    };
    Object.entries(industryRules[industry] || industryRules.other).forEach(([key, value]) => scores[key] += value);
    markets.forEach((market) => {
      if (market === "eu") { scores.export += 14; scores.ip += 16; scores.labor += 16; scores.political += 18; }
      if (market === "us") { scores.export += 12; scores.ip += 18; scores.labor += 14; scores.political += 16; }
      if (market === "uk") { scores.export += 7; scores.ip += 13; scores.labor += 12; scores.political += 22; }
      if (market === "turkey") { scores.ip += 30; scores.export += 7; scores.political += 12; }
      if (market === "latam" || market === "mexico" || market === "brazil") { scores.labor += 30; scores.political += 15; scores.export += 8; }
      if (market === "sea") { scores.export += 12; scores.ip += 13; scores.labor += 16; scores.political += 10; }
    });
    activities.forEach((activity) => {
      if (activity === "export") scores.export += 34;
      if (activity === "ecommerce") { scores.ip += 32; scores.export += 10; scores.labor += 8; }
      if (activity === "investment") { scores.political += 40; scores.labor += 12; scores.ip += 8; }
      if (activity === "labor") { scores.labor += 38; scores.political += 8; }
    });
    Object.keys(scores).forEach((key) => scores[key] = clamp(scores[key]));
    state.quick = { scores, industry, markets, activities, regionOverview, generatedAt: new Date().toISOString() };
    const ranked = Object.entries(scores).sort((a, b) => b[1] - a[1]);
    const rows = ranked.map(([key, value], index) => `<div class="action-item"><i class="dot"></i><div style="flex:1"><div style="display:flex;align-items:center;justify-content:space-between;gap:8px"><strong>${index + 1}. ${escapeHtml(MODULE_META[key].name)}</strong><span>${value}分 · ${levelInfo(value).label}</span></div><div class="risk-meter" style="margin:7px 0 0"><span style="transform:scaleX(${value / 100})"></span></div></div></div>`).join("");
    byId("quickResult").innerHTML = `${regionOverview ? `<div class="followup-question"><span>区域概览模式</span><p>本次未具体到国家或欧盟成员国，仅提供区域层面的风险优先级。指定具体国家后可重新生成高精度结果。</p></div>` : ""}<div class="result-section"><h4>建议优先处理顺序</h4>${rows}</div><div class="split-note"><span>已为您生成优先级，请点击进入对应模块。</span><a href="#module-${ranked[0][0]}">进入模块 →</a></div>`;
  }

  function recommendedCaseMeta() {
    const industrySelect = byId("profileIndustry");
    const industry = INDUSTRY_BY_ID[industrySelect?.value] || INDUSTRY_BY_ID["steel-smelting"];
    const market = document.querySelector('input[name="quickMarket"]:checked[data-market-id]:not([data-region-only="true"])');
    const marketLabel = market ? market.parentElement.textContent.trim() : "";
    if (!market) return { label: "体验典型河北出海案例", industry: "steel-smelting", marketId: "de", activity: "b2b" };
    if (industry.base === "steel" && market.value === "eu") return { label: "载入河北钢铁出口欧盟案例", industry: "steel-smelting", marketId: market.dataset.marketId, activity: "b2b" };
    if (industry.base === "textile" && market.value === "us") return { label: "载入高阳毛巾出海美国案例", industry: "textile-apparel", marketId: "us", activity: "platform-ecommerce" };
    return { label: `载入${industry.label}出海${marketLabel}案例`, industry: industry.id, marketId: market.dataset.marketId, activity: "b2b" };
  }
  function updateRecommendedCaseLink() {
    const link = byId("loadRecommendedCase");
    if (link) link.textContent = `＋ ${recommendedCaseMeta().label}`;
  }
  function setValue(id, value) { const el = byId(id); if (el) el.value = value; }
  function setChecked(id, value) { const el = byId(id); if (el) el.checked = Boolean(value); }
  function setRadio(name, value) { document.querySelectorAll(`input[name="${name}"]`).forEach((el) => { el.checked = el.value === value; }); }
  function submitForm(id) { const form = byId(id); if (form) form.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true })); }
  function loadRecommendedCase() {
    const meta = recommendedCaseMeta();
    const industrySelect = byId("profileIndustry");
    if (industrySelect) { industrySelect.value = meta.industry; industrySelect.dispatchEvent(new Event("change", { bubbles: true })); }
    document.querySelectorAll('input[name="quickMarket"]').forEach((item) => { item.checked = false; });
    const market = document.querySelector(`input[name="quickMarket"][data-market-id="${meta.marketId}"]`);
    if (market) { market.checked = true; market.dispatchEvent(new Event("change", { bubbles: true })); }
    document.querySelectorAll('input[name="quickActivity"]').forEach((item) => { item.checked = false; });
    const activity = document.querySelector(`input[name="quickActivity"][data-activity-id="${meta.activity}"]`);
    if (activity) { activity.checked = true; activity.dispatchEvent(new Event("change", { bubbles: true })); }
    updateProfileFollowups();
    updateRecommendedCaseLink();
    byId("profileForm").requestSubmit();
  }

  function loadSample(module) {
    if (module === "export") {
      setValue("exportType", "steel"); setValue("exportMarket", "eu"); setValue("exportHs", "7208.51 热轧卷板");
      setRadio("exportScreening", "partial"); setRadio("exportClassification", "self"); setRadio("exportMode", "self");
      setChecked("exportUSOrigin", false); setChecked("exportTech", false); setChecked("exportTradeRemedy", true); setChecked("exportMilitary", false); setChecked("exportSensitiveUse", false);
      submitForm("exportForm");
    }
    if (module === "ip") {
      setValue("ipMarket", "turkey"); setRadio("ipBrandStage", "partial"); setRadio("ipFtoStatus", "patentOnly");
      setChecked("ipEcommerce", true); setChecked("ipComplaint", false); setChecked("ipOemIndemnity", false); setChecked("ipGeneric", true); setChecked("ipCustomsFiled", false); setChecked("ipUsPatentHeavy", false); setChecked("ipTradeCase", false);
      submitForm("ipForm");
    }
    if (module === "labor") {
      setRadio("laborMode", "dispatch"); setValue("laborMarket", "sea"); setValue("laborWorkers", "30");
      setRadio("laborQualification", "none"); setRadio("laborContracts", "none"); setRadio("laborHours", "noRecord"); setRadio("laborSocial", "partial"); setRadio("laborUnion", "unknown");
      submitForm("laborForm");
    }
    if (module === "political") {
      setValue("politicalMarket", "uk"); setValue("investmentScale", "xlarge"); setRadio("investmentControl", "control"); setRadio("assetType", "factory");
      setRadio("securityReview", "uncertain"); setRadio("bitStatus", "unknown"); setRadio("insurance", "none");
      setChecked("politicalCriticalIndustry", true); setChecked("politicalGovDependency", true); setChecked("politicalGovJV", true); setChecked("politicalNoStability", true); setChecked("politicalNoExit", true); setChecked("politicalNoInsurance", true);
      submitForm("politicalForm");
    }
  }
  function initNavigation() {
    const sections = [...document.querySelectorAll("section[id], article[id]")];
    const navLinks = [...document.querySelectorAll(".nav a")];
    const observer = new IntersectionObserver((entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (!visible) return;
      navLinks.forEach((link) => link.classList.toggle("active", link.getAttribute("href") === `#${visible.target.id}`));
    }, { rootMargin: "-25% 0px -65% 0px", threshold: [0.05, 0.2, 0.5] });
    sections.forEach((section) => observer.observe(section));
  }

  function initApp() {
    const sourceCount = window.KNOWLEDGE?.sourceCount || window.KNOWLEDGE?.sources?.length || 0;
    if (byId("heroSourceCount")) byId("heroSourceCount").textContent = sourceCount;
    if (byId("kbCount")) byId("kbCount").textContent = sourceCount;
    loadPersistedState();
    Object.keys(state.results).forEach((module) => { if (state.results[module] && state.results[module].score != null) updateMetric(module, state.results[module].score); });
    renderKnowledge();

    initModuleRouting();
    initReportActions();
    initExportAssistant();
    initAiChat();
    initIpAssistant();
    initLaborAssistant();
    initPoliticalAssistant();
    initProfileControls();
    byId("profileForm").addEventListener("submit", runQuickProfile);
    byId("loadRecommendedCase").addEventListener("click", loadRecommendedCase);

    byId("exportForm").addEventListener("submit", runExport);
    byId("ipForm").addEventListener("submit", runIp);
    byId("laborForm").addEventListener("submit", runLabor);
    byId("politicalForm").addEventListener("submit", runPolitical);
    byId("exportForm").addEventListener("reset", () => window.setTimeout(() => resetModule("export"), 0));
    byId("ipForm").addEventListener("reset", () => window.setTimeout(() => resetModule("ip"), 0));
    byId("laborForm").addEventListener("reset", () => window.setTimeout(() => resetModule("labor"), 0));
    byId("politicalForm").addEventListener("reset", () => window.setTimeout(() => resetModule("political"), 0));

    document.querySelectorAll(".sample-btn").forEach((button) => button.addEventListener("click", () => loadSample(button.dataset.sample)));

    byId("kbSearch").addEventListener("input", (event) => { state.kbSearch = event.target.value; renderKnowledge(); });
    byId("kbTypeFilter").addEventListener("change", (event) => { state.kbType = event.target.value; renderKnowledge(); });
    byId("kbModuleFilters").addEventListener("click", (event) => {
      const button = event.target.closest("[data-filter]");
      if (!button) return;
      state.kbFilter = button.dataset.filter;
      byId("kbModuleFilters").querySelectorAll(".filter-btn").forEach((item) => item.classList.toggle("active", item === button));
      renderKnowledge();
    });
    byId("knowledgeList").addEventListener("click", (event) => {
      const preview = event.target.closest("[data-kb-open]");
      const file = event.target.closest("[data-kb-file]");
      if (preview) openKnowledge(preview.dataset.kbOpen);
      if (file) { const item = sourceById(file.dataset.kbFile); if (item) openFile(item.path); }
    });

    byId("openReport").addEventListener("click", openReport);
    byId("modal").addEventListener("click", (event) => { if (event.target === byId("modal") || event.target.closest("[data-close-modal]")) closeModal(); });
    document.addEventListener("keydown", (event) => { if (event.key === "Escape") closeModal(); });
    initNavigation();
    initCommandPalette();
    initReveal();
  }

  document.addEventListener("DOMContentLoaded", initApp);
})();








