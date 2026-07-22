import fs from "node:fs";

const files = ["app/page.tsx", "app/pdfWords.ts"];
const invalidOcrFragments = new Set(["al", "ne", "ud", "id", "ay", "ad", "an", "te", "se", "ge", "ak", "mentary", "ging", "tach"]);
const nounCorrections = new Set(["secretary", "editor", "consumer", "warning", "container", "explanation", "quantity", "anniversary", "subsidiary", "itinerary"]);
const personNouns = new Set(["editor"]);
const meaningCorrections = new Map(Object.entries({
  clerk: "店員；職員", trainee: "受訓人員；實習生", technician: "技術人員；專家",
  benefit: "福利；津貼",
  manufacturer: "製造商；製造廠", system: "制度；體制；系統", specialty: "專長；專業；特色",
  tourism: "觀光；旅遊業", volunteer: "志工；志願者", souvenir: "特產；紀念品",
  cabinet: "儲藏櫃；陳列櫃", comment: "意見；批評；評論", peak: "最高點；高峰",
  advantage: "優勢；優點", source: "來源；根源；出處", strength: "力量；強度；優點",
  case: "情況；事例；案件", complete: "完成；使完整", amaze: "使大為驚奇",
  bore: "使厭煩；令人厭倦", compare: "比較；比喻", describe: "描述；說明",
  focus: "使專注於", recycle: "回收再利用；使再循環", injure: "使受傷；損害",
  hurt: "傷害；使受傷", object: "物體；目的；對象", subject: "主題；學科；實驗對象",
  conference: "會議；協商會", handout: "講義；分發資料", application: "申請；申請表",
  "human resources": "人力資源；人事部門", certificate: "證明書；結業證書；執照",
  category: "類別；範疇", consumption: "消費；消耗量", strategy: "策略；計畫",
  instruction: "指示；使用說明", contestant: "參賽者", laundry: "待洗衣物；洗衣店",
  stationery: "文具；辦公用品", cardboard: "厚紙板；瓦楞紙", auction: "拍賣；競價出售",
  extent: "程度；範圍；限度", vitality: "活力；朝氣；生命力", adjust: "調整；校準",
  puzzle: "使困惑；使窘迫", upset: "使心煩意亂", admire: "欣賞；高度評價",
  attract: "吸引；引起注意", illustrate: "說明；以實例證明", expose: "使暴露於",
  combine: "結合；聯合", cooperate: "合作；協力", mention: "提及；說出",
  dynamic: "有活力的；強而有力的", influential: "有影響力的", ambitious: "有抱負的；雄心勃勃的",
  apprentice: "學徒；實習生", auditor: "稽核員；審計人員", supervisor: "主管；監督人員",
  patron: "贊助者；顧客", premium: "保險費；額外費用", bid: "投標；出價",
  debtor: "債務人；借方", domain: "領域；範圍；領土", scrutiny: "仔細審查",
  "tax break": "所得稅減免；減稅措施", procurement: "採購；取得", leaflet: "廣告傳單；單張印刷品",
  accommodation: "住宿；住宿設施", voucher: "優惠券；兌換券", appliance: "器具；家電",
  dairy: "乳製品；乳品店", leftover: "剩餘物；剩菜", excursion: "短途旅行；小旅行",
  discretion: "決定權；自行斟酌", dimension: "層面；尺寸", discipline: "紀律；訓練",
  disruption: "中斷；混亂", strain: "壓力；過度勞累", textile: "紡織品；布料",
  casualty: "死傷者；受害者", transit: "運輸；轉乘；通過", shortcoming: "缺點；不足之處",
  recess: "休息；休會", recession: "經濟衰退；不景氣", involvement: "參與；牽連",
  lessen: "減輕；減少", dwindle: "逐漸減少；縮小", allot: "分配；配給",
  extract: "取出；提取", detect: "察覺；發現", accelerate: "加速；促進",
  redeem: "償還；彌補；兌換", assert: "聲明；主張", facilitate: "促進；使容易",
  define: "定義；明確說明", lengthen: "延長；加長", revoke: "撤銷；使失效",
  jeopardize: "危及；使陷入險境", withstand: "承受；抵擋", disgust: "使反感；使厭惡",
  conceive: "構想；想出", suspend: "暫停；使停職", tangle: "使糾纏；使混亂",
  expire: "到期；終止", rampant: "猖獗的；蔓延的", inaugural: "就職的；開幕的；首次的",
  interim: "暫時的；過渡期間的", overhead: "經常性支出；管理費用", unanimously: "全體一致地",
  shabby: "破舊的；衣衫襤褸的", "more or less": "大約；差不多", "in a nutshell": "簡而言之；總之",
}));

function normalizeMeaning(word, meaning) {
  return meaningCorrections.get(word.toLowerCase()) ?? meaning.replaceAll("〔", "（").replaceAll("〕", "）").trim();
}

function primaryMeaning(meaning) {
  return meaning.split("；")[0].replace(/（[^）]*）/g, "").trim();
}

function hash(value) {
  return [...value].reduce((total, character) => total + character.codePointAt(0), 0);
}

function contextualExample(word, meaning, pos) {
  const choice = hash(word) % 3;
  const primary = primaryMeaning(meaning);
  if (pos.includes("phr") || word.includes(" ")) {
    const english = [
      `The manager used the phrase "${word}" while explaining the schedule to the client.`,
      `During the meeting, the supervisor said "${word}" to clarify the situation.`,
      `The customer used the expression "${word}" when discussing the service request.`,
    ][choice];
    const chinese = [
      `經理向客戶說明行程時，使用了「${word}」這個表示「${primary}」的片語。`,
      `會議中，主管以「${word}」表達「${primary}」，藉此說明當時的情況。`,
      `顧客討論服務需求時，以「${word}」表達「${primary}」。`,
    ][choice];
    return { english, chinese };
  }
  if (pos.includes("adv")) {
    return {
      english: `The project team responded ${word} when the delivery schedule changed.`,
      chinese: `交貨時程改變時，專案團隊以${primary.replace(/地$/, "")}的方式回應。`,
    };
  }
  if (pos.includes("adj")) {
    return {
      english: `The review committee considered the revised proposal ${word}.`,
      chinese: `審查委員會認為修改後的提案是${primary}。`,
    };
  }
  if (pos.startsWith("v") || (!pos.includes("n") && pos.includes("v"))) {
    return {
      english: `The report explains how the team should ${word} before the deadline.`,
      chinese: `報告說明團隊應在期限前完成與${primary}相關的工作。`,
    };
  }
  if (personNouns.has(word.toLowerCase()) || /(人|員|者|師|秘書|經理|主管|上司|雇主|董事|顧客|客戶|同事|代表|主任|主席|職員|工$)/.test(meaning)) {
    return {
      english: `The ${word} joined the department meeting to discuss the new schedule.`,
      chinese: `這位${primary}參加部門會議，討論新的時程。`,
    };
  }
  if (/(文件|報告|表格|表$|請款單|發票|收據|合約|契約|票券|信件|通知|資料|紀錄)/.test(meaning)) {
    return {
      english: `The manager reviewed the ${word} before approving it.`,
      chinese: `經理在核准前，先檢查了這份${primary}。`,
    };
  }
  if (/(費用|成本|價格|預算|薪資|收入|支出|收益|利潤|款項|津貼)/.test(meaning)) {
    return {
      english: `The finance team checked the ${word} before closing the monthly accounts.`,
      chinese: `財務團隊在月結前核對了${primary}。`,
    };
  }
  if (/(會議|典禮|期限|行程|預約|假期|面試)/.test(meaning)) {
    return {
      english: `The team confirmed the ${word} by email yesterday.`,
      chinese: `團隊昨天透過電子郵件確認了${primary}。`,
    };
  }
  const english = [
    `The ${word} was discussed during Monday's management meeting.`,
    `The manager mentioned the ${word} in the revised business report.`,
    `The team reviewed the ${word} before making a final decision.`,
  ][choice];
  const chinese = [
    `星期一的管理會議中討論了${primary}。`,
    `經理在修改後的商務報告中提到了${primary}。`,
    `團隊在作出最終決定前檢視了${primary}。`,
  ][choice];
  return { english, chinese };
}

for (const file of files) {
  const output = fs.readFileSync(file, "utf8").split("\n").flatMap((line) => {
    if (!line.trimStart().startsWith("{ word:")) return [line];
    const read = (field) => {
      const match = line.match(new RegExp(`${field}: "((?:\\\\.|[^"\\\\])*)"`));
      return match ? JSON.parse(`"${match[1]}"`) : "";
    };
    const word = read("word");
    if (invalidOcrFragments.has(word.toLowerCase())) return [];
    const meaning = normalizeMeaning(word, read("meaning"));
    const pos = nounCorrections.has(word.toLowerCase()) ? "n." : read("pos");
    const level = read("level");
    const { english, chinese } = contextualExample(word, meaning, pos);
    return [`  { word: ${JSON.stringify(word)}, meaning: ${JSON.stringify(meaning)}, pos: ${JSON.stringify(pos)}, example: ${JSON.stringify(english)}, exampleZh: ${JSON.stringify(chinese)}, level: ${JSON.stringify(level)} },`];
  });
  fs.writeFileSync(file, output.join("\n"));
}
