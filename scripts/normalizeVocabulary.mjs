import fs from "node:fs";

const files = ["app/page.tsx", "app/pdfWords.ts"];
const invalidOcrFragments = new Set(["al", "ne", "ud", "id", "ay", "ad", "an", "te", "se", "ge", "ak", "mentary"]);
const nounCorrections = new Set(["secretary", "editor", "consumer", "warning", "container", "explanation", "quantity", "anniversary", "subsidiary", "itinerary"]);
const personNouns = new Set(["editor"]);

function hash(value) {
  return [...value].reduce((total, character) => total + character.codePointAt(0), 0);
}

function contextualExample(word, meaning, pos) {
  const choice = hash(word) % 3;
  if (pos.includes("phr") || word.includes(" ")) {
    const english = [
      `The manager used the phrase "${word}" while explaining the schedule to the client.`,
      `During the meeting, the supervisor said "${word}" to clarify the situation.`,
      `The customer used the expression "${word}" when discussing the service request.`,
    ][choice];
    const chinese = [
      `經理向客戶說明行程時，使用了「${word}（${meaning}）」這個片語。`,
      `會議中，主管用「${word}（${meaning}）」說明當時的情況。`,
      `顧客討論服務需求時，使用了「${word}（${meaning}）」這個說法。`,
    ][choice];
    return { english, chinese };
  }
  if (pos.includes("adv")) {
    return {
      english: `The project team responded ${word} when the delivery schedule changed.`,
      chinese: `交貨時程改變時，專案團隊以「${meaning}」的方式作出回應。`,
    };
  }
  if (pos.includes("adj")) {
    return {
      english: `The review committee considered the revised proposal ${word}.`,
      chinese: `審查委員會認為修改後的提案是「${meaning}」的。`,
    };
  }
  if (pos.startsWith("v") || (!pos.includes("n") && pos.includes("v"))) {
    return {
      english: `The report explains how the team should ${word} before the deadline.`,
      chinese: `報告說明團隊應如何在期限前「${meaning}」。`,
    };
  }
  if (personNouns.has(word.toLowerCase()) || /(人|員|者|師|秘書|經理|主管|上司|雇主|董事|顧客|客戶|同事|代表|主任|主席|職員|工$)/.test(meaning)) {
    return {
      english: `The ${word} joined the department meeting to discuss the new schedule.`,
      chinese: `這位「${meaning}」參加部門會議，討論新的時程。`,
    };
  }
  if (/(文件|報告|表格|表$|請款單|發票|收據|合約|契約|票券|信件|通知|資料|紀錄)/.test(meaning)) {
    return {
      english: `The manager reviewed the ${word} before approving it.`,
      chinese: `經理核准前先檢查了這份「${meaning}」。`,
    };
  }
  if (/(費用|成本|價格|預算|薪資|收入|支出|收益|利潤|款項|津貼)/.test(meaning)) {
    return {
      english: `The finance team checked the ${word} before closing the monthly accounts.`,
      chinese: `財務團隊在月結前核對了「${meaning}」。`,
    };
  }
  if (/(會議|典禮|期限|行程|預約|假期|面試)/.test(meaning)) {
    return {
      english: `The team confirmed the ${word} by email yesterday.`,
      chinese: `團隊昨天透過電子郵件確認了「${meaning}」。`,
    };
  }
  const english = [
    `The ${word} was discussed during Monday's management meeting.`,
    `The manager mentioned the ${word} in the revised business report.`,
    `The team reviewed the ${word} before making a final decision.`,
  ][choice];
  const chinese = [
    `星期一的管理會議中討論了「${meaning}」。`,
    `經理在修改後的商務報告中提到了「${meaning}」。`,
    `團隊在作出最終決定前檢視了「${meaning}」。`,
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
    const meaning = read("meaning");
    const pos = nounCorrections.has(word.toLowerCase()) ? "n." : read("pos");
    const level = read("level");
    const { english, chinese } = contextualExample(word, meaning, pos);
    return [`  { word: ${JSON.stringify(word)}, meaning: ${JSON.stringify(meaning)}, pos: ${JSON.stringify(pos)}, example: ${JSON.stringify(english)}, exampleZh: ${JSON.stringify(chinese)}, level: ${JSON.stringify(level)} },`];
  });
  fs.writeFileSync(file, output.join("\n"));
}
