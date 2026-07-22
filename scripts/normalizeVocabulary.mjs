import fs from "node:fs";

const files = ["app/page.tsx", "app/pdfWords.ts"];
const invalidOcrFragments = new Set(["al", "ne", "ud", "id", "ay", "ad", "an", "te", "se", "ge", "ak", "mentary", "ging", "tach", "rug ing", "from his behavior that he would", "the iranian minister met with his french"]);
const wordCorrections = new Map(Object.entries({
  "leather i": "leather", "separate i": "separate", "be willing to v": "be willing to",
  "as well as b": "as well as", "forward to": "look forward to", "get lost i": "get lost",
  "in full b": "in full", "last last": "last", "await lo'wet": "await", "associate t": "associate",
  "clare dike": "declare", "permit t": "permit", "feel free to v bee": "feel free to",
  "ay off lay off": "lay off", "take one place take the place of": "take the place of",
  "bachelor degree": "bachelor's degree", "insult i": "insult", "yield gild": "yield",
  "ample t'amp": "ample", "prevalent i prevalent": "prevalent", "well on": "dwell on",
}));
const phraseExamples = new Map(Object.entries({
  "along with": ["Please submit the receipt along with the expense report.", "請將收據連同費用報告一併提交。"],
  "at least": ["Please arrive at least fifteen minutes before the interview.", "請至少在面試前十五分鐘抵達。"],
  "be willing to": ["Applicants must be willing to travel on short notice.", "應徵者必須願意在臨時通知後出差。"],
  "as well as": ["The package includes installation as well as technical support.", "此方案除了安裝服務，也包含技術支援。"],
  "take place": ["The annual conference will take place in Taipei next month.", "年度研討會將於下個月在台北舉行。"],
  "look forward to": ["We look forward to working with your company.", "我們期待與貴公司合作。"],
  "in the long run": ["The new system will reduce operating costs in the long run.", "長遠來看，新系統將降低營運成本。"],
  "leave behind": ["Please check the room so that you do not leave anything behind.", "請檢查房間，以免遺落任何物品。"],
  "by oneself": ["The trainee completed the assignment by herself.", "這位實習生獨自完成了任務。"],
  "all the way": ["The client traveled all the way from Kaohsiung for the meeting.", "客戶從高雄遠道而來參加會議。"],
  "in full": ["The invoice must be paid in full by Friday.", "這張發票必須在星期五前全額付清。"],
  "look back": ["Looking back, the manager believes the expansion was successful.", "回顧過去，經理認為這次擴展相當成功。"],
  "before long": ["The renovated store will reopen before long.", "整修後的商店不久就會重新開幕。"],
  "believe it or not": ["Believe it or not, sales doubled within one month.", "信不信由你，銷售額在一個月內增加了一倍。"],
  "get along with": ["She gets along with everyone in the department.", "她和部門裡的每個人都相處融洽。"],
  "feel free to": ["Feel free to contact us if you have any questions.", "如有任何問題，歡迎隨時與我們聯絡。"],
  "first of all": ["First of all, please review the revised contract.", "首先，請先檢查修改後的合約。"],
  "take the trouble to": ["Thank you for taking the trouble to update the report.", "感謝你特地更新這份報告。"],
  "make a living": ["She makes a living by providing translation services.", "她靠提供翻譯服務維生。"],
  "lay off": ["The company does not plan to lay off any employees.", "公司目前沒有裁員計畫。"],
  "look into": ["The support team will look into the billing error immediately.", "客服團隊會立即調查帳務錯誤。"],
  "on the whole": ["On the whole, customers were satisfied with the new service.", "整體而言，顧客對新服務感到滿意。"],
  "on behalf of": ["I would like to thank you on behalf of the entire team.", "我謹代表整個團隊向你致謝。"],
  "take into account": ["We must take shipping costs into account when setting the price.", "訂定價格時，我們必須把運費納入考量。"],
  "more or less": ["The renovation is more or less complete.", "整修工程大致上已經完成。"],
  "take the place of": ["Online forms will take the place of paper applications.", "線上表單將取代紙本申請書。"],
  "regardless of": ["The policy applies to all employees regardless of position.", "無論職位為何，這項政策適用於所有員工。"],
  "no later than": ["Please submit your application no later than June 30.", "請最晚於六月三十日前提交申請。"],
  "call it a day": ["We finished the urgent orders and decided to call it a day.", "我們完成緊急訂單後，決定結束今天的工作。"],
  "call in sick": ["Employees should notify their supervisor when they call in sick.", "員工請病假時應通知主管。"],
  "live up to": ["The new product lived up to our customers' expectations.", "新產品沒有辜負顧客的期待。"],
  "let up": ["The delivery resumed when the heavy rain finally let up.", "大雨終於減弱後，配送工作恢復了。"],
  "in a nutshell": ["In a nutshell, the proposal will save both time and money.", "簡而言之，這項提案能同時節省時間與金錢。"],
  "rule out": ["The technician ruled out a hardware problem.", "技術人員排除了硬體故障的可能性。"],
  "around the clock": ["The support team worked around the clock to restore the service.", "支援團隊夜以繼日地工作，以恢復服務。"],
  "not that i know of": ["“Not that I know of,” she replied when asked about the delay.", "被問到是否有延誤時，她回答：「據我所知沒有。」"],
  "dwell on": ["The manager advised the team not to dwell on a minor mistake.", "經理建議團隊不要一直糾結於小錯誤。"],
  "bachelor's degree": ["Applicants for this position must have a bachelor's degree.", "這個職位的應徵者必須具備學士學位。"],
}));
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
  const phraseExample = phraseExamples.get(word.toLowerCase());
  if (phraseExample) return { english: phraseExample[0], chinese: phraseExample[1] };
  if (pos.includes("phr")) {
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
    if (/(就職|開幕|首次)/.test(meaning)) {
      return {
        english: `The company held its ${word} conference in Taipei.`,
        chinese: `公司在台北舉辦了首次會議。`,
      };
    }
    if (/(財務|費用|價格|成本|獲利|昂貴|便宜|經濟|收入)/.test(meaning)) {
      return {
        english: `The finance team found the revised estimate ${word}.`,
        chinese: `財務團隊認為修改後的估算是${primary}。`,
      };
    }
    if (/(臨時|暫時|即將|延遲|準時|定期|每年|每月|每日|連續)/.test(meaning)) {
      return {
        english: `The manager confirmed that the new schedule was ${word}.`,
        chinese: `經理確認新的時程是${primary}。`,
      };
    }
    return {
      english: `The committee described the revised proposal as ${word}.`,
      chinese: `委員會認為修改後的提案是${primary}。`,
    };
  }
  if (pos.startsWith("v") || (!pos.includes("n") && pos.includes("v"))) {
    if (/(抵達|到達|離開|出發|返回|旅行|通勤|移動|前往)/.test(meaning)) {
      return {
        english: `The delivery team expects to ${word} before noon.`,
        chinese: `配送團隊預計在中午前${primary}。`,
      };
    }
    if (/(增加|減少|上升|下降|波動|成長|惡化|改善|擴大|縮小)/.test(meaning)) {
      return {
        english: `Sales may ${word} after the company changes its pricing policy.`,
        chinese: `公司調整定價政策後，銷售表現可能會${primary}。`,
      };
    }
    if (/(批准|確認|檢查|審查|評估|修改|更新|完成|處理|提交|簽署|取消|安排|準備|提供)/.test(meaning)) {
      return {
        english: `The manager will ${word} the request before Friday's deadline.`,
        chinese: `經理會在星期五截止前${primary}這項申請。`,
      };
    }
    return {
      english: `The training manual explains when employees should ${word}.`,
      chinese: `訓練手冊說明員工應在何時${primary}。`,
    };
  }
  if (personNouns.has(word.toLowerCase()) || /(人員|員工|者|師|秘書|經理|主管|上司|雇主|董事|顧客|客戶|同事|代表|主任|主席|職員|工$)/.test(meaning)) {
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
  if (/(設備|機器|器具|用品|產品|商品|材料|皮革|紡織|零件|庫存|貨物|包裹)/.test(meaning)) {
    return {
      english: `The staff inspected the ${word} before it was sent to the customer.`,
      chinese: `工作人員在送交顧客前檢查了${primary}。`,
    };
  }
  if (/(飯店|機場|車站|辦公室|分公司|分店|倉庫|工廠|會場|場所|設施|餐廳)/.test(meaning)) {
    return {
      english: `The company renovated the ${word} before the busy season began.`,
      chinese: `公司在旺季開始前整修了${primary}。`,
    };
  }
  if (/(運送|運輸|航班|班機|車票|機票|旅館|住宿|旅程|旅行|觀光)/.test(meaning)) {
    return {
      english: `The travel coordinator confirmed the ${word} before the business trip.`,
      chinese: `差旅專員在出差前確認了${primary}。`,
    };
  }
  if (/(顧客服務|服務|需求|要求|意見|投訴|抱怨|回饋|滿意度)/.test(meaning)) {
    return {
      english: `The customer service team discussed the ${word} during its morning briefing.`,
      chinese: `客服團隊在晨會中討論了${primary}。`,
    };
  }
  if (word.includes(" ")) {
    return {
      english: `The report included updated information about ${word}.`,
      chinese: `報告納入了關於${primary}的最新資訊。`,
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
    const rawWord = read("word");
    if (invalidOcrFragments.has(rawWord.toLowerCase())) return [];
    const word = wordCorrections.get(rawWord.toLowerCase()) ?? rawWord;
    const meaning = normalizeMeaning(word, read("meaning"));
    const pos = nounCorrections.has(word.toLowerCase()) ? "n." : read("pos");
    const level = read("level");
    const { english, chinese } = contextualExample(word, meaning, pos);
    return [`  { word: ${JSON.stringify(word)}, meaning: ${JSON.stringify(meaning)}, pos: ${JSON.stringify(pos)}, example: ${JSON.stringify(english)}, exampleZh: ${JSON.stringify(chinese)}, level: ${JSON.stringify(level)} },`];
  });
  fs.writeFileSync(file, output.join("\n"));
}
