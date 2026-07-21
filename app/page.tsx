"use client";

import { useEffect, useMemo, useState } from "react";

type Level = "基礎" | "中階" | "進階";
type Mastery = "mastered" | "learning" | "new";
type Word = { word: string; meaning: string; pos: string; example: string; level: Level };
type Memory = Word & { correct: boolean; mastery: Mastery; attempts: number };

const WORDS: Word[] = [
  { word: "agenda", meaning: "議程", pos: "n.", example: "The first item on the agenda is the budget.", level: "基礎" },
  { word: "applicant", meaning: "申請人", pos: "n.", example: "Each applicant must submit a résumé.", level: "基礎" },
  { word: "confirm", meaning: "確認", pos: "v.", example: "Please confirm your reservation by Friday.", level: "基礎" },
  { word: "deadline", meaning: "截止期限", pos: "n.", example: "The deadline for applications is May 12.", level: "基礎" },
  { word: "employee", meaning: "員工", pos: "n.", example: "Every employee receives an identification card.", level: "基礎" },
  { word: "equipment", meaning: "設備", pos: "n.", example: "The office equipment will be replaced next month.", level: "基礎" },
  { word: "invoice", meaning: "發票；請款單", pos: "n.", example: "The invoice is attached to this email.", level: "基礎" },
  { word: "purchase", meaning: "購買", pos: "v./n.", example: "Customers can purchase tickets online.", level: "基礎" },
  { word: "schedule", meaning: "行程；安排", pos: "n./v.", example: "The meeting is scheduled for Tuesday.", level: "基礎" },
  { word: "vacancy", meaning: "職缺；空位", pos: "n.", example: "The hotel has no vacancies this weekend.", level: "基礎" },
  { word: "accommodate", meaning: "容納；提供住宿", pos: "v.", example: "The hall can accommodate 300 guests.", level: "中階" },
  { word: "authorize", meaning: "授權；批准", pos: "v.", example: "Only managers can authorize the payment.", level: "中階" },
  { word: "complimentary", meaning: "免費贈送的", pos: "adj.", example: "Complimentary breakfast is served until ten.", level: "中階" },
  { word: "compliance", meaning: "遵守；依從", pos: "n.", example: "The audit checks compliance with safety rules.", level: "中階" },
  { word: "eligible", meaning: "符合資格的", pos: "adj.", example: "Full-time staff are eligible for the benefit.", level: "中階" },
  { word: "fluctuate", meaning: "波動", pos: "v.", example: "Fuel prices fluctuate throughout the year.", level: "中階" },
  { word: "inventory", meaning: "庫存", pos: "n.", example: "We update the inventory every evening.", level: "中階" },
  { word: "negotiate", meaning: "協商", pos: "v.", example: "The two companies negotiated a new contract.", level: "中階" },
  { word: "reimburse", meaning: "償還；報銷", pos: "v.", example: "The company will reimburse your travel costs.", level: "中階" },
  { word: "tentative", meaning: "暫定的", pos: "adj.", example: "We have set a tentative launch date.", level: "中階" },
  { word: "alleviate", meaning: "減輕；緩和", pos: "v.", example: "The new route should alleviate traffic congestion.", level: "進階" },
  { word: "contingency", meaning: "突發狀況；應變措施", pos: "n.", example: "The team prepared a contingency plan.", level: "進階" },
  { word: "deteriorate", meaning: "惡化", pos: "v.", example: "The building's condition has deteriorated.", level: "進階" },
  { word: "discrepancy", meaning: "差異；不一致", pos: "n.", example: "The accountant found a discrepancy in the report.", level: "進階" },
  { word: "expedite", meaning: "加速；促進", pos: "v.", example: "Please expedite the delivery of these parts.", level: "進階" },
  { word: "feasible", meaning: "可行的", pos: "adj.", example: "The proposal is financially feasible.", level: "進階" },
  { word: "inadvertently", meaning: "不經意地", pos: "adv.", example: "The file was inadvertently deleted.", level: "進階" },
  { word: "lucrative", meaning: "獲利豐厚的", pos: "adj.", example: "Consulting can be a lucrative career.", level: "進階" },
  { word: "prerequisite", meaning: "先決條件", pos: "n.", example: "Experience is a prerequisite for this position.", level: "進階" },
  { word: "streamline", meaning: "精簡；使更有效率", pos: "v.", example: "The software will streamline the hiring process.", level: "進階" },
  { word: "appointment", meaning: "約會；預約", pos: "n.", example: "I have a dental appointment this afternoon.", level: "基礎" },
  { word: "branch", meaning: "分公司；分店", pos: "n.", example: "The bank will open a new branch downtown.", level: "基礎" },
  { word: "budget", meaning: "預算", pos: "n.", example: "The project was completed within budget.", level: "基礎" },
  { word: "cancel", meaning: "取消", pos: "v.", example: "The airline canceled the morning flight.", level: "基礎" },
  { word: "candidate", meaning: "候選人", pos: "n.", example: "Three candidates were invited for interviews.", level: "基礎" },
  { word: "client", meaning: "客戶", pos: "n.", example: "We will meet the client at noon.", level: "基礎" },
  { word: "contract", meaning: "合約", pos: "n.", example: "Please read the contract before signing it.", level: "基礎" },
  { word: "customer", meaning: "顧客", pos: "n.", example: "Customer satisfaction is our top priority.", level: "基礎" },
  { word: "deliver", meaning: "運送；交付", pos: "v.", example: "The supplier will deliver the chairs tomorrow.", level: "基礎" },
  { word: "department", meaning: "部門", pos: "n.", example: "She works in the marketing department.", level: "基礎" },
  { word: "discount", meaning: "折扣", pos: "n.", example: "Members receive a ten percent discount.", level: "基礎" },
  { word: "document", meaning: "文件", pos: "n.", example: "Please print two copies of the document.", level: "基礎" },
  { word: "facility", meaning: "設施；場所", pos: "n.", example: "The new training facility opens in June.", level: "基礎" },
  { word: "fee", meaning: "費用", pos: "n.", example: "The registration fee includes lunch.", level: "基礎" },
  { word: "manager", meaning: "經理", pos: "n.", example: "The manager approved my vacation request.", level: "基礎" },
  { word: "meeting", meaning: "會議", pos: "n.", example: "The weekly meeting begins at nine.", level: "基礎" },
  { word: "order", meaning: "訂單；訂購", pos: "n./v.", example: "Your order will arrive within three days.", level: "基礎" },
  { word: "payment", meaning: "付款", pos: "n.", example: "Payment is due at the end of the month.", level: "基礎" },
  { word: "product", meaning: "產品", pos: "n.", example: "The company launched a new product line.", level: "基礎" },
  { word: "receipt", meaning: "收據", pos: "n.", example: "Keep the receipt for your records.", level: "基礎" },
  { word: "report", meaning: "報告", pos: "n.", example: "The sales report is ready for review.", level: "基礎" },
  { word: "reserve", meaning: "預訂；保留", pos: "v.", example: "We reserved a table for six people.", level: "基礎" },
  { word: "salary", meaning: "薪資", pos: "n.", example: "The position offers a competitive salary.", level: "基礎" },
  { word: "shipment", meaning: "貨物；出貨", pos: "n.", example: "The shipment was delayed by bad weather.", level: "基礎" },
  { word: "staff", meaning: "全體員工", pos: "n.", example: "All staff must attend the safety workshop.", level: "基礎" },
  { word: "supplier", meaning: "供應商", pos: "n.", example: "We changed suppliers to reduce costs.", level: "基礎" },
  { word: "training", meaning: "訓練", pos: "n.", example: "New employees receive two weeks of training.", level: "基礎" },
  { word: "travel", meaning: "旅行；出差", pos: "n./v.", example: "Her job requires frequent business travel.", level: "基礎" },
  { word: "update", meaning: "更新", pos: "n./v.", example: "Please update your contact information.", level: "基礎" },
  { word: "warehouse", meaning: "倉庫", pos: "n.", example: "The goods are stored in a nearby warehouse.", level: "基礎" },
  { word: "allocate", meaning: "分配", pos: "v.", example: "The director allocated more funds to advertising.", level: "中階" },
  { word: "anticipate", meaning: "預期", pos: "v.", example: "We anticipate strong demand for the service.", level: "中階" },
  { word: "approximately", meaning: "大約", pos: "adv.", example: "The tour lasts approximately two hours.", level: "中階" },
  { word: "assess", meaning: "評估", pos: "v.", example: "The committee will assess each proposal.", level: "中階" },
  { word: "capacity", meaning: "容量；能力", pos: "n.", example: "The theater has a seating capacity of 800.", level: "中階" },
  { word: "collaborate", meaning: "合作", pos: "v.", example: "The two teams collaborated on the campaign.", level: "中階" },
  { word: "commence", meaning: "開始", pos: "v.", example: "Construction will commence in early August.", level: "中階" },
  { word: "compensation", meaning: "薪酬；補償", pos: "n.", example: "The benefits package includes fair compensation.", level: "中階" },
  { word: "consecutive", meaning: "連續的", pos: "adj.", example: "Sales increased for three consecutive months.", level: "中階" },
  { word: "constraint", meaning: "限制；約束", pos: "n.", example: "Time constraints affected the project schedule.", level: "中階" },
  { word: "convenient", meaning: "方便的", pos: "adj.", example: "The hotel is in a convenient location.", level: "中階" },
  { word: "coordinate", meaning: "協調", pos: "v.", example: "Maria will coordinate the annual conference.", level: "中階" },
  { word: "deduct", meaning: "扣除", pos: "v.", example: "The coupon amount will be deducted at checkout.", level: "中階" },
  { word: "defective", meaning: "有缺陷的", pos: "adj.", example: "Defective items may be returned without charge.", level: "中階" },
  { word: "designate", meaning: "指定", pos: "v.", example: "The front row is designated for special guests.", level: "中階" },
  { word: "distribute", meaning: "分發；配送", pos: "v.", example: "Volunteers distributed brochures at the entrance.", level: "中階" },
  { word: "efficient", meaning: "有效率的", pos: "adj.", example: "The new system is faster and more efficient.", level: "中階" },
  { word: "estimate", meaning: "估計；估價", pos: "n./v.", example: "The contractor provided a cost estimate.", level: "中階" },
  { word: "evaluate", meaning: "評價；評估", pos: "v.", example: "Supervisors evaluate employee performance annually.", level: "中階" },
  { word: "exceed", meaning: "超過", pos: "v.", example: "Expenses must not exceed the approved budget.", level: "中階" },
  { word: "implement", meaning: "實施", pos: "v.", example: "The company implemented a flexible work policy.", level: "中階" },
  { word: "inquiry", meaning: "詢問", pos: "n.", example: "We received an inquiry about bulk pricing.", level: "中階" },
  { word: "maintenance", meaning: "維護；保養", pos: "n.", example: "The elevator is closed for routine maintenance.", level: "中階" },
  { word: "mandatory", meaning: "強制的；必要的", pos: "adj.", example: "Attendance at the orientation is mandatory.", level: "中階" },
  { word: "modify", meaning: "修改", pos: "v.", example: "We modified the design after receiving feedback.", level: "中階" },
  { word: "notify", meaning: "通知", pos: "v.", example: "Please notify us of any address change.", level: "中階" },
  { word: "postpone", meaning: "延期", pos: "v.", example: "They postponed the event until next week.", level: "中階" },
  { word: "prohibit", meaning: "禁止", pos: "v.", example: "Company rules prohibit smoking indoors.", level: "中階" },
  { word: "prospective", meaning: "潛在的；預期的", pos: "adj.", example: "Prospective buyers toured the apartment.", level: "中階" },
  { word: "retain", meaning: "保留；留住", pos: "v.", example: "The firm offers bonuses to retain skilled workers.", level: "中階" },
  { word: "adjacent", meaning: "相鄰的", pos: "adj.", example: "Parking is available in the adjacent building.", level: "進階" },
  { word: "advocate", meaning: "提倡；支持", pos: "v.", example: "The committee advocates better workplace safety.", level: "進階" },
  { word: "amend", meaning: "修訂", pos: "v.", example: "The board voted to amend the policy.", level: "進階" },
  { word: "arbitrarily", meaning: "武斷地；任意地", pos: "adv.", example: "Prices cannot be changed arbitrarily.", level: "進階" },
  { word: "benchmark", meaning: "基準", pos: "n.", example: "Customer ratings provide a useful benchmark.", level: "進階" },
  { word: "consolidate", meaning: "合併；鞏固", pos: "v.", example: "The company consolidated its regional offices.", level: "進階" },
  { word: "diligent", meaning: "勤勉的", pos: "adj.", example: "Her diligent research improved the final report.", level: "進階" },
  { word: "diversify", meaning: "多元化", pos: "v.", example: "The manufacturer plans to diversify its product range.", level: "進階" },
  { word: "endorse", meaning: "認可；支持", pos: "v.", example: "The association endorsed the new standards.", level: "進階" },
  { word: "entail", meaning: "牽涉；需要", pos: "v.", example: "The position entails frequent overseas travel.", level: "進階" },
  { word: "exemplary", meaning: "典範的；優秀的", pos: "adj.", example: "She received an award for exemplary service.", level: "進階" },
  { word: "fiscal", meaning: "財政的；會計年度的", pos: "adj.", example: "Revenue rose during the last fiscal year.", level: "進階" },
  { word: "impending", meaning: "即將發生的", pos: "adj.", example: "Staff were informed of the impending relocation.", level: "進階" },
  { word: "incentive", meaning: "獎勵；誘因", pos: "n.", example: "The bonus provides an incentive to reach targets.", level: "進階" },
  { word: "incompatible", meaning: "不相容的", pos: "adj.", example: "The software is incompatible with older devices.", level: "進階" },
  { word: "indispensable", meaning: "不可或缺的", pos: "adj.", example: "Reliable data is indispensable for planning.", level: "進階" },
  { word: "meticulous", meaning: "一絲不苟的", pos: "adj.", example: "The editor conducted a meticulous review.", level: "進階" },
  { word: "obsolete", meaning: "過時的；淘汰的", pos: "adj.", example: "The factory replaced its obsolete machinery.", level: "進階" },
  { word: "paramount", meaning: "最重要的", pos: "adj.", example: "Passenger safety is of paramount importance.", level: "進階" },
  { word: "plausible", meaning: "合理可信的", pos: "adj.", example: "The consultant offered a plausible explanation.", level: "進階" },
  { word: "proficient", meaning: "熟練的", pos: "adj.", example: "Applicants must be proficient in spreadsheet software.", level: "進階" },
  { word: "prolonged", meaning: "長期的；延長的", pos: "adj.", example: "The project faced a prolonged delay.", level: "進階" },
  { word: "reconcile", meaning: "調和；核對", pos: "v.", example: "The accountant reconciled the two statements.", level: "進階" },
  { word: "refrain", meaning: "避免；克制", pos: "v.", example: "Please refrain from using phones during the presentation.", level: "進階" },
  { word: "scrutinize", meaning: "仔細審查", pos: "v.", example: "Investors scrutinized the company's annual results.", level: "進階" },
  { word: "subordinate", meaning: "下屬的；次要的", pos: "adj./n.", example: "Each supervisor is responsible for five subordinates.", level: "進階" },
  { word: "substantial", meaning: "大量的；可觀的", pos: "adj.", example: "The renovation requires a substantial investment.", level: "進階" },
  { word: "unprecedented", meaning: "前所未有的", pos: "adj.", example: "The store experienced unprecedented online demand.", level: "進階" },
  { word: "viable", meaning: "可行的；能生存的", pos: "adj.", example: "Remote work is a viable option for the team.", level: "進階" },
  { word: "waive", meaning: "免除；放棄", pos: "v.", example: "The bank agreed to waive the service fee.", level: "進階" },
];

const AMERICAN_IPA: Record<string, string> = {
  agenda: "/əˈdʒendə/", applicant: "/ˈæplɪkənt/", confirm: "/kənˈfɝːm/", deadline: "/ˈdedlaɪn/",
  employee: "/ɪmˈplɔɪiː/", equipment: "/ɪˈkwɪpmənt/", invoice: "/ˈɪnvɔɪs/", purchase: "/ˈpɝːtʃəs/",
  schedule: "/ˈskedʒuːl/", vacancy: "/ˈveɪkənsi/", accommodate: "/əˈkɑːmədeɪt/", authorize: "/ˈɔːθəraɪz/",
  complimentary: "/ˌkɑːmpləˈmentəri/", compliance: "/kəmˈplaɪəns/", eligible: "/ˈelɪdʒəbəl/", fluctuate: "/ˈflʌktʃueɪt/",
  inventory: "/ˈɪnvəntɔːri/", negotiate: "/nɪˈɡoʊʃieɪt/", reimburse: "/ˌriːɪmˈbɝːs/", tentative: "/ˈtentətɪv/",
  alleviate: "/əˈliːvieɪt/", contingency: "/kənˈtɪndʒənsi/", deteriorate: "/dɪˈtɪriəreɪt/", discrepancy: "/dɪˈskrepənsi/",
  expedite: "/ˈekspədaɪt/", feasible: "/ˈfiːzəbəl/", inadvertently: "/ˌɪnədˈvɝːtəntli/", lucrative: "/ˈluːkrətɪv/",
  prerequisite: "/priːˈrekwəzɪt/", streamline: "/ˈstriːmlaɪn/", appointment: "/əˈpɔɪntmənt/", branch: "/bræntʃ/",
  budget: "/ˈbʌdʒɪt/", cancel: "/ˈkænsəl/", candidate: "/ˈkændədeɪt/", client: "/ˈklaɪənt/",
  contract: "/ˈkɑːntrækt/", customer: "/ˈkʌstəmər/", deliver: "/dɪˈlɪvər/", department: "/dɪˈpɑːrtmənt/",
  discount: "/ˈdɪskaʊnt/", document: "/ˈdɑːkjəmənt/", facility: "/fəˈsɪləti/", fee: "/fiː/",
  manager: "/ˈmænɪdʒər/", meeting: "/ˈmiːtɪŋ/", order: "/ˈɔːrdər/", payment: "/ˈpeɪmənt/",
  product: "/ˈprɑːdʌkt/", receipt: "/rɪˈsiːt/", report: "/rɪˈpɔːrt/", reserve: "/rɪˈzɝːv/",
  salary: "/ˈsæləri/", shipment: "/ˈʃɪpmənt/", staff: "/stæf/", supplier: "/səˈplaɪər/",
  training: "/ˈtreɪnɪŋ/", travel: "/ˈtrævəl/", update: "/ˈʌpdeɪt/", warehouse: "/ˈwerhaʊs/",
  allocate: "/ˈæləkeɪt/", anticipate: "/ænˈtɪsəpeɪt/", approximately: "/əˈprɑːksəmətli/", assess: "/əˈses/",
  capacity: "/kəˈpæsəti/", collaborate: "/kəˈlæbəreɪt/", commence: "/kəˈmens/", compensation: "/ˌkɑːmpənˈseɪʃən/",
  consecutive: "/kənˈsekjətɪv/", constraint: "/kənˈstreɪnt/", convenient: "/kənˈviːniənt/", coordinate: "/koʊˈɔːrdəneɪt/",
  deduct: "/dɪˈdʌkt/", defective: "/dɪˈfektɪv/", designate: "/ˈdezɪɡneɪt/", distribute: "/dɪˈstrɪbjuːt/",
  efficient: "/ɪˈfɪʃənt/", estimate: "/ˈestəmət/", evaluate: "/ɪˈvæljueɪt/", exceed: "/ɪkˈsiːd/",
  implement: "/ˈɪmpləment/", inquiry: "/ɪnˈkwaɪəri/", maintenance: "/ˈmeɪntənəns/", mandatory: "/ˈmændətɔːri/",
  modify: "/ˈmɑːdəfaɪ/", notify: "/ˈnoʊtəfaɪ/", postpone: "/poʊstˈpoʊn/", prohibit: "/proʊˈhɪbɪt/",
  prospective: "/prəˈspektɪv/", retain: "/rɪˈteɪn/", adjacent: "/əˈdʒeɪsənt/", advocate: "/ˈædvəkeɪt/",
  amend: "/əˈmend/", arbitrarily: "/ˌɑːrbəˈtrerəli/", benchmark: "/ˈbentʃmɑːrk/", consolidate: "/kənˈsɑːlədeɪt/",
  diligent: "/ˈdɪlədʒənt/", diversify: "/daɪˈvɝːsəfaɪ/", endorse: "/ɪnˈdɔːrs/", entail: "/ɪnˈteɪl/",
  exemplary: "/ɪɡˈzempləri/", fiscal: "/ˈfɪskəl/", impending: "/ɪmˈpendɪŋ/", incentive: "/ɪnˈsentɪv/",
  incompatible: "/ˌɪnkəmˈpætəbəl/", indispensable: "/ˌɪndɪˈspensəbəl/", meticulous: "/məˈtɪkjələs/", obsolete: "/ˌɑːbsəˈliːt/",
  paramount: "/ˈperəmaʊnt/", plausible: "/ˈplɔːzəbəl/", proficient: "/prəˈfɪʃənt/", prolonged: "/prəˈlɔːŋd/",
  reconcile: "/ˈrekənsaɪl/", refrain: "/rɪˈfreɪn/", scrutinize: "/ˈskruːtənaɪz/", subordinate: "/səˈbɔːrdənət/",
  substantial: "/səbˈstænʃəl/", unprecedented: "/ʌnˈpresədentɪd/", viable: "/ˈvaɪəbəl/", waive: "/weɪv/",
};

const LABELS: Record<Mastery, string> = { mastered: "融會貫通", learning: "尚在參悟", new: "尚未入門" };
const BRITISH_IPA_OVERRIDES: Record<string, string> = {
  schedule: "/ˈʃedjuːl/", inventory: "/ˈɪnvəntri/", warehouse: "/ˈweəhaʊs/", purchase: "/ˈpɜːtʃəs/",
  confirm: "/kənˈfɜːm/", reimburse: "/ˌriːɪmˈbɜːs/", inadvertently: "/ˌɪnədˈvɜːtəntli/",
  contract: "/ˈkɒntrækt/", document: "/ˈdɒkjəmənt/", product: "/ˈprɒdʌkt/", approximately: "/əˈprɒksɪmətli/",
  compensation: "/ˌkɒmpənˈseɪʃən/", mandatory: "/ˈmændətəri/", modify: "/ˈmɒdɪfaɪ/",
  postpone: "/pəʊstˈpəʊn/", prohibit: "/prəʊˈhɪbɪt/", obsolete: "/ˌɒbsəˈliːt/",
};
function britishIpa(word: string) {
  return BRITISH_IPA_OVERRIDES[word] ?? AMERICAN_IPA[word].replaceAll("oʊ", "əʊ").replaceAll("ɝː", "ɜː").replaceAll("ɑːr", "ɑː").replaceAll("ɔːr", "ɔː").replaceAll("ər", "ə");
}
const MOTIVATIONS = [
  { title: "一字入心，百招皆通。", body: "水獺教主有令：今日多練一字，考場便多一分勝算。" },
  { title: "水獺出關，單字退散。", body: "運起單字內力，破盡多益迷陣；此刻的堅持，便是上榜的伏筆。" },
  { title: "一字一式，直取九百九。", body: "江湖高手皆從基本功起步，征服眼前此字，離巔峰再近一步。" },
  { title: "教主未退，此戰不休。", body: "答錯不過是再戰的戰帖，記住此字，下一回合定能雪恥。" },
  { title: "今日練字，明日稱霸。", body: "水獺教主替你鎮守心神；穩住一題一字，終會威震多益江湖。" },
  { title: "背下此字，再破一關。", body: "內力不在一夕暴增，而在每日不退。出招吧，讓此字臣服。" },
  { title: "江湖路遠，先斬此字。", body: "莫問前路幾千字，先贏眼前這一題；小勝累積，終成絕世高手。" },
  { title: "單字不滅，內力不歇。", body: "今日所背皆會化作考場真氣，水獺教主與你一同殺向九百九。" },
];
const SCORE_ESTIMATE: Record<Level, string> = { 基礎: "350–545", 中階: "550–785", 進階: "790–950" };
const LETTERS = ["A", "B", "C", "D"];
const dayKey = () => new Date().toLocaleDateString("en-CA");
const mix = <T,>(items: T[]) => [...items].sort(() => Math.random() - 0.5);

function choicesFor(item: Word) {
  const wrong = mix(WORDS.filter((w) => w.meaning !== item.meaning)).slice(0, 3).map((w) => w.meaning);
  return mix([item.meaning, ...wrong]);
}

let pronunciationContext: AudioContext | null = null;
let activePronunciation: AudioBufferSourceNode | null = null;
const pronunciationCache = new Map<string, AudioBuffer>();

export default function Home() {
  const [ready, setReady] = useState(false);
  const [phase, setPhase] = useState<"home" | "assessment" | "learn" | "memory">("home");
  const [assessed, setAssessed] = useState(false);
  const [assessmentIndex, setAssessmentIndex] = useState(0);
  const [assessmentScore, setAssessmentScore] = useState(0);
  const [level, setLevel] = useState<Level>("基礎");
  const [wordIndex, setWordIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState(false);
  const [choices, setChoices] = useState<string[]>([]);
  const [lives, setLives] = useState(3);
  const [memory, setMemory] = useState<Memory[]>([]);
  const [filter, setFilter] = useState<"all" | Mastery>("all");
  const [reviewWord, setReviewWord] = useState<Memory | null>(null);
  const [reviewChoices, setReviewChoices] = useState<string[]>([]);
  const [reviewSelected, setReviewSelected] = useState<string | null>(null);
  const [reviewQueue, setReviewQueue] = useState<Memory[]>([]);
  const [reviewPosition, setReviewPosition] = useState(0);
  const [adOpen, setAdOpen] = useState(false);
  const [adSeconds, setAdSeconds] = useState(5);
  const [levelComplete, setLevelComplete] = useState(false);
  const [motivation, setMotivation] = useState(MOTIVATIONS[0]);

  const assessment = useMemo(() => [WORDS[1], WORDS[3], WORDS[8], WORDS[10], WORDS[12], WORDS[16], WORDS[18], WORDS[21], WORDS[25], WORDS[28]], []);
  const pool = useMemo(() => WORDS.filter((w) => w.level === level), [level]);
  const current = phase === "assessment" ? assessment[assessmentIndex] : pool[wordIndex % pool.length];

  useEffect(() => {
    setMotivation(MOTIVATIONS[Math.floor(Math.random() * MOTIVATIONS.length)]);
    const saved = JSON.parse(localStorage.getItem("toeic-journal") || "null");
    if (saved) {
      const hasCurrentAssessment = saved.assessed && saved.assessmentVersion === 1;
      setMemory(saved.memory ?? []);
      setLevel(saved.level ?? "基礎");
      setAssessed(Boolean(hasCurrentAssessment));
      setLives(saved.date === dayKey() ? saved.lives : 3);
      setPhase(hasCurrentAssessment ? "home" : "assessment");
    } else {
      setPhase("assessment");
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (current) setChoices(choicesFor(current));
    setSelected(null);
    setConfirmed(false);
  }, [current]);

  useEffect(() => {
    if (!ready || phase !== "learn" || selected || !pool.length) return;
    const remembered = new Set(memory.map((item) => item.word));
    const nextIndex = Array.from({ length: pool.length }, (_, offset) => (wordIndex + offset) % pool.length)
      .find((index) => !remembered.has(pool[index].word));
    if (nextIndex === undefined) {
      setLevelComplete(true);
    } else {
      setLevelComplete(false);
      if (nextIndex !== wordIndex) setWordIndex(nextIndex);
    }
  }, [ready, phase, selected, pool, memory, wordIndex]);

  useEffect(() => {
    if (!ready) return;
    localStorage.setItem("toeic-journal", JSON.stringify({ memory, level, assessed, assessmentVersion: 1, lives, date: dayKey() }));
  }, [memory, level, assessed, lives, ready]);

  useEffect(() => {
    if (!adOpen || adSeconds <= 0) return;
    const timer = window.setTimeout(() => setAdSeconds((n) => n - 1), 1000);
    return () => window.clearTimeout(timer);
  }, [adOpen, adSeconds]);

  function addMemory(correct: boolean) {
    setMemory((list) => {
      const old = list.find((x) => x.word === current.word);
      const entry: Memory = { ...current, correct, mastery: old?.mastery ?? (correct ? "learning" : "new"), attempts: (old?.attempts ?? 0) + 1 };
      return [entry, ...list.filter((x) => x.word !== current.word)];
    });
  }

  function answer(choice: string) {
    if (confirmed || (phase === "learn" && lives <= 0)) return;
    setSelected(choice);
  }

  function confirmAnswer() {
    if (!selected || confirmed || (phase === "learn" && lives <= 0)) return;
    setConfirmed(true);
    const correct = selected === current.meaning;
    if (phase === "assessment") {
      if (correct) setAssessmentScore((n) => n + 1);
      return;
    }
    addMemory(correct);
    if (!correct) {
      setLives((n) => Math.max(0, n - 1));
    }
  }

  function next() {
    if (phase === "assessment") {
      if (assessmentIndex === 9) {
        const score = assessmentScore;
        const result: Level = score <= 3 ? "基礎" : score <= 7 ? "中階" : "進階";
        setLevel(result);
        setAssessed(true);
        setPhase("learn");
      } else setAssessmentIndex((n) => n + 1);
    } else setWordIndex((n) => n + 1);
    setSelected(null);
    setConfirmed(false);
  }

  function classify(mastery: Mastery) {
    setMemory((list) => list.map((x) => x.word === current.word ? { ...x, mastery } : x));
    next();
  }

  function watchAd() {
    setAdOpen(true); setAdSeconds(5);
  }

  function openReview(item: Memory) {
    setReviewQueue([]);
    setReviewPosition(0);
    setReviewWord(item);
    setReviewChoices(choicesFor(item));
    setReviewSelected(null);
  }

  function startCategoryReview(mastery: Mastery) {
    const queue = mix(memory.filter((item) => item.mastery === mastery));
    if (!queue.length) return;
    setReviewQueue(queue);
    setReviewPosition(0);
    setReviewWord(queue[0]);
    setReviewChoices(choicesFor(queue[0]));
    setReviewSelected(null);
  }

  function nextCategoryReview() {
    const nextPosition = reviewPosition + 1;
    if (nextPosition >= reviewQueue.length) {
      setReviewWord(null);
      setReviewQueue([]);
      setReviewPosition(0);
      return;
    }
    const nextWord = reviewQueue[nextPosition];
    setReviewPosition(nextPosition);
    setReviewWord(memory.find((item) => item.word === nextWord.word) ?? nextWord);
    setReviewChoices(choicesFor(nextWord));
    setReviewSelected(null);
  }

  function closeReview() {
    setReviewWord(null);
    setReviewQueue([]);
    setReviewPosition(0);
    setReviewSelected(null);
  }

  function answerReview(choice: string) {
    if (!reviewWord || reviewSelected) return;
    const isCorrect = choice === reviewWord.meaning;
    setReviewSelected(choice);
    setMemory((list) => list.map((x) => x.word === reviewWord.word ? { ...x, correct: isCorrect, attempts: x.attempts + 1 } : x));
    setReviewWord((item) => item ? { ...item, correct: isCorrect, attempts: item.attempts + 1 } : item);
  }
  function finishAd() {
    setLives((n) => n + 1); setAdOpen(false); setAdSeconds(5);
  }

  async function speakWord(word: string, accent: "US" | "UK") {
    activePronunciation?.stop();
    const region = accent === "US" ? "us" : "uk";
    const path = `/audio/${region}/${word}.wav`;
    pronunciationContext ??= new AudioContext();
    await pronunciationContext.resume();
    let buffer = pronunciationCache.get(path);
    if (!buffer) {
      const response = await fetch(path);
      buffer = await pronunciationContext.decodeAudioData(await response.arrayBuffer());
      pronunciationCache.set(path, buffer);
    }
    const samples = buffer.getChannelData(0);
    let energy = 0;
    for (let index = 0; index < samples.length; index += 1) energy += samples[index] * samples[index];
    const rms = Math.sqrt(energy / samples.length) || 0.1;
    const source = pronunciationContext.createBufferSource();
    const gain = pronunciationContext.createGain();
    source.buffer = buffer;
    gain.gain.value = Math.min(2, 0.14 / rms);
    source.connect(gain).connect(pronunciationContext.destination);
    source.start();
    activePronunciation = source;
  }

  function resetProgress() {
    if (!window.confirm("確定要清除所有學習進度，重新進行十題程度測驗嗎？")) return;
    localStorage.removeItem("toeic-journal");
    window.location.reload();
  }

  if (!ready) return <main className="loading">正在準備你的單字卡…</main>;
  const visibleMemory = memory
    .filter((x) => filter === "all" || x.mastery === filter)
    .sort((a, b) => a.word.localeCompare(b.word, "en"));
  const correct = selected === current.meaning;

  return (
    <main>
      <header className="topbar">
        <button className="brand" onClick={() => phase !== "assessment" && setPhase("home")} aria-label="回到主畫面">
          <span className="brand-mark" aria-hidden="true"><i /><i /><i /><i /><em /></span>
        </button>
        <nav>
          <button disabled={phase === "assessment"} className={phase === "learn" ? "active" : ""} onClick={() => setPhase(assessed ? "learn" : "assessment")}>今日學習</button>
          <button disabled={phase === "assessment"} className={phase === "memory" ? "active" : ""} onClick={() => setPhase("memory")}>回憶錄 <span>{memory.length}</span></button>
        </nav>
        <div className="topbar-actions">
          <div className="lives" aria-label={`剩餘 ${lives} 次機會`}><i>♥</i> {lives}<small> / 今日機會</small></div>
          <button className="reset-button" onClick={resetProgress} title="清除所有學習進度">重置</button>
        </div>
      </header>

      {phase === "home" ? (
        <section className="home-page">
          <div className="home-content">
            <div className="section-kicker">THE THRONE OF 990</div>
            <h1>煞氣 a 水獺教教主</h1>
            <p>挑戰多益單字試煉，把每一次答題寫入你的江湖秘笈。</p>
            <div className="home-actions">
              <button className="challenge-button" onClick={() => setPhase(assessed ? "learn" : "assessment")}><span>01</span><b>挑戰新單字</b><small>{assessed ? `${level} · 預估 TOEIC ${SCORE_ESTIMATE[level]}` : "先完成十題程度測驗"}</small><i>→</i></button>
              <button className="memoir-button" onClick={() => setPhase("memory")}><span>02</span><b>回憶錄</b><small>已收藏 {memory.length} 個單字</small><i>→</i></button>
            </div>
          </div>
        </section>
      ) : phase === "memory" ? (
        <section className="memory-page">
          <div className="memory-heading"><div><h1>多益武林秘笈</h1><p>每一次答題都會載入武林秘笈。這裡複習答錯，也不會失去愛心。</p></div><div className="memory-total"><b>{memory.length}</b><span>已收錄心法</span></div></div>
          <div className="filters">
            <button className={filter === "all" ? "selected" : ""} onClick={() => setFilter("all")}>全部 <span>{memory.length}</span></button>
            {(["mastered", "learning", "new"] as Mastery[]).map((key) => { const count = memory.filter((x) => x.mastery === key).length; return <div className="filter-pair" key={key}><button className={`mastery-${key} ${filter === key ? "selected" : ""}`} onClick={() => setFilter(key)}>{LABELS[key]} <span>{count}</span></button><button className="review-launch" disabled={!count} onClick={() => startCategoryReview(key)}>↻ 隨機複習</button></div>; })}
          </div>
          {visibleMemory.length ? <div className="word-grid">{visibleMemory.map((item) => <article className="word-tile" key={item.word}><div className="word-open" role="button" tabIndex={0} onClick={() => openReview(item)} onKeyDown={(event) => event.key === "Enter" && openReview(item)} aria-label={`複習 ${item.word}`}><div><span className={`dot ${item.mastery}`} />{LABELS[item.mastery]}</div><h2>{item.word}<small className="word-pos-inline">{item.pos}</small></h2><p className="tile-phonetic"><span><b>美</b>{AMERICAN_IPA[item.word]}<button className="pronounce-button" onClick={(event) => { event.stopPropagation(); speakWord(item.word, "US"); }} aria-label={`播放 ${item.word} 美式發音`}>🔊</button></span><span><b>英</b>{britishIpa(item.word)}<button className="pronounce-button" onClick={(event) => { event.stopPropagation(); speakWord(item.word, "UK"); }} aria-label={`播放 ${item.word} 英式發音`}>🔊</button></span></p><p className="tile-meaning">{item.meaning}</p><small>{item.correct ? "最近答對" : "最近答錯"} · 練習 {item.attempts} 次</small><b className="open-arrow" aria-hidden="true">閱</b></div></article>)}</div> : <div className="empty"><b>還沒有這一類單字</b><p>回到今日學習，回答一題後就會收藏在這裡。</p></div>}
        </section>
      ) : (
        <section className="study-page">
          <aside>
            {phase === "assessment" && <div className="section-kicker">THE TRIAL OF TEN</div>}
            <h1>{phase === "assessment" ? "踏入 990 分之座" : motivation.title}</h1>
            <p>{phase === "assessment" ? "接受十題試煉，水獺教主將辨識你的單字內力。程度測驗答錯不扣愛心。" : motivation.body}</p>
            <div className="session-stat"><span>{phase === "assessment" ? `${assessmentIndex + 1} / 10` : level}</span><small>{phase === "assessment" ? "程度測驗" : `預估 TOEIC ${SCORE_ESTIMATE[level]}`}</small></div>
            <div className="quote">“Every word is a secret technique.”</div>
          </aside>

          <div className="quiz-wrap">
            <div className="quiz-meta"><span>{phase === "assessment" ? `程度測驗 · ${assessmentIndex + 1} / 10` : `${level}單字 · 預估 TOEIC ${SCORE_ESTIMATE[level]}`}</span><span className="progress-line"><i style={{ width: phase === "assessment" ? `${(assessmentIndex + 1) * 10}%` : `${Math.min(100, memory.filter((item) => item.level === level).length / pool.length * 100)}%` }} /></span></div>
            {levelComplete && phase === "learn" ? <article className="completion-card"><span>本級心法修習完畢</span><h2>{level}單字，全數收入秘笈</h2><p>預估 TOEIC 成績：<b>{SCORE_ESTIMATE[level]}</b></p><button onClick={() => setPhase("memory")}>前往回憶錄總複習 →</button></article> : <><article className="card">
              <div className="card-no">{String(phase === "assessment" ? assessmentIndex + 1 : wordIndex + 1).padStart(2, "0")}</div>
              <h2>{current.word}<small className="word-pos-inline">{current.pos}</small></h2>
              <div className="word-details"><span><b>美</b>{AMERICAN_IPA[current.word]}<button className="pronounce-button" onClick={() => speakWord(current.word, "US")} aria-label={`播放 ${current.word} 美式發音`}>🔊</button></span><span><b>英</b>{britishIpa(current.word)}<button className="pronounce-button" onClick={() => speakWord(current.word, "UK")} aria-label={`播放 ${current.word} 英式發音`}>🔊</button></span></div>
              <p className="prompt">請選出最適合的中文意思</p>
              <div className="answers">{choices.map((choice, i) => {
                const state = confirmed ? choice === current.meaning ? "correct" : choice === selected ? "wrong" : "muted" : choice === selected ? "pending" : "";
                return <button key={choice} className={state} onClick={() => answer(choice)}><b>{LETTERS[i]}</b><span>{choice}</span>{state === "correct" && <i>✓</i>}{state === "wrong" && <i>×</i>}</button>;
              })}</div>
              {!confirmed && <button className="confirm-answer" disabled={!selected} onClick={confirmAnswer}>{selected ? "確認答案" : "請先選擇答案"}</button>}
              {confirmed && <div className={`feedback ${correct ? "good" : "bad"}`}><b>{correct ? "答對了，漂亮！" : `正確答案是「${current.meaning}」`}</b><p><strong>英文例句</strong>{current.example}</p></div>}
            </article>
            {confirmed && (phase === "learn" ? <div className="classify"><span>這個字對你來說…</span>{(["mastered", "learning", "new"] as Mastery[]).map((key) => <button className={`mastery-${key}`} key={key} onClick={() => classify(key)}>{key === "mastered" ? "◆" : key === "learning" ? "◐" : "◇"} {LABELS[key]}</button>)}</div> : <button className="next-button" onClick={next}>{assessmentIndex === 9 ? "查看我的程度" : "下一題 →"}</button>)}
            {phase === "learn" && lives <= 0 && !confirmed && <div className="out"><b>今天的 3 次機會用完了</b><p>看一則短廣告，即可增加 1 次作答機會。</p><button onClick={watchAd}>▶ 看廣告 · +1 次機會</button></div>}</>}
          </div>
        </section>
      )}

      {reviewWord && <div className="modal-backdrop" onClick={closeReview}><div className="review-modal" onClick={(e) => e.stopPropagation()}><button className="close" onClick={closeReview}>×</button><div className="review-topline"><span className="pos">回憶錄複習{reviewQueue.length ? ` · ${reviewPosition + 1}/${reviewQueue.length}` : ""}</span><span>♥ 不扣愛心</span></div><h2>{reviewWord.word}<small className="word-pos-inline">{reviewWord.pos}</small></h2><div className="word-details"><span><b>美</b>{AMERICAN_IPA[reviewWord.word]}<button className="pronounce-button" onClick={() => speakWord(reviewWord.word, "US")} aria-label={`播放 ${reviewWord.word} 美式發音`}>🔊</button></span><span><b>英</b>{britishIpa(reviewWord.word)}<button className="pronounce-button" onClick={() => speakWord(reviewWord.word, "UK")} aria-label={`播放 ${reviewWord.word} 英式發音`}>🔊</button></span></div><p className="review-prompt">請選出最適合的中文意思</p><div className="answers review-answers">{reviewChoices.map((choice, i) => { const state = reviewSelected ? choice === reviewWord.meaning ? "correct" : choice === reviewSelected ? "wrong" : "muted" : ""; return <button key={choice} className={state} onClick={() => answerReview(choice)}><b>{LETTERS[i]}</b><span>{choice}</span>{state === "correct" && <i>✓</i>}{state === "wrong" && <i>×</i>}</button>; })}</div>{reviewSelected && <><div className={`feedback ${reviewSelected === reviewWord.meaning ? "good" : "bad"}`}><b>{reviewSelected === reviewWord.meaning ? "答對了，記得很清楚！" : `答錯了，正確答案是「${reviewWord.meaning}」`}</b><p><strong>英文例句</strong>{reviewWord.example}</p></div><div className="review-note">本次複習不扣除任何愛心 · 請重新標記熟悉程度</div><div className="modal-actions">{(["mastered", "learning", "new"] as Mastery[]).map((key) => <button className={`mastery-${key} ${reviewWord.mastery === key ? "chosen" : ""}`} key={key} onClick={() => { setMemory((list) => list.map((x) => x.word === reviewWord.word ? { ...x, mastery: key } : x)); setReviewWord({ ...reviewWord, mastery: key }); }}>{LABELS[key]}</button>)}</div>{reviewQueue.length > 0 && <button className="review-next" onClick={nextCategoryReview}>{reviewPosition + 1 >= reviewQueue.length ? "完成這次複習 ✓" : "下一個隨機單字 →"}</button>}</>}</div></div>}

      {adOpen && <div className="modal-backdrop"><div className="ad-modal"><div className="ad-label">ADVERTISEMENT</div><div className="fake-ad"><b>FOCUS.</b><p>Good habits build great results.</p></div>{adSeconds > 0 ? <p>廣告將在 {adSeconds} 秒後結束…</p> : <button onClick={finishAd}>領取 +1 次機會</button>}</div></div>}
    </main>
  );
}
