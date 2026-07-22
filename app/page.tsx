"use client";

import { useEffect, useMemo, useState } from "react";
import { PDF_WORDS } from "./pdfWords";

type Level = "基礎" | "中階" | "進階";
type Mastery = "mastered" | "learning" | "new";
export type Word = { word: string; meaning: string; pos: string; example: string; exampleZh: string; level: Level };
type Memory = Word & { correct: boolean; mastery: Mastery; attempts: number };

const WORDS: Word[] = [
  { word: "agenda", meaning: "議程", pos: "n.", example: "The instructor highlighted the term \"agenda\" during today's vocabulary review.", exampleZh: "講師在今天的單字複習中特別講解「agenda（議程）」這個詞。", level: "基礎" },
  { word: "applicant", meaning: "申請人", pos: "n.", example: "Our study group practiced the expression \"applicant\" before the TOEIC exercise.", exampleZh: "我們的讀書小組在多益練習前複習了「applicant（申請人）」這個詞。", level: "基礎" },
  { word: "confirm", meaning: "確認", pos: "v.", example: "The learner added \"confirm\" to a personal TOEIC vocabulary list.", exampleZh: "學習者把「confirm（確認）」加入個人的多益單字表。", level: "基礎" },
  { word: "deadline", meaning: "截止期限", pos: "n.", example: "The practice quiz asked students to remember the term \"deadline.\"", exampleZh: "這份練習測驗要求學生記住「deadline（截止期限）」這個詞。", level: "基礎" },
  { word: "employee", meaning: "員工", pos: "n.", example: "The class reviewed \"employee\" as part of a business English lesson.", exampleZh: "全班在商用英文課程中複習了「employee（員工）」。", level: "基礎" },
  { word: "equipment", meaning: "設備", pos: "n.", example: "Please review the term \"equipment\" before the next vocabulary challenge.", exampleZh: "請在下一次單字挑戰前複習「equipment（設備）」這個詞。", level: "基礎" },
  { word: "invoice", meaning: "發票；請款單", pos: "n.", example: "The trainer wrote \"invoice\" on the board for everyone to study.", exampleZh: "講師把「invoice（發票；請款單）」寫在白板上供大家學習。", level: "基礎" },
  { word: "purchase", meaning: "購買", pos: "v./n.", example: "Today's TOEIC lesson introduced the vocabulary item \"purchase.\"", exampleZh: "今天的多益課程介紹了「purchase（購買）」這個單字。", level: "基礎" },
  { word: "schedule", meaning: "行程；安排", pos: "n./v.", example: "The instructor highlighted the term \"schedule\" during today's vocabulary review.", exampleZh: "講師在今天的單字複習中特別講解「schedule（行程；安排）」這個詞。", level: "基礎" },
  { word: "vacancy", meaning: "職缺；空位", pos: "n.", example: "Our study group practiced the expression \"vacancy\" before the TOEIC exercise.", exampleZh: "我們的讀書小組在多益練習前複習了「vacancy（職缺；空位）」這個詞。", level: "基礎" },
  { word: "accommodate", meaning: "容納；提供住宿", pos: "v.", example: "The learner added \"accommodate\" to a personal TOEIC vocabulary list.", exampleZh: "學習者把「accommodate（容納；提供住宿）」加入個人的多益單字表。", level: "中階" },
  { word: "authorize", meaning: "授權；批准", pos: "v.", example: "The practice quiz asked students to remember the term \"authorize.\"", exampleZh: "這份練習測驗要求學生記住「authorize（授權；批准）」這個詞。", level: "中階" },
  { word: "complimentary", meaning: "免費贈送的", pos: "adj.", example: "The class reviewed \"complimentary\" as part of a business English lesson.", exampleZh: "全班在商用英文課程中複習了「complimentary（免費贈送的）」。", level: "中階" },
  { word: "compliance", meaning: "遵守；依從", pos: "n.", example: "Please review the term \"compliance\" before the next vocabulary challenge.", exampleZh: "請在下一次單字挑戰前複習「compliance（遵守；依從）」這個詞。", level: "中階" },
  { word: "eligible", meaning: "符合資格的", pos: "adj.", example: "The trainer wrote \"eligible\" on the board for everyone to study.", exampleZh: "講師把「eligible（符合資格的）」寫在白板上供大家學習。", level: "中階" },
  { word: "fluctuate", meaning: "波動", pos: "v.", example: "Today's TOEIC lesson introduced the vocabulary item \"fluctuate.\"", exampleZh: "今天的多益課程介紹了「fluctuate（波動）」這個單字。", level: "中階" },
  { word: "inventory", meaning: "庫存", pos: "n.", example: "The instructor highlighted the term \"inventory\" during today's vocabulary review.", exampleZh: "講師在今天的單字複習中特別講解「inventory（庫存）」這個詞。", level: "中階" },
  { word: "negotiate", meaning: "協商", pos: "v.", example: "Our study group practiced the expression \"negotiate\" before the TOEIC exercise.", exampleZh: "我們的讀書小組在多益練習前複習了「negotiate（協商）」這個詞。", level: "中階" },
  { word: "reimburse", meaning: "償還；報銷", pos: "v.", example: "The learner added \"reimburse\" to a personal TOEIC vocabulary list.", exampleZh: "學習者把「reimburse（償還；報銷）」加入個人的多益單字表。", level: "中階" },
  { word: "tentative", meaning: "暫定的", pos: "adj.", example: "The practice quiz asked students to remember the term \"tentative.\"", exampleZh: "這份練習測驗要求學生記住「tentative（暫定的）」這個詞。", level: "中階" },
  { word: "alleviate", meaning: "減輕；緩和", pos: "v.", example: "The class reviewed \"alleviate\" as part of a business English lesson.", exampleZh: "全班在商用英文課程中複習了「alleviate（減輕；緩和）」。", level: "進階" },
  { word: "contingency", meaning: "突發狀況；應變措施", pos: "n.", example: "Please review the term \"contingency\" before the next vocabulary challenge.", exampleZh: "請在下一次單字挑戰前複習「contingency（突發狀況；應變措施）」這個詞。", level: "進階" },
  { word: "deteriorate", meaning: "惡化", pos: "v.", example: "The trainer wrote \"deteriorate\" on the board for everyone to study.", exampleZh: "講師把「deteriorate（惡化）」寫在白板上供大家學習。", level: "進階" },
  { word: "discrepancy", meaning: "差異；不一致", pos: "n.", example: "Today's TOEIC lesson introduced the vocabulary item \"discrepancy.\"", exampleZh: "今天的多益課程介紹了「discrepancy（差異；不一致）」這個單字。", level: "進階" },
  { word: "expedite", meaning: "加速；促進", pos: "v.", example: "The instructor highlighted the term \"expedite\" during today's vocabulary review.", exampleZh: "講師在今天的單字複習中特別講解「expedite（加速；促進）」這個詞。", level: "進階" },
  { word: "feasible", meaning: "可行的", pos: "adj.", example: "Our study group practiced the expression \"feasible\" before the TOEIC exercise.", exampleZh: "我們的讀書小組在多益練習前複習了「feasible（可行的）」這個詞。", level: "進階" },
  { word: "inadvertently", meaning: "不經意地", pos: "adv.", example: "The learner added \"inadvertently\" to a personal TOEIC vocabulary list.", exampleZh: "學習者把「inadvertently（不經意地）」加入個人的多益單字表。", level: "進階" },
  { word: "lucrative", meaning: "獲利豐厚的", pos: "adj.", example: "The practice quiz asked students to remember the term \"lucrative.\"", exampleZh: "這份練習測驗要求學生記住「lucrative（獲利豐厚的）」這個詞。", level: "進階" },
  { word: "prerequisite", meaning: "先決條件", pos: "n.", example: "The class reviewed \"prerequisite\" as part of a business English lesson.", exampleZh: "全班在商用英文課程中複習了「prerequisite（先決條件）」。", level: "進階" },
  { word: "streamline", meaning: "精簡；使更有效率", pos: "v.", example: "Please review the term \"streamline\" before the next vocabulary challenge.", exampleZh: "請在下一次單字挑戰前複習「streamline（精簡；使更有效率）」這個詞。", level: "進階" },
  { word: "appointment", meaning: "約會；預約", pos: "n.", example: "The trainer wrote \"appointment\" on the board for everyone to study.", exampleZh: "講師把「appointment（約會；預約）」寫在白板上供大家學習。", level: "基礎" },
  { word: "branch", meaning: "分公司；分店", pos: "n.", example: "Today's TOEIC lesson introduced the vocabulary item \"branch.\"", exampleZh: "今天的多益課程介紹了「branch（分公司；分店）」這個單字。", level: "基礎" },
  { word: "budget", meaning: "預算", pos: "n.", example: "The instructor highlighted the term \"budget\" during today's vocabulary review.", exampleZh: "講師在今天的單字複習中特別講解「budget（預算）」這個詞。", level: "基礎" },
  { word: "cancel", meaning: "取消", pos: "v.", example: "Our study group practiced the expression \"cancel\" before the TOEIC exercise.", exampleZh: "我們的讀書小組在多益練習前複習了「cancel（取消）」這個詞。", level: "基礎" },
  { word: "candidate", meaning: "候選人", pos: "n.", example: "The learner added \"candidate\" to a personal TOEIC vocabulary list.", exampleZh: "學習者把「candidate（候選人）」加入個人的多益單字表。", level: "基礎" },
  { word: "client", meaning: "客戶", pos: "n.", example: "The practice quiz asked students to remember the term \"client.\"", exampleZh: "這份練習測驗要求學生記住「client（客戶）」這個詞。", level: "基礎" },
  { word: "contract", meaning: "合約", pos: "n.", example: "The class reviewed \"contract\" as part of a business English lesson.", exampleZh: "全班在商用英文課程中複習了「contract（合約）」。", level: "基礎" },
  { word: "customer", meaning: "顧客", pos: "n.", example: "Please review the term \"customer\" before the next vocabulary challenge.", exampleZh: "請在下一次單字挑戰前複習「customer（顧客）」這個詞。", level: "基礎" },
  { word: "deliver", meaning: "運送；交付", pos: "v.", example: "The trainer wrote \"deliver\" on the board for everyone to study.", exampleZh: "講師把「deliver（運送；交付）」寫在白板上供大家學習。", level: "基礎" },
  { word: "department", meaning: "部門", pos: "n.", example: "Today's TOEIC lesson introduced the vocabulary item \"department.\"", exampleZh: "今天的多益課程介紹了「department（部門）」這個單字。", level: "基礎" },
  { word: "discount", meaning: "折扣", pos: "n.", example: "The instructor highlighted the term \"discount\" during today's vocabulary review.", exampleZh: "講師在今天的單字複習中特別講解「discount（折扣）」這個詞。", level: "基礎" },
  { word: "document", meaning: "文件", pos: "n.", example: "Our study group practiced the expression \"document\" before the TOEIC exercise.", exampleZh: "我們的讀書小組在多益練習前複習了「document（文件）」這個詞。", level: "基礎" },
  { word: "facility", meaning: "設施；場所", pos: "n.", example: "The learner added \"facility\" to a personal TOEIC vocabulary list.", exampleZh: "學習者把「facility（設施；場所）」加入個人的多益單字表。", level: "基礎" },
  { word: "fee", meaning: "費用", pos: "n.", example: "The practice quiz asked students to remember the term \"fee.\"", exampleZh: "這份練習測驗要求學生記住「fee（費用）」這個詞。", level: "基礎" },
  { word: "manager", meaning: "經理", pos: "n.", example: "The class reviewed \"manager\" as part of a business English lesson.", exampleZh: "全班在商用英文課程中複習了「manager（經理）」。", level: "基礎" },
  { word: "meeting", meaning: "會議", pos: "n.", example: "Please review the term \"meeting\" before the next vocabulary challenge.", exampleZh: "請在下一次單字挑戰前複習「meeting（會議）」這個詞。", level: "基礎" },
  { word: "order", meaning: "訂單；訂購", pos: "n./v.", example: "The trainer wrote \"order\" on the board for everyone to study.", exampleZh: "講師把「order（訂單；訂購）」寫在白板上供大家學習。", level: "基礎" },
  { word: "payment", meaning: "付款", pos: "n.", example: "Today's TOEIC lesson introduced the vocabulary item \"payment.\"", exampleZh: "今天的多益課程介紹了「payment（付款）」這個單字。", level: "基礎" },
  { word: "product", meaning: "產品", pos: "n.", example: "The instructor highlighted the term \"product\" during today's vocabulary review.", exampleZh: "講師在今天的單字複習中特別講解「product（產品）」這個詞。", level: "基礎" },
  { word: "receipt", meaning: "收據", pos: "n.", example: "Our study group practiced the expression \"receipt\" before the TOEIC exercise.", exampleZh: "我們的讀書小組在多益練習前複習了「receipt（收據）」這個詞。", level: "基礎" },
  { word: "report", meaning: "報告", pos: "n.", example: "The learner added \"report\" to a personal TOEIC vocabulary list.", exampleZh: "學習者把「report（報告）」加入個人的多益單字表。", level: "基礎" },
  { word: "reserve", meaning: "預訂；保留", pos: "v.", example: "The practice quiz asked students to remember the term \"reserve.\"", exampleZh: "這份練習測驗要求學生記住「reserve（預訂；保留）」這個詞。", level: "基礎" },
  { word: "salary", meaning: "薪資", pos: "n.", example: "The class reviewed \"salary\" as part of a business English lesson.", exampleZh: "全班在商用英文課程中複習了「salary（薪資）」。", level: "基礎" },
  { word: "shipment", meaning: "貨物；出貨", pos: "n.", example: "Please review the term \"shipment\" before the next vocabulary challenge.", exampleZh: "請在下一次單字挑戰前複習「shipment（貨物；出貨）」這個詞。", level: "基礎" },
  { word: "staff", meaning: "全體員工", pos: "n.", example: "The trainer wrote \"staff\" on the board for everyone to study.", exampleZh: "講師把「staff（全體員工）」寫在白板上供大家學習。", level: "基礎" },
  { word: "supplier", meaning: "供應商", pos: "n.", example: "Today's TOEIC lesson introduced the vocabulary item \"supplier.\"", exampleZh: "今天的多益課程介紹了「supplier（供應商）」這個單字。", level: "基礎" },
  { word: "training", meaning: "訓練", pos: "n.", example: "The instructor highlighted the term \"training\" during today's vocabulary review.", exampleZh: "講師在今天的單字複習中特別講解「training（訓練）」這個詞。", level: "基礎" },
  { word: "travel", meaning: "旅行；出差", pos: "n./v.", example: "Our study group practiced the expression \"travel\" before the TOEIC exercise.", exampleZh: "我們的讀書小組在多益練習前複習了「travel（旅行；出差）」這個詞。", level: "基礎" },
  { word: "update", meaning: "更新", pos: "n./v.", example: "The learner added \"update\" to a personal TOEIC vocabulary list.", exampleZh: "學習者把「update（更新）」加入個人的多益單字表。", level: "基礎" },
  { word: "warehouse", meaning: "倉庫", pos: "n.", example: "The practice quiz asked students to remember the term \"warehouse.\"", exampleZh: "這份練習測驗要求學生記住「warehouse（倉庫）」這個詞。", level: "基礎" },
  { word: "allocate", meaning: "分配", pos: "v.", example: "The class reviewed \"allocate\" as part of a business English lesson.", exampleZh: "全班在商用英文課程中複習了「allocate（分配）」。", level: "中階" },
  { word: "anticipate", meaning: "預期", pos: "v.", example: "Please review the term \"anticipate\" before the next vocabulary challenge.", exampleZh: "請在下一次單字挑戰前複習「anticipate（預期）」這個詞。", level: "中階" },
  { word: "approximately", meaning: "大約", pos: "adv.", example: "The trainer wrote \"approximately\" on the board for everyone to study.", exampleZh: "講師把「approximately（大約）」寫在白板上供大家學習。", level: "中階" },
  { word: "assess", meaning: "評估", pos: "v.", example: "Today's TOEIC lesson introduced the vocabulary item \"assess.\"", exampleZh: "今天的多益課程介紹了「assess（評估）」這個單字。", level: "中階" },
  { word: "capacity", meaning: "容量；能力", pos: "n.", example: "The instructor highlighted the term \"capacity\" during today's vocabulary review.", exampleZh: "講師在今天的單字複習中特別講解「capacity（容量；能力）」這個詞。", level: "中階" },
  { word: "collaborate", meaning: "合作", pos: "v.", example: "Our study group practiced the expression \"collaborate\" before the TOEIC exercise.", exampleZh: "我們的讀書小組在多益練習前複習了「collaborate（合作）」這個詞。", level: "中階" },
  { word: "commence", meaning: "開始", pos: "v.", example: "The learner added \"commence\" to a personal TOEIC vocabulary list.", exampleZh: "學習者把「commence（開始）」加入個人的多益單字表。", level: "中階" },
  { word: "compensation", meaning: "薪酬；補償", pos: "n.", example: "The practice quiz asked students to remember the term \"compensation.\"", exampleZh: "這份練習測驗要求學生記住「compensation（薪酬；補償）」這個詞。", level: "中階" },
  { word: "consecutive", meaning: "連續的", pos: "adj.", example: "The class reviewed \"consecutive\" as part of a business English lesson.", exampleZh: "全班在商用英文課程中複習了「consecutive（連續的）」。", level: "中階" },
  { word: "constraint", meaning: "限制；約束", pos: "n.", example: "Please review the term \"constraint\" before the next vocabulary challenge.", exampleZh: "請在下一次單字挑戰前複習「constraint（限制；約束）」這個詞。", level: "中階" },
  { word: "convenient", meaning: "方便的", pos: "adj.", example: "The trainer wrote \"convenient\" on the board for everyone to study.", exampleZh: "講師把「convenient（方便的）」寫在白板上供大家學習。", level: "中階" },
  { word: "coordinate", meaning: "協調", pos: "v.", example: "Today's TOEIC lesson introduced the vocabulary item \"coordinate.\"", exampleZh: "今天的多益課程介紹了「coordinate（協調）」這個單字。", level: "中階" },
  { word: "deduct", meaning: "扣除", pos: "v.", example: "The instructor highlighted the term \"deduct\" during today's vocabulary review.", exampleZh: "講師在今天的單字複習中特別講解「deduct（扣除）」這個詞。", level: "中階" },
  { word: "defective", meaning: "有缺陷的", pos: "adj.", example: "Our study group practiced the expression \"defective\" before the TOEIC exercise.", exampleZh: "我們的讀書小組在多益練習前複習了「defective（有缺陷的）」這個詞。", level: "中階" },
  { word: "designate", meaning: "指定", pos: "v.", example: "The learner added \"designate\" to a personal TOEIC vocabulary list.", exampleZh: "學習者把「designate（指定）」加入個人的多益單字表。", level: "中階" },
  { word: "distribute", meaning: "分發；配送", pos: "v.", example: "The practice quiz asked students to remember the term \"distribute.\"", exampleZh: "這份練習測驗要求學生記住「distribute（分發；配送）」這個詞。", level: "中階" },
  { word: "efficient", meaning: "有效率的", pos: "adj.", example: "The class reviewed \"efficient\" as part of a business English lesson.", exampleZh: "全班在商用英文課程中複習了「efficient（有效率的）」。", level: "中階" },
  { word: "estimate", meaning: "估計；估價", pos: "n./v.", example: "Please review the term \"estimate\" before the next vocabulary challenge.", exampleZh: "請在下一次單字挑戰前複習「estimate（估計；估價）」這個詞。", level: "中階" },
  { word: "evaluate", meaning: "評價；評估", pos: "v.", example: "The trainer wrote \"evaluate\" on the board for everyone to study.", exampleZh: "講師把「evaluate（評價；評估）」寫在白板上供大家學習。", level: "中階" },
  { word: "exceed", meaning: "超過", pos: "v.", example: "Today's TOEIC lesson introduced the vocabulary item \"exceed.\"", exampleZh: "今天的多益課程介紹了「exceed（超過）」這個單字。", level: "中階" },
  { word: "implement", meaning: "實施", pos: "v.", example: "The instructor highlighted the term \"implement\" during today's vocabulary review.", exampleZh: "講師在今天的單字複習中特別講解「implement（實施）」這個詞。", level: "中階" },
  { word: "inquiry", meaning: "詢問", pos: "n.", example: "Our study group practiced the expression \"inquiry\" before the TOEIC exercise.", exampleZh: "我們的讀書小組在多益練習前複習了「inquiry（詢問）」這個詞。", level: "中階" },
  { word: "maintenance", meaning: "維護；保養", pos: "n.", example: "The learner added \"maintenance\" to a personal TOEIC vocabulary list.", exampleZh: "學習者把「maintenance（維護；保養）」加入個人的多益單字表。", level: "中階" },
  { word: "mandatory", meaning: "強制的；必要的", pos: "adj.", example: "The practice quiz asked students to remember the term \"mandatory.\"", exampleZh: "這份練習測驗要求學生記住「mandatory（強制的；必要的）」這個詞。", level: "中階" },
  { word: "modify", meaning: "修改", pos: "v.", example: "The class reviewed \"modify\" as part of a business English lesson.", exampleZh: "全班在商用英文課程中複習了「modify（修改）」。", level: "中階" },
  { word: "notify", meaning: "通知", pos: "v.", example: "Please review the term \"notify\" before the next vocabulary challenge.", exampleZh: "請在下一次單字挑戰前複習「notify（通知）」這個詞。", level: "中階" },
  { word: "postpone", meaning: "延期", pos: "v.", example: "The trainer wrote \"postpone\" on the board for everyone to study.", exampleZh: "講師把「postpone（延期）」寫在白板上供大家學習。", level: "中階" },
  { word: "prohibit", meaning: "禁止", pos: "v.", example: "Today's TOEIC lesson introduced the vocabulary item \"prohibit.\"", exampleZh: "今天的多益課程介紹了「prohibit（禁止）」這個單字。", level: "中階" },
  { word: "prospective", meaning: "潛在的；預期的", pos: "adj.", example: "The instructor highlighted the term \"prospective\" during today's vocabulary review.", exampleZh: "講師在今天的單字複習中特別講解「prospective（潛在的；預期的）」這個詞。", level: "中階" },
  { word: "retain", meaning: "保留；留住", pos: "v.", example: "Our study group practiced the expression \"retain\" before the TOEIC exercise.", exampleZh: "我們的讀書小組在多益練習前複習了「retain（保留；留住）」這個詞。", level: "中階" },
  { word: "adjacent", meaning: "相鄰的", pos: "adj.", example: "The learner added \"adjacent\" to a personal TOEIC vocabulary list.", exampleZh: "學習者把「adjacent（相鄰的）」加入個人的多益單字表。", level: "進階" },
  { word: "advocate", meaning: "提倡；支持", pos: "v.", example: "The practice quiz asked students to remember the term \"advocate.\"", exampleZh: "這份練習測驗要求學生記住「advocate（提倡；支持）」這個詞。", level: "進階" },
  { word: "amend", meaning: "修訂", pos: "v.", example: "The class reviewed \"amend\" as part of a business English lesson.", exampleZh: "全班在商用英文課程中複習了「amend（修訂）」。", level: "進階" },
  { word: "arbitrarily", meaning: "武斷地；任意地", pos: "adv.", example: "Please review the term \"arbitrarily\" before the next vocabulary challenge.", exampleZh: "請在下一次單字挑戰前複習「arbitrarily（武斷地；任意地）」這個詞。", level: "進階" },
  { word: "benchmark", meaning: "基準", pos: "n.", example: "The trainer wrote \"benchmark\" on the board for everyone to study.", exampleZh: "講師把「benchmark（基準）」寫在白板上供大家學習。", level: "進階" },
  { word: "consolidate", meaning: "合併；鞏固", pos: "v.", example: "Today's TOEIC lesson introduced the vocabulary item \"consolidate.\"", exampleZh: "今天的多益課程介紹了「consolidate（合併；鞏固）」這個單字。", level: "進階" },
  { word: "diligent", meaning: "勤勉的", pos: "adj.", example: "The instructor highlighted the term \"diligent\" during today's vocabulary review.", exampleZh: "講師在今天的單字複習中特別講解「diligent（勤勉的）」這個詞。", level: "進階" },
  { word: "diversify", meaning: "多元化", pos: "v.", example: "Our study group practiced the expression \"diversify\" before the TOEIC exercise.", exampleZh: "我們的讀書小組在多益練習前複習了「diversify（多元化）」這個詞。", level: "進階" },
  { word: "endorse", meaning: "認可；支持", pos: "v.", example: "The learner added \"endorse\" to a personal TOEIC vocabulary list.", exampleZh: "學習者把「endorse（認可；支持）」加入個人的多益單字表。", level: "進階" },
  { word: "entail", meaning: "牽涉；需要", pos: "v.", example: "The practice quiz asked students to remember the term \"entail.\"", exampleZh: "這份練習測驗要求學生記住「entail（牽涉；需要）」這個詞。", level: "進階" },
  { word: "exemplary", meaning: "典範的；優秀的", pos: "adj.", example: "The class reviewed \"exemplary\" as part of a business English lesson.", exampleZh: "全班在商用英文課程中複習了「exemplary（典範的；優秀的）」。", level: "進階" },
  { word: "fiscal", meaning: "財政的；會計年度的", pos: "adj.", example: "Please review the term \"fiscal\" before the next vocabulary challenge.", exampleZh: "請在下一次單字挑戰前複習「fiscal（財政的；會計年度的）」這個詞。", level: "進階" },
  { word: "impending", meaning: "即將發生的", pos: "adj.", example: "The trainer wrote \"impending\" on the board for everyone to study.", exampleZh: "講師把「impending（即將發生的）」寫在白板上供大家學習。", level: "進階" },
  { word: "incentive", meaning: "獎勵；誘因", pos: "n.", example: "Today's TOEIC lesson introduced the vocabulary item \"incentive.\"", exampleZh: "今天的多益課程介紹了「incentive（獎勵；誘因）」這個單字。", level: "進階" },
  { word: "incompatible", meaning: "不相容的", pos: "adj.", example: "The instructor highlighted the term \"incompatible\" during today's vocabulary review.", exampleZh: "講師在今天的單字複習中特別講解「incompatible（不相容的）」這個詞。", level: "進階" },
  { word: "indispensable", meaning: "不可或缺的", pos: "adj.", example: "Our study group practiced the expression \"indispensable\" before the TOEIC exercise.", exampleZh: "我們的讀書小組在多益練習前複習了「indispensable（不可或缺的）」這個詞。", level: "進階" },
  { word: "meticulous", meaning: "一絲不苟的", pos: "adj.", example: "The learner added \"meticulous\" to a personal TOEIC vocabulary list.", exampleZh: "學習者把「meticulous（一絲不苟的）」加入個人的多益單字表。", level: "進階" },
  { word: "obsolete", meaning: "過時的；淘汰的", pos: "adj.", example: "The practice quiz asked students to remember the term \"obsolete.\"", exampleZh: "這份練習測驗要求學生記住「obsolete（過時的；淘汰的）」這個詞。", level: "進階" },
  { word: "paramount", meaning: "最重要的", pos: "adj.", example: "The class reviewed \"paramount\" as part of a business English lesson.", exampleZh: "全班在商用英文課程中複習了「paramount（最重要的）」。", level: "進階" },
  { word: "plausible", meaning: "合理可信的", pos: "adj.", example: "Please review the term \"plausible\" before the next vocabulary challenge.", exampleZh: "請在下一次單字挑戰前複習「plausible（合理可信的）」這個詞。", level: "進階" },
  { word: "proficient", meaning: "熟練的", pos: "adj.", example: "The trainer wrote \"proficient\" on the board for everyone to study.", exampleZh: "講師把「proficient（熟練的）」寫在白板上供大家學習。", level: "進階" },
  { word: "prolonged", meaning: "長期的；延長的", pos: "adj.", example: "Today's TOEIC lesson introduced the vocabulary item \"prolonged.\"", exampleZh: "今天的多益課程介紹了「prolonged（長期的；延長的）」這個單字。", level: "進階" },
  { word: "reconcile", meaning: "調和；核對", pos: "v.", example: "The instructor highlighted the term \"reconcile\" during today's vocabulary review.", exampleZh: "講師在今天的單字複習中特別講解「reconcile（調和；核對）」這個詞。", level: "進階" },
  { word: "refrain", meaning: "避免；克制", pos: "v.", example: "Our study group practiced the expression \"refrain\" before the TOEIC exercise.", exampleZh: "我們的讀書小組在多益練習前複習了「refrain（避免；克制）」這個詞。", level: "進階" },
  { word: "scrutinize", meaning: "仔細審查", pos: "v.", example: "The learner added \"scrutinize\" to a personal TOEIC vocabulary list.", exampleZh: "學習者把「scrutinize（仔細審查）」加入個人的多益單字表。", level: "進階" },
  { word: "subordinate", meaning: "下屬的；次要的", pos: "adj./n.", example: "The practice quiz asked students to remember the term \"subordinate.\"", exampleZh: "這份練習測驗要求學生記住「subordinate（下屬的；次要的）」這個詞。", level: "進階" },
  { word: "substantial", meaning: "大量的；可觀的", pos: "adj.", example: "The class reviewed \"substantial\" as part of a business English lesson.", exampleZh: "全班在商用英文課程中複習了「substantial（大量的；可觀的）」。", level: "進階" },
  { word: "unprecedented", meaning: "前所未有的", pos: "adj.", example: "Please review the term \"unprecedented\" before the next vocabulary challenge.", exampleZh: "請在下一次單字挑戰前複習「unprecedented（前所未有的）」這個詞。", level: "進階" },
  { word: "viable", meaning: "可行的；能生存的", pos: "adj.", example: "The trainer wrote \"viable\" on the board for everyone to study.", exampleZh: "講師把「viable（可行的；能生存的）」寫在白板上供大家學習。", level: "進階" },
  { word: "waive", meaning: "免除；放棄", pos: "v.", example: "Today's TOEIC lesson introduced the vocabulary item \"waive.\"", exampleZh: "今天的多益課程介紹了「waive（免除；放棄）」這個單字。", level: "進階" },
  ...PDF_WORDS,
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
          {visibleMemory.length ? <div className="word-grid">{visibleMemory.map((item) => <article className="word-tile" key={item.word}><div className="word-open" role="button" tabIndex={0} onClick={() => openReview(item)} onKeyDown={(event) => event.key === "Enter" && openReview(item)} aria-label={`複習 ${item.word}`}><div><span className={`dot ${item.mastery}`} />{LABELS[item.mastery]}</div><h2>{item.word}<small className="word-pos-inline">{item.pos}</small></h2><p className="tile-phonetic"><span><b>美</b>{AMERICAN_IPA[item.word]}<button className="pronounce-button" onClick={(event) => { event.stopPropagation(); speakWord(item.word, "US"); }} aria-label={`播放 ${item.word} 美式發音`}>🔊</button></span><span><b>英</b>{britishIpa(item.word)}<button className="pronounce-button" onClick={(event) => { event.stopPropagation(); speakWord(item.word, "UK"); }} aria-label={`播放 ${item.word} 英式發音`}>🔊</button></span></p><p className="tile-meaning">{item.meaning}</p><small>{item.correct ? "最近答對" : "最近答錯"} · 練習 {item.attempts} 次</small><b className="open-arrow" aria-hidden="true">閱</b></div></article>)}</div> : <div className="empty"><b>還沒有這一類單字</b><p>回到今日學習，回答一題後就會收藏在這裡。</p></div>}
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
              {confirmed && <div className={`feedback ${correct ? "good" : "bad"}`}><b>{correct ? "答對了，漂亮！" : `正確答案是「${current.meaning}」`}</b><p><strong>英文例句</strong>{current.example}</p><p><strong>中文翻譯</strong>{current.exampleZh}</p></div>}
            </article>
            {confirmed && (phase === "learn" ? <div className="classify"><span>這個字對你來說…</span>{(["mastered", "learning", "new"] as Mastery[]).map((key) => <button className={`mastery-${key}`} key={key} onClick={() => classify(key)}>{key === "mastered" ? "◆" : key === "learning" ? "◈" : "◇"} {LABELS[key]}</button>)}</div> : <button className="next-button" onClick={next}>{assessmentIndex === 9 ? "查看我的程度" : "下一題 →"}</button>)}
            {phase === "learn" && lives <= 0 && !confirmed && <div className="out"><b>今天的 3 次機會用完了</b><p>看一則短廣告，即可增加 1 次作答機會。</p><button onClick={watchAd}>▶ 看廣告 · +1 次機會</button></div>}</>}
          </div>
        </section>
      )}

      {reviewWord && <div className="modal-backdrop" onClick={closeReview}><div className="review-modal" onClick={(e) => e.stopPropagation()}><button className="close" onClick={closeReview}>×</button><div className="review-topline"><span className="pos">回憶錄複習{reviewQueue.length ? ` · ${reviewPosition + 1}/${reviewQueue.length}` : ""}</span><span>♥ 不扣愛心</span></div><h2>{reviewWord.word}<small className="word-pos-inline">{reviewWord.pos}</small></h2><div className="word-details"><span><b>美</b>{AMERICAN_IPA[reviewWord.word]}<button className="pronounce-button" onClick={() => speakWord(reviewWord.word, "US")} aria-label={`播放 ${reviewWord.word} 美式發音`}>🔊</button></span><span><b>英</b>{britishIpa(reviewWord.word)}<button className="pronounce-button" onClick={() => speakWord(reviewWord.word, "UK")} aria-label={`播放 ${reviewWord.word} 英式發音`}>🔊</button></span></div><p className="review-prompt">請選出最適合的中文意思</p><div className="answers review-answers">{reviewChoices.map((choice, i) => { const state = reviewSelected ? choice === reviewWord.meaning ? "correct" : choice === reviewSelected ? "wrong" : "muted" : ""; return <button key={choice} className={state} onClick={() => answerReview(choice)}><b>{LETTERS[i]}</b><span>{choice}</span>{state === "correct" && <i>✓</i>}{state === "wrong" && <i>×</i>}</button>; })}</div>{reviewSelected && <><div className={`feedback ${reviewSelected === reviewWord.meaning ? "good" : "bad"}`}><b>{reviewSelected === reviewWord.meaning ? "答對了，記得很清楚！" : `答錯了，正確答案是「${reviewWord.meaning}」`}</b><p><strong>英文例句</strong>{reviewWord.example}</p><p><strong>中文翻譯</strong>{reviewWord.exampleZh}</p></div><div className="review-note">本次複習不扣除任何愛心 · 請重新標記熟悉程度</div><div className="modal-actions">{(["mastered", "learning", "new"] as Mastery[]).map((key) => <button className={`mastery-${key} ${reviewWord.mastery === key ? "chosen" : ""}`} key={key} onClick={() => { setMemory((list) => list.map((x) => x.word === reviewWord.word ? { ...x, mastery: key } : x)); setReviewWord({ ...reviewWord, mastery: key }); }}>{LABELS[key]}</button>)}</div>{reviewQueue.length > 0 && <button className="review-next" onClick={nextCategoryReview}>{reviewPosition + 1 >= reviewQueue.length ? "完成這次複習 ✓" : "下一個隨機單字 →"}</button>}</>}</div></div>}

      {adOpen && <div className="modal-backdrop"><div className="ad-modal"><div className="ad-label">ADVERTISEMENT</div><div className="fake-ad"><b>FOCUS.</b><p>Good habits build great results.</p></div>{adSeconds > 0 ? <p>廣告將在 {adSeconds} 秒後結束…</p> : <button onClick={finishAd}>領取 +1 次機會</button>}</div></div>}
    </main>
  );
}
