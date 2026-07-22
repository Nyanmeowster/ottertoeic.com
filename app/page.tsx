"use client";

import { useEffect, useMemo, useState } from "react";
import { PDF_WORDS } from "./pdfWords";

type Level = "基礎" | "中階" | "進階";
type Mastery = "mastered" | "learning" | "new";
export type Word = { word: string; meaning: string; pos: string; example: string; exampleZh: string; level: Level };
type Memory = Word & { correct: boolean; mastery: Mastery; attempts: number };

const WORDS: Word[] = [
  { word: "agenda", meaning: "議程", pos: "n.", example: "The team reviewed the agenda before making a final decision.", exampleZh: "團隊在作出最終決定前檢視了「議程」。", level: "基礎" },
  { word: "applicant", meaning: "申請人", pos: "n.", example: "The applicant joined the department meeting to discuss the new schedule.", exampleZh: "這位「申請人」參加部門會議，討論新的時程。", level: "基礎" },
  { word: "confirm", meaning: "確認", pos: "v.", example: "The report explains how the team should confirm before the deadline.", exampleZh: "報告說明團隊應如何在期限前「確認」。", level: "基礎" },
  { word: "deadline", meaning: "截止期限", pos: "n.", example: "The team confirmed the deadline by email yesterday.", exampleZh: "團隊昨天透過電子郵件確認了「截止期限」。", level: "基礎" },
  { word: "employee", meaning: "員工", pos: "n.", example: "The employee joined the department meeting to discuss the new schedule.", exampleZh: "這位「員工」參加部門會議，討論新的時程。", level: "基礎" },
  { word: "equipment", meaning: "設備", pos: "n.", example: "The equipment was discussed during Monday's management meeting.", exampleZh: "星期一的管理會議中討論了「設備」。", level: "基礎" },
  { word: "invoice", meaning: "發票；請款單", pos: "n.", example: "The manager reviewed the invoice before approving it.", exampleZh: "經理核准前先檢查了這份「發票；請款單」。", level: "基礎" },
  { word: "purchase", meaning: "購買", pos: "v./n.", example: "The report explains how the team should purchase before the deadline.", exampleZh: "報告說明團隊應如何在期限前「購買」。", level: "基礎" },
  { word: "schedule", meaning: "行程；安排", pos: "n./v.", example: "The team confirmed the schedule by email yesterday.", exampleZh: "團隊昨天透過電子郵件確認了「行程；安排」。", level: "基礎" },
  { word: "vacancy", meaning: "職缺；空位", pos: "n.", example: "The vacancy was discussed during Monday's management meeting.", exampleZh: "星期一的管理會議中討論了「職缺；空位」。", level: "基礎" },
  { word: "accommodate", meaning: "容納；提供住宿", pos: "v.", example: "The report explains how the team should accommodate before the deadline.", exampleZh: "報告說明團隊應如何在期限前「容納；提供住宿」。", level: "中階" },
  { word: "authorize", meaning: "授權；批准", pos: "v.", example: "The report explains how the team should authorize before the deadline.", exampleZh: "報告說明團隊應如何在期限前「授權；批准」。", level: "中階" },
  { word: "complimentary", meaning: "免費贈送的", pos: "adj.", example: "The review committee considered the revised proposal complimentary.", exampleZh: "審查委員會認為修改後的提案是「免費贈送的」的。", level: "中階" },
  { word: "compliance", meaning: "遵守；依從", pos: "n.", example: "The manager mentioned the compliance in the revised business report.", exampleZh: "經理在修改後的商務報告中提到了「遵守；依從」。", level: "中階" },
  { word: "eligible", meaning: "符合資格的", pos: "adj.", example: "The review committee considered the revised proposal eligible.", exampleZh: "審查委員會認為修改後的提案是「符合資格的」的。", level: "中階" },
  { word: "fluctuate", meaning: "波動", pos: "v.", example: "The report explains how the team should fluctuate before the deadline.", exampleZh: "報告說明團隊應如何在期限前「波動」。", level: "中階" },
  { word: "inventory", meaning: "庫存", pos: "n.", example: "The manager mentioned the inventory in the revised business report.", exampleZh: "經理在修改後的商務報告中提到了「庫存」。", level: "中階" },
  { word: "negotiate", meaning: "協商", pos: "v.", example: "The report explains how the team should negotiate before the deadline.", exampleZh: "報告說明團隊應如何在期限前「協商」。", level: "中階" },
  { word: "reimburse", meaning: "償還；報銷", pos: "v.", example: "The report explains how the team should reimburse before the deadline.", exampleZh: "報告說明團隊應如何在期限前「償還；報銷」。", level: "中階" },
  { word: "tentative", meaning: "暫定的", pos: "adj.", example: "The review committee considered the revised proposal tentative.", exampleZh: "審查委員會認為修改後的提案是「暫定的」的。", level: "中階" },
  { word: "alleviate", meaning: "減輕；緩和", pos: "v.", example: "The report explains how the team should alleviate before the deadline.", exampleZh: "報告說明團隊應如何在期限前「減輕；緩和」。", level: "進階" },
  { word: "contingency", meaning: "突發狀況；應變措施", pos: "n.", example: "The contingency was discussed during Monday's management meeting.", exampleZh: "星期一的管理會議中討論了「突發狀況；應變措施」。", level: "進階" },
  { word: "deteriorate", meaning: "惡化", pos: "v.", example: "The report explains how the team should deteriorate before the deadline.", exampleZh: "報告說明團隊應如何在期限前「惡化」。", level: "進階" },
  { word: "discrepancy", meaning: "差異；不一致", pos: "n.", example: "The discrepancy was discussed during Monday's management meeting.", exampleZh: "星期一的管理會議中討論了「差異；不一致」。", level: "進階" },
  { word: "expedite", meaning: "加速；促進", pos: "v.", example: "The report explains how the team should expedite before the deadline.", exampleZh: "報告說明團隊應如何在期限前「加速；促進」。", level: "進階" },
  { word: "feasible", meaning: "可行的", pos: "adj.", example: "The review committee considered the revised proposal feasible.", exampleZh: "審查委員會認為修改後的提案是「可行的」的。", level: "進階" },
  { word: "inadvertently", meaning: "不經意地", pos: "adv.", example: "The project team responded inadvertently when the delivery schedule changed.", exampleZh: "交貨時程改變時，專案團隊以「不經意地」的方式作出回應。", level: "進階" },
  { word: "lucrative", meaning: "獲利豐厚的", pos: "adj.", example: "The review committee considered the revised proposal lucrative.", exampleZh: "審查委員會認為修改後的提案是「獲利豐厚的」的。", level: "進階" },
  { word: "prerequisite", meaning: "先決條件", pos: "n.", example: "The prerequisite was discussed during Monday's management meeting.", exampleZh: "星期一的管理會議中討論了「先決條件」。", level: "進階" },
  { word: "streamline", meaning: "精簡；使更有效率", pos: "v.", example: "The report explains how the team should streamline before the deadline.", exampleZh: "報告說明團隊應如何在期限前「精簡；使更有效率」。", level: "進階" },
  { word: "appointment", meaning: "約會；預約", pos: "n.", example: "The team confirmed the appointment by email yesterday.", exampleZh: "團隊昨天透過電子郵件確認了「約會；預約」。", level: "基礎" },
  { word: "branch", meaning: "分公司；分店", pos: "n.", example: "The manager mentioned the branch in the revised business report.", exampleZh: "經理在修改後的商務報告中提到了「分公司；分店」。", level: "基礎" },
  { word: "budget", meaning: "預算", pos: "n.", example: "The finance team checked the budget before closing the monthly accounts.", exampleZh: "財務團隊在月結前核對了「預算」。", level: "基礎" },
  { word: "cancel", meaning: "取消", pos: "v.", example: "The report explains how the team should cancel before the deadline.", exampleZh: "報告說明團隊應如何在期限前「取消」。", level: "基礎" },
  { word: "candidate", meaning: "候選人", pos: "n.", example: "The candidate joined the department meeting to discuss the new schedule.", exampleZh: "這位「候選人」參加部門會議，討論新的時程。", level: "基礎" },
  { word: "client", meaning: "客戶", pos: "n.", example: "The client joined the department meeting to discuss the new schedule.", exampleZh: "這位「客戶」參加部門會議，討論新的時程。", level: "基礎" },
  { word: "contract", meaning: "合約", pos: "n.", example: "The manager reviewed the contract before approving it.", exampleZh: "經理核准前先檢查了這份「合約」。", level: "基礎" },
  { word: "customer", meaning: "顧客", pos: "n.", example: "The customer joined the department meeting to discuss the new schedule.", exampleZh: "這位「顧客」參加部門會議，討論新的時程。", level: "基礎" },
  { word: "deliver", meaning: "運送；交付", pos: "v.", example: "The report explains how the team should deliver before the deadline.", exampleZh: "報告說明團隊應如何在期限前「運送；交付」。", level: "基礎" },
  { word: "department", meaning: "部門", pos: "n.", example: "The team reviewed the department before making a final decision.", exampleZh: "團隊在作出最終決定前檢視了「部門」。", level: "基礎" },
  { word: "discount", meaning: "折扣", pos: "n.", example: "The discount was discussed during Monday's management meeting.", exampleZh: "星期一的管理會議中討論了「折扣」。", level: "基礎" },
  { word: "document", meaning: "文件", pos: "n.", example: "The manager reviewed the document before approving it.", exampleZh: "經理核准前先檢查了這份「文件」。", level: "基礎" },
  { word: "facility", meaning: "設施；場所", pos: "n.", example: "The manager mentioned the facility in the revised business report.", exampleZh: "經理在修改後的商務報告中提到了「設施；場所」。", level: "基礎" },
  { word: "fee", meaning: "費用", pos: "n.", example: "The finance team checked the fee before closing the monthly accounts.", exampleZh: "財務團隊在月結前核對了「費用」。", level: "基礎" },
  { word: "manager", meaning: "經理", pos: "n.", example: "The manager joined the department meeting to discuss the new schedule.", exampleZh: "這位「經理」參加部門會議，討論新的時程。", level: "基礎" },
  { word: "meeting", meaning: "會議", pos: "n.", example: "The team confirmed the meeting by email yesterday.", exampleZh: "團隊昨天透過電子郵件確認了「會議」。", level: "基礎" },
  { word: "order", meaning: "訂單；訂購", pos: "n./v.", example: "The order was discussed during Monday's management meeting.", exampleZh: "星期一的管理會議中討論了「訂單；訂購」。", level: "基礎" },
  { word: "payment", meaning: "付款", pos: "n.", example: "The manager mentioned the payment in the revised business report.", exampleZh: "經理在修改後的商務報告中提到了「付款」。", level: "基礎" },
  { word: "product", meaning: "產品", pos: "n.", example: "The manager mentioned the product in the revised business report.", exampleZh: "經理在修改後的商務報告中提到了「產品」。", level: "基礎" },
  { word: "receipt", meaning: "收據", pos: "n.", example: "The manager reviewed the receipt before approving it.", exampleZh: "經理核准前先檢查了這份「收據」。", level: "基礎" },
  { word: "report", meaning: "報告", pos: "n.", example: "The manager reviewed the report before approving it.", exampleZh: "經理核准前先檢查了這份「報告」。", level: "基礎" },
  { word: "reserve", meaning: "預訂；保留", pos: "v.", example: "The report explains how the team should reserve before the deadline.", exampleZh: "報告說明團隊應如何在期限前「預訂；保留」。", level: "基礎" },
  { word: "salary", meaning: "薪資", pos: "n.", example: "The finance team checked the salary before closing the monthly accounts.", exampleZh: "財務團隊在月結前核對了「薪資」。", level: "基礎" },
  { word: "shipment", meaning: "貨物；出貨", pos: "n.", example: "The team reviewed the shipment before making a final decision.", exampleZh: "團隊在作出最終決定前檢視了「貨物；出貨」。", level: "基礎" },
  { word: "staff", meaning: "全體員工", pos: "n.", example: "The staff joined the department meeting to discuss the new schedule.", exampleZh: "這位「全體員工」參加部門會議，討論新的時程。", level: "基礎" },
  { word: "supplier", meaning: "供應商", pos: "n.", example: "The team reviewed the supplier before making a final decision.", exampleZh: "團隊在作出最終決定前檢視了「供應商」。", level: "基礎" },
  { word: "training", meaning: "訓練", pos: "n.", example: "The team reviewed the training before making a final decision.", exampleZh: "團隊在作出最終決定前檢視了「訓練」。", level: "基礎" },
  { word: "travel", meaning: "旅行；出差", pos: "n./v.", example: "The travel was discussed during Monday's management meeting.", exampleZh: "星期一的管理會議中討論了「旅行；出差」。", level: "基礎" },
  { word: "update", meaning: "更新", pos: "n./v.", example: "The manager mentioned the update in the revised business report.", exampleZh: "經理在修改後的商務報告中提到了「更新」。", level: "基礎" },
  { word: "warehouse", meaning: "倉庫", pos: "n.", example: "The manager mentioned the warehouse in the revised business report.", exampleZh: "經理在修改後的商務報告中提到了「倉庫」。", level: "基礎" },
  { word: "allocate", meaning: "分配", pos: "v.", example: "The report explains how the team should allocate before the deadline.", exampleZh: "報告說明團隊應如何在期限前「分配」。", level: "中階" },
  { word: "anticipate", meaning: "預期", pos: "v.", example: "The report explains how the team should anticipate before the deadline.", exampleZh: "報告說明團隊應如何在期限前「預期」。", level: "中階" },
  { word: "approximately", meaning: "大約", pos: "adv.", example: "The project team responded approximately when the delivery schedule changed.", exampleZh: "交貨時程改變時，專案團隊以「大約」的方式作出回應。", level: "中階" },
  { word: "assess", meaning: "評估", pos: "v.", example: "The report explains how the team should assess before the deadline.", exampleZh: "報告說明團隊應如何在期限前「評估」。", level: "中階" },
  { word: "capacity", meaning: "容量；能力", pos: "n.", example: "The capacity was discussed during Monday's management meeting.", exampleZh: "星期一的管理會議中討論了「容量；能力」。", level: "中階" },
  { word: "collaborate", meaning: "合作", pos: "v.", example: "The report explains how the team should collaborate before the deadline.", exampleZh: "報告說明團隊應如何在期限前「合作」。", level: "中階" },
  { word: "commence", meaning: "開始", pos: "v.", example: "The report explains how the team should commence before the deadline.", exampleZh: "報告說明團隊應如何在期限前「開始」。", level: "中階" },
  { word: "compensation", meaning: "薪酬；補償", pos: "n.", example: "The compensation was discussed during Monday's management meeting.", exampleZh: "星期一的管理會議中討論了「薪酬；補償」。", level: "中階" },
  { word: "consecutive", meaning: "連續的", pos: "adj.", example: "The review committee considered the revised proposal consecutive.", exampleZh: "審查委員會認為修改後的提案是「連續的」的。", level: "中階" },
  { word: "constraint", meaning: "限制；約束", pos: "n.", example: "The manager mentioned the constraint in the revised business report.", exampleZh: "經理在修改後的商務報告中提到了「限制；約束」。", level: "中階" },
  { word: "convenient", meaning: "方便的", pos: "adj.", example: "The review committee considered the revised proposal convenient.", exampleZh: "審查委員會認為修改後的提案是「方便的」的。", level: "中階" },
  { word: "coordinate", meaning: "協調", pos: "v.", example: "The report explains how the team should coordinate before the deadline.", exampleZh: "報告說明團隊應如何在期限前「協調」。", level: "中階" },
  { word: "deduct", meaning: "扣除", pos: "v.", example: "The report explains how the team should deduct before the deadline.", exampleZh: "報告說明團隊應如何在期限前「扣除」。", level: "中階" },
  { word: "defective", meaning: "有缺陷的", pos: "adj.", example: "The review committee considered the revised proposal defective.", exampleZh: "審查委員會認為修改後的提案是「有缺陷的」的。", level: "中階" },
  { word: "designate", meaning: "指定", pos: "v.", example: "The report explains how the team should designate before the deadline.", exampleZh: "報告說明團隊應如何在期限前「指定」。", level: "中階" },
  { word: "distribute", meaning: "分發；配送", pos: "v.", example: "The report explains how the team should distribute before the deadline.", exampleZh: "報告說明團隊應如何在期限前「分發；配送」。", level: "中階" },
  { word: "efficient", meaning: "有效率的", pos: "adj.", example: "The review committee considered the revised proposal efficient.", exampleZh: "審查委員會認為修改後的提案是「有效率的」的。", level: "中階" },
  { word: "estimate", meaning: "估計；估價", pos: "n./v.", example: "The team reviewed the estimate before making a final decision.", exampleZh: "團隊在作出最終決定前檢視了「估計；估價」。", level: "中階" },
  { word: "evaluate", meaning: "評價；評估", pos: "v.", example: "The report explains how the team should evaluate before the deadline.", exampleZh: "報告說明團隊應如何在期限前「評價；評估」。", level: "中階" },
  { word: "exceed", meaning: "超過", pos: "v.", example: "The report explains how the team should exceed before the deadline.", exampleZh: "報告說明團隊應如何在期限前「超過」。", level: "中階" },
  { word: "implement", meaning: "實施", pos: "v.", example: "The report explains how the team should implement before the deadline.", exampleZh: "報告說明團隊應如何在期限前「實施」。", level: "中階" },
  { word: "inquiry", meaning: "詢問", pos: "n.", example: "The team reviewed the inquiry before making a final decision.", exampleZh: "團隊在作出最終決定前檢視了「詢問」。", level: "中階" },
  { word: "maintenance", meaning: "維護；保養", pos: "n.", example: "The maintenance was discussed during Monday's management meeting.", exampleZh: "星期一的管理會議中討論了「維護；保養」。", level: "中階" },
  { word: "mandatory", meaning: "強制的；必要的", pos: "adj.", example: "The review committee considered the revised proposal mandatory.", exampleZh: "審查委員會認為修改後的提案是「強制的；必要的」的。", level: "中階" },
  { word: "modify", meaning: "修改", pos: "v.", example: "The report explains how the team should modify before the deadline.", exampleZh: "報告說明團隊應如何在期限前「修改」。", level: "中階" },
  { word: "notify", meaning: "通知", pos: "v.", example: "The report explains how the team should notify before the deadline.", exampleZh: "報告說明團隊應如何在期限前「通知」。", level: "中階" },
  { word: "postpone", meaning: "延期", pos: "v.", example: "The report explains how the team should postpone before the deadline.", exampleZh: "報告說明團隊應如何在期限前「延期」。", level: "中階" },
  { word: "prohibit", meaning: "禁止", pos: "v.", example: "The report explains how the team should prohibit before the deadline.", exampleZh: "報告說明團隊應如何在期限前「禁止」。", level: "中階" },
  { word: "prospective", meaning: "潛在的；預期的", pos: "adj.", example: "The review committee considered the revised proposal prospective.", exampleZh: "審查委員會認為修改後的提案是「潛在的；預期的」的。", level: "中階" },
  { word: "retain", meaning: "保留；留住", pos: "v.", example: "The report explains how the team should retain before the deadline.", exampleZh: "報告說明團隊應如何在期限前「保留；留住」。", level: "中階" },
  { word: "adjacent", meaning: "相鄰的", pos: "adj.", example: "The review committee considered the revised proposal adjacent.", exampleZh: "審查委員會認為修改後的提案是「相鄰的」的。", level: "進階" },
  { word: "advocate", meaning: "提倡；支持", pos: "v.", example: "The report explains how the team should advocate before the deadline.", exampleZh: "報告說明團隊應如何在期限前「提倡；支持」。", level: "進階" },
  { word: "amend", meaning: "修訂", pos: "v.", example: "The report explains how the team should amend before the deadline.", exampleZh: "報告說明團隊應如何在期限前「修訂」。", level: "進階" },
  { word: "arbitrarily", meaning: "武斷地；任意地", pos: "adv.", example: "The project team responded arbitrarily when the delivery schedule changed.", exampleZh: "交貨時程改變時，專案團隊以「武斷地；任意地」的方式作出回應。", level: "進階" },
  { word: "benchmark", meaning: "基準", pos: "n.", example: "The benchmark was discussed during Monday's management meeting.", exampleZh: "星期一的管理會議中討論了「基準」。", level: "進階" },
  { word: "consolidate", meaning: "合併；鞏固", pos: "v.", example: "The report explains how the team should consolidate before the deadline.", exampleZh: "報告說明團隊應如何在期限前「合併；鞏固」。", level: "進階" },
  { word: "diligent", meaning: "勤勉的", pos: "adj.", example: "The review committee considered the revised proposal diligent.", exampleZh: "審查委員會認為修改後的提案是「勤勉的」的。", level: "進階" },
  { word: "diversify", meaning: "多元化", pos: "v.", example: "The report explains how the team should diversify before the deadline.", exampleZh: "報告說明團隊應如何在期限前「多元化」。", level: "進階" },
  { word: "endorse", meaning: "認可；支持", pos: "v.", example: "The report explains how the team should endorse before the deadline.", exampleZh: "報告說明團隊應如何在期限前「認可；支持」。", level: "進階" },
  { word: "entail", meaning: "牽涉；需要", pos: "v.", example: "The report explains how the team should entail before the deadline.", exampleZh: "報告說明團隊應如何在期限前「牽涉；需要」。", level: "進階" },
  { word: "exemplary", meaning: "典範的；優秀的", pos: "adj.", example: "The review committee considered the revised proposal exemplary.", exampleZh: "審查委員會認為修改後的提案是「典範的；優秀的」的。", level: "進階" },
  { word: "fiscal", meaning: "財政的；會計年度的", pos: "adj.", example: "The review committee considered the revised proposal fiscal.", exampleZh: "審查委員會認為修改後的提案是「財政的；會計年度的」的。", level: "進階" },
  { word: "impending", meaning: "即將發生的", pos: "adj.", example: "The review committee considered the revised proposal impending.", exampleZh: "審查委員會認為修改後的提案是「即將發生的」的。", level: "進階" },
  { word: "incentive", meaning: "獎勵；誘因", pos: "n.", example: "The team reviewed the incentive before making a final decision.", exampleZh: "團隊在作出最終決定前檢視了「獎勵；誘因」。", level: "進階" },
  { word: "incompatible", meaning: "不相容的", pos: "adj.", example: "The review committee considered the revised proposal incompatible.", exampleZh: "審查委員會認為修改後的提案是「不相容的」的。", level: "進階" },
  { word: "indispensable", meaning: "不可或缺的", pos: "adj.", example: "The review committee considered the revised proposal indispensable.", exampleZh: "審查委員會認為修改後的提案是「不可或缺的」的。", level: "進階" },
  { word: "meticulous", meaning: "一絲不苟的", pos: "adj.", example: "The review committee considered the revised proposal meticulous.", exampleZh: "審查委員會認為修改後的提案是「一絲不苟的」的。", level: "進階" },
  { word: "obsolete", meaning: "過時的；淘汰的", pos: "adj.", example: "The review committee considered the revised proposal obsolete.", exampleZh: "審查委員會認為修改後的提案是「過時的；淘汰的」的。", level: "進階" },
  { word: "paramount", meaning: "最重要的", pos: "adj.", example: "The review committee considered the revised proposal paramount.", exampleZh: "審查委員會認為修改後的提案是「最重要的」的。", level: "進階" },
  { word: "plausible", meaning: "合理可信的", pos: "adj.", example: "The review committee considered the revised proposal plausible.", exampleZh: "審查委員會認為修改後的提案是「合理可信的」的。", level: "進階" },
  { word: "proficient", meaning: "熟練的", pos: "adj.", example: "The review committee considered the revised proposal proficient.", exampleZh: "審查委員會認為修改後的提案是「熟練的」的。", level: "進階" },
  { word: "prolonged", meaning: "長期的；延長的", pos: "adj.", example: "The review committee considered the revised proposal prolonged.", exampleZh: "審查委員會認為修改後的提案是「長期的；延長的」的。", level: "進階" },
  { word: "reconcile", meaning: "調和；核對", pos: "v.", example: "The report explains how the team should reconcile before the deadline.", exampleZh: "報告說明團隊應如何在期限前「調和；核對」。", level: "進階" },
  { word: "refrain", meaning: "避免；克制", pos: "v.", example: "The report explains how the team should refrain before the deadline.", exampleZh: "報告說明團隊應如何在期限前「避免；克制」。", level: "進階" },
  { word: "scrutinize", meaning: "仔細審查", pos: "v.", example: "The report explains how the team should scrutinize before the deadline.", exampleZh: "報告說明團隊應如何在期限前「仔細審查」。", level: "進階" },
  { word: "subordinate", meaning: "下屬的；次要的", pos: "adj./n.", example: "The review committee considered the revised proposal subordinate.", exampleZh: "審查委員會認為修改後的提案是「下屬的；次要的」的。", level: "進階" },
  { word: "substantial", meaning: "大量的；可觀的", pos: "adj.", example: "The review committee considered the revised proposal substantial.", exampleZh: "審查委員會認為修改後的提案是「大量的；可觀的」的。", level: "進階" },
  { word: "unprecedented", meaning: "前所未有的", pos: "adj.", example: "The review committee considered the revised proposal unprecedented.", exampleZh: "審查委員會認為修改後的提案是「前所未有的」的。", level: "進階" },
  { word: "viable", meaning: "可行的；能生存的", pos: "adj.", example: "The review committee considered the revised proposal viable.", exampleZh: "審查委員會認為修改後的提案是「可行的；能生存的」的。", level: "進階" },
  { word: "waive", meaning: "免除；放棄", pos: "v.", example: "The report explains how the team should waive before the deadline.", exampleZh: "報告說明團隊應如何在期限前「免除；放棄」。", level: "進階" },
  ...PDF_WORDS,
];
const WORDS_BY_NAME = new Map(WORDS.map((item) => [item.word, item]));

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

Object.setPrototypeOf(AMERICAN_IPA, new Proxy({}, { get: () => "/音標待補/" }));

const LABELS: Record<Mastery, string> = { mastered: "融會貫通", learning: "尚在參悟", new: "尚未入門" };
const BRITISH_IPA_OVERRIDES: Record<string, string> = {
  schedule: "/ˈʃedjuːl/", inventory: "/ˈɪnvəntri/", warehouse: "/ˈweəhaʊs/", purchase: "/ˈpɜːtʃəs/",
  confirm: "/kənˈfɜːm/", reimburse: "/ˌriːɪmˈbɜːs/", inadvertently: "/ˌɪnədˈvɜːtəntli/",
  contract: "/ˈkɒntrækt/", document: "/ˈdɒkjəmənt/", product: "/ˈprɒdʌkt/", approximately: "/əˈprɒksɪmətli/",
  compensation: "/ˌkɒmpənˈseɪʃən/", mandatory: "/ˈmændətəri/", modify: "/ˈmɒdɪfaɪ/",
  postpone: "/pəʊstˈpəʊn/", prohibit: "/prəʊˈhɪbɪt/", obsolete: "/ˌɒbsəˈliːt/",
};
function americanIpa(word: string) {
  return AMERICAN_IPA[word] ?? "/音標待補/";
}
function britishIpa(word: string) {
  const american = AMERICAN_IPA[word];
  return BRITISH_IPA_OVERRIDES[word] ?? (american ? american.replaceAll("oʊ", "əʊ").replaceAll("ɝː", "ɜː").replaceAll("ɑːr", "ɑː").replaceAll("ɔːr", "ɔː").replaceAll("ər", "ə") : "/音標待補/");
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
const LEVEL_ORDER: Level[] = ["基礎", "中階", "進階"];
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
  const unresolvedCount = memory.filter((item) => item.mastery !== "mastered").length;
  const learningLocked = phase === "learn" && unresolvedCount >= 30 && !confirmed;

  useEffect(() => {
    setMotivation(MOTIVATIONS[Math.floor(Math.random() * MOTIVATIONS.length)]);
    const saved = JSON.parse(localStorage.getItem("toeic-journal") || "null");
    if (saved) {
      const hasCurrentAssessment = saved.assessed && saved.assessmentVersion === 1;
      const refreshedMemory = (Array.isArray(saved.memory) ? saved.memory : [])
        .map((entry: Memory) => {
          const currentWord = WORDS_BY_NAME.get(entry.word);
          return currentWord ? { ...entry, ...currentWord, mastery: entry.mastery === "mastered" && !entry.correct ? "new" : entry.mastery } : null;
        })
        .filter((entry: Memory | null): entry is Memory => entry !== null);
      setMemory(refreshedMemory);
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
    if (!ready || phase !== "learn" || selected || !pool.length || learningLocked) return;
    const remembered = new Set(memory.map((item) => item.word));
    const nextIndex = Array.from({ length: pool.length }, (_, offset) => (wordIndex + offset) % pool.length)
      .find((index) => !remembered.has(pool[index].word));
    if (nextIndex === undefined) {
      const nextLevel = LEVEL_ORDER[LEVEL_ORDER.indexOf(level) + 1];
      if (nextLevel) {
        const fullNextLevelPool = WORDS.filter((word) => word.level === nextLevel);
        const nextLevelPool = fullNextLevelPool.map((word, index) => ({ word, index })).filter(({ word }) => !remembered.has(word.word));
        setLevel(nextLevel);
        setWordIndex(nextLevelPool.length ? nextLevelPool[Math.floor(Math.random() * nextLevelPool.length)].index : 0);
      } else {
        setLevelComplete(true);
      }
    } else {
      setLevelComplete(false);
      if (nextIndex !== wordIndex) setWordIndex(nextIndex);
    }
  }, [ready, phase, selected, pool, memory, wordIndex, learningLocked]);

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
      const entry: Memory = { ...current, correct, mastery: correct ? (old?.mastery ?? "learning") : "new", attempts: (old?.attempts ?? 0) + 1 };
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
        const resultPool = WORDS.filter((word) => word.level === result);
        setWordIndex(Math.floor(Math.random() * resultPool.length));
        setAssessed(true);
        setPhase("learn");
      } else setAssessmentIndex((n) => n + 1);
    } else {
      const remembered = new Set(memory.map((item) => item.word));
      const remaining = pool.map((word, index) => ({ word, index })).filter(({ word }) => !remembered.has(word.word));
      if (remaining.length) {
        setWordIndex(remaining[Math.floor(Math.random() * remaining.length)].index);
      } else {
        const nextLevel = LEVEL_ORDER[LEVEL_ORDER.indexOf(level) + 1];
        if (nextLevel) {
          const nextPool = WORDS.filter((word) => word.level === nextLevel && !remembered.has(word.word));
          setLevel(nextLevel);
          setWordIndex(nextPool.length ? WORDS.filter((word) => word.level === nextLevel).indexOf(nextPool[Math.floor(Math.random() * nextPool.length)]) : 0);
        } else {
          setLevelComplete(true);
        }
      }
    }
    setSelected(null);
    setConfirmed(false);
  }

  function classify(mastery: Mastery) {
    if (mastery === "mastered" && !correct) return;
    setMemory((list) => list.map((x) => x.word === current.word ? { ...x, mastery } : x));
    next();
  }

  function beginLearning() {
    if (!assessed) {
      setPhase("assessment");
      return;
    }
    const remembered = new Set(memory.map((item) => item.word));
    const available = pool.map((word, index) => ({ word, index })).filter(({ word }) => !remembered.has(word.word));
    if (available.length) setWordIndex(available[Math.floor(Math.random() * available.length)].index);
    setPhase("learn");
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
    setMemory((list) => list.map((x) => x.word === reviewWord.word ? { ...x, correct: isCorrect, mastery: isCorrect ? x.mastery : "new", attempts: x.attempts + 1 } : x));
    setReviewWord((item) => item ? { ...item, correct: isCorrect, mastery: isCorrect ? item.mastery : "new", attempts: item.attempts + 1 } : item);
  }
  function finishAd() {
    setLives((n) => n + 1); setAdOpen(false); setAdSeconds(5);
  }

  async function speakWord(word: string, accent: "US" | "UK") {
    try {
      activePronunciation?.stop();
      const region = accent === "US" ? "us" : "uk";
      const path = `${import.meta.env.BASE_URL}audio/${region}/${word}.wav`;
      pronunciationContext ??= new AudioContext();
      await pronunciationContext.resume();
      let buffer = pronunciationCache.get(path);
      if (!buffer) {
        const response = await fetch(path);
        if (!response.ok) throw new Error("No bundled pronunciation");
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
    } catch {
      speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(word);
      utterance.lang = accent === "US" ? "en-US" : "en-GB";
      utterance.rate = 0.82;
      speechSynthesis.speak(utterance);
    }
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
          <button disabled={phase === "assessment"} className={phase === "learn" ? "active" : ""} onClick={beginLearning}>今日學習</button>
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
            <h1>煞氣a水獺教教主</h1>
            <p>挑戰多益單字試煉，把每一次答題寫入你的江湖秘笈。</p>
            <div className="home-actions">
              <button className="challenge-button" onClick={beginLearning}><span>01</span><b>挑戰新單字</b><small>{assessed ? `${level} · 預估 TOEIC ${SCORE_ESTIMATE[level]}` : "先完成十題程度測驗"}</small><i>→</i></button>
              <button className="memoir-button" onClick={() => setPhase("memory")}><span>02</span><b>回憶錄</b><small>已收藏 {memory.length} 個單字</small><i>→</i></button>
            </div>
            <footer className="legal-links" aria-label="網站資訊">
              <a href={`${import.meta.env.BASE_URL}about.html`}>關於本站</a>
              <a href={`${import.meta.env.BASE_URL}privacy.html`}>隱私權政策</a>
              <a href={`${import.meta.env.BASE_URL}contact.html`}>聯絡我們</a>
            </footer>
          </div>
        </section>
      ) : phase === "memory" ? (
        <section className="memory-page">
          <div className="memory-heading"><div><h1>多益武林秘笈</h1><p>每一次答題都會載入武林秘笈。這裡複習答錯，也不會失去愛心。</p></div><div className="memory-total"><b>{memory.length}</b><span>已收錄心法</span></div></div>
          <div className="filters">
            <button className={filter === "all" ? "selected" : ""} onClick={() => setFilter("all")}>全部 <span>{memory.length}</span></button>
            {(["mastered", "learning", "new"] as Mastery[]).map((key) => { const count = memory.filter((x) => x.mastery === key).length; return <div className="filter-pair" key={key}><button className={`mastery-${key} ${filter === key ? "selected" : ""}`} onClick={() => setFilter(key)}>{LABELS[key]} <span>{count}</span></button><button className="review-launch" disabled={!count} onClick={() => startCategoryReview(key)}>↻ 隨機複習</button></div>; })}
          </div>
          {visibleMemory.length ? <div className="word-grid">{visibleMemory.map((item) => <article className="word-tile" key={item.word}><div className="word-open" role="button" tabIndex={0} onClick={() => openReview(item)} onKeyDown={(event) => event.key === "Enter" && openReview(item)} aria-label={`複習 ${item.word}`}><div><span className={`dot ${item.mastery}`} />{LABELS[item.mastery]}</div><h2>{item.word}<small className="word-pos-inline">{item.pos}</small></h2><p className="tile-phonetic"><span><b>美</b>{AMERICAN_IPA[item.word]}<button className="pronounce-button" onClick={(event) => { event.stopPropagation(); speakWord(item.word, "US"); }} aria-label={`播放 ${item.word} 美式發音`}>🔊</button></span><span><b>英</b>{britishIpa(item.word)}<button className="pronounce-button" onClick={(event) => { event.stopPropagation(); speakWord(item.word, "UK"); }} aria-label={`播放 ${item.word} 英式發音`}>🔊</button></span></p><p className={`tile-meaning ${item.mastery !== "mastered" ? "concealed" : ""}`}>{item.mastery === "mastered" ? item.meaning : "答案封存 · 複習作答後揭曉"}</p><small>{item.correct ? "最近答對" : "最近答錯"} · 練習 {item.attempts} 次</small><b className="open-arrow" aria-hidden="true">閱</b></div></article>)}</div> : <div className="empty"><b>還沒有這一類單字</b><p>回到今日學習，回答一題後就會收藏在這裡。</p></div>}
        </section>
      ) : (
        <section className="study-page">
          <aside>
            {phase === "assessment" && <div className="section-kicker">THE TRIAL OF TEN</div>}
            <h1>{phase === "assessment" ? "踏入 990 分之座" : motivation.title}</h1>
            <p>{phase === "assessment" ? "接受十題試煉，水獺教主將辨識你的單字內力。程度測驗答錯不扣愛心。" : motivation.body}</p>
            <div className="session-stat"><span>{phase === "assessment" ? `${assessmentIndex + 1} / 10` : level}</span><small>{phase === "assessment" ? "程度測驗" : `預估 TOEIC ${SCORE_ESTIMATE[level]}`}</small></div>

          </aside>

          <div className="quiz-wrap">
            <div className="quiz-meta"><span>{phase === "assessment" ? `程度測驗 · ${assessmentIndex + 1} / 10` : `${level}單字 · 預估 TOEIC ${SCORE_ESTIMATE[level]}`}</span><span className="progress-line"><i style={{ width: phase === "assessment" ? `${(assessmentIndex + 1) * 10}%` : `${Math.min(100, memory.filter((item) => item.level === level).length / pool.length * 100)}%` }} /></span></div>
            {learningLocked ? <article className="completion-card learning-lock"><span>教主封關令</span><h2>三十心法未悟，不得再闖新關</h2><p>少俠目前尚有 <b>{unresolvedCount}</b> 個單字停留在「尚在參悟」或「尚未入門」。先回秘笈磨練舊招，待未熟心法少於 30，再來挑戰新單字。</p><button onClick={() => setPhase("memory")}>回到回憶錄閉關修練 →</button></article> : levelComplete && phase === "learn" ? <article className="completion-card"><span>全階心法修習完畢</span><h2>多益單字，全數收入秘笈</h2><p>預估 TOEIC 成績：<b>{SCORE_ESTIMATE[level]}</b></p><button onClick={() => setPhase("memory")}>前往回憶錄總複習 →</button></article> : <><article className="card">
              <div className="card-no">{String(phase === "assessment" ? assessmentIndex + 1 : wordIndex + 1).padStart(2, "0")}</div>
              <h2>{current.word}<small className="word-pos-inline">{current.pos}</small></h2>
              <div className="word-details"><span><b>美</b>{AMERICAN_IPA[current.word]}<button className="pronounce-button" onClick={() => speakWord(current.word, "US")} aria-label={`播放 ${current.word} 美式發音`}>🔊</button></span><span><b>英</b>{britishIpa(current.word)}<button className="pronounce-button" onClick={() => speakWord(current.word, "UK")} aria-label={`播放 ${current.word} 英式發音`}>🔊</button></span></div>
              <p className="prompt">請選出最適合的中文意思</p>
              <div className="answers">{choices.map((choice, i) => {
                const state = confirmed ? choice === current.meaning ? "correct" : choice === selected ? "wrong" : "muted" : choice === selected ? "pending" : "";
                return <button key={choice} className={state} onClick={() => answer(choice)}><b>{LETTERS[i]}</b><span>{choice}</span>{state === "correct" && <i>✓</i>}{state === "wrong" && <i>×</i>}</button>;
              })}</div>
              {!confirmed && <button className="confirm-answer" disabled={!selected} onClick={confirmAnswer}>{selected ? "確認答案" : "請先選擇答案"}</button>}
              {confirmed && <div className={`feedback ${correct ? "good" : "bad"}`}><b>{correct ? "答對了，漂亮！" : `正確答案是「${current.meaning}」`}</b><p><strong>英文例句</strong>{current.example}</p><p><strong>中文翻譯</strong>{current.exampleZh}</p></div>}
            </article>
            {confirmed && (phase === "learn" ? <div className="classify"><span>{correct ? "這個字對你來說…" : "答錯不得列為融會貫通"}</span>{(["mastered", "learning", "new"] as Mastery[]).map((key) => <button className={`mastery-${key}`} disabled={key === "mastered" && !correct} key={key} onClick={() => classify(key)}>{key === "mastered" ? "◆" : key === "learning" ? "◈" : "◇"} {LABELS[key]}</button>)}</div> : <button className="next-button" onClick={next}>{assessmentIndex === 9 ? "查看我的程度" : "下一題 →"}</button>)}
            {phase === "learn" && lives <= 0 && !confirmed && <div className="out"><b>今天的 3 次機會用完了</b><p>看一則短廣告，即可增加 1 次作答機會。</p><button onClick={watchAd}>▶ 看廣告 · +1 次機會</button></div>}</>}
          </div>
        </section>
      )}

      {reviewWord && <div className="modal-backdrop" onClick={closeReview}><div className="review-modal" onClick={(e) => e.stopPropagation()}><button className="close" onClick={closeReview}>×</button><div className="review-topline"><span className="pos">回憶錄複習{reviewQueue.length ? ` · ${reviewPosition + 1}/${reviewQueue.length}` : ""}</span><span>♥ 不扣愛心</span></div><h2>{reviewWord.word}<small className="word-pos-inline">{reviewWord.pos}</small></h2><div className="word-details"><span><b>美</b>{AMERICAN_IPA[reviewWord.word]}<button className="pronounce-button" onClick={() => speakWord(reviewWord.word, "US")} aria-label={`播放 ${reviewWord.word} 美式發音`}>🔊</button></span><span><b>英</b>{britishIpa(reviewWord.word)}<button className="pronounce-button" onClick={() => speakWord(reviewWord.word, "UK")} aria-label={`播放 ${reviewWord.word} 英式發音`}>🔊</button></span></div><p className="review-prompt">請選出最適合的中文意思</p><div className="answers review-answers">{reviewChoices.map((choice, i) => { const state = reviewSelected ? choice === reviewWord.meaning ? "correct" : choice === reviewSelected ? "wrong" : "muted" : ""; return <button key={choice} className={state} onClick={() => answerReview(choice)}><b>{LETTERS[i]}</b><span>{choice}</span>{state === "correct" && <i>✓</i>}{state === "wrong" && <i>×</i>}</button>; })}</div>{reviewSelected && <><div className={`feedback ${reviewSelected === reviewWord.meaning ? "good" : "bad"}`}><b>{reviewSelected === reviewWord.meaning ? "答對了，記得很清楚！" : `答錯了，正確答案是「${reviewWord.meaning}」`}</b><p><strong>英文例句</strong>{reviewWord.example}</p><p><strong>中文翻譯</strong>{reviewWord.exampleZh}</p></div><div className="review-note">本次複習不扣除任何愛心 · 請重新標記熟悉程度</div><div className="modal-actions">{(["mastered", "learning", "new"] as Mastery[]).map((key) => { const reviewCorrect = reviewSelected === reviewWord.meaning; return <button className={`mastery-${key} ${reviewWord.mastery === key ? "chosen" : ""}`} disabled={key === "mastered" && !reviewCorrect} key={key} onClick={() => { if (key === "mastered" && !reviewCorrect) return; setMemory((list) => list.map((x) => x.word === reviewWord.word ? { ...x, mastery: key } : x)); setReviewWord({ ...reviewWord, mastery: key }); }}>{LABELS[key]}</button>; })}</div>{reviewQueue.length > 0 && <button className="review-next" onClick={nextCategoryReview}>{reviewPosition + 1 >= reviewQueue.length ? "完成這次複習 ✓" : "下一個隨機單字 →"}</button>}</>}</div></div>}

      {adOpen && <div className="modal-backdrop"><div className="ad-modal"><div className="ad-label">ADVERTISEMENT</div><div className="fake-ad"><b>FOCUS.</b><p>Good habits build great results.</p></div>{adSeconds > 0 ? <p>廣告將在 {adSeconds} 秒後結束…</p> : <button onClick={finishAd}>領取 +1 次機會</button>}</div></div>}
    </main>
  );
}
