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
];

const LABELS: Record<Mastery, string> = { mastered: "背熟了", learning: "還不熟", new: "完全不熟" };
const LETTERS = ["A", "B", "C", "D"];
const dayKey = () => new Date().toLocaleDateString("en-CA");
const mix = <T,>(items: T[]) => [...items].sort(() => Math.random() - 0.5);

function choicesFor(item: Word) {
  const wrong = mix(WORDS.filter((w) => w.meaning !== item.meaning)).slice(0, 3).map((w) => w.meaning);
  return mix([item.meaning, ...wrong]);
}

export default function Home() {
  const [ready, setReady] = useState(false);
  const [phase, setPhase] = useState<"assessment" | "learn" | "memory">("assessment");
  const [assessmentIndex, setAssessmentIndex] = useState(0);
  const [assessmentScore, setAssessmentScore] = useState(0);
  const [level, setLevel] = useState<Level>("基礎");
  const [wordIndex, setWordIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [choices, setChoices] = useState<string[]>([]);
  const [lives, setLives] = useState(3);
  const [memory, setMemory] = useState<Memory[]>([]);
  const [filter, setFilter] = useState<"all" | Mastery>("all");
  const [reviewWord, setReviewWord] = useState<Memory | null>(null);
  const [adOpen, setAdOpen] = useState(false);
  const [adSeconds, setAdSeconds] = useState(5);
  const [retry, setRetry] = useState<Word[]>([]);

  const assessment = useMemo(() => [WORDS[1], WORDS[3], WORDS[8], WORDS[10], WORDS[12], WORDS[16], WORDS[18], WORDS[21], WORDS[25], WORDS[28]], []);
  const pool = useMemo(() => WORDS.filter((w) => w.level === level), [level]);
  const current = phase === "assessment" ? assessment[assessmentIndex] : retry[0] ?? pool[wordIndex % pool.length];

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("toeic-journal") || "null");
    if (saved) {
      setMemory(saved.memory ?? []);
      setLevel(saved.level ?? "基礎");
      if (saved.assessed) setPhase("learn");
      setLives(saved.date === dayKey() ? saved.lives : 3);
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (current) setChoices(choicesFor(current));
    setSelected(null);
  }, [current]);

  useEffect(() => {
    if (!ready) return;
    localStorage.setItem("toeic-journal", JSON.stringify({ memory, level, assessed: phase !== "assessment", lives, date: dayKey() }));
  }, [memory, level, phase, lives, ready]);

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
    if (selected || (phase === "learn" && lives <= 0)) return;
    setSelected(choice);
    const correct = choice === current.meaning;
    if (phase === "assessment") {
      if (correct) setAssessmentScore((n) => n + 1);
      return;
    }
    addMemory(correct);
    if (!correct) {
      setLives((n) => Math.max(0, n - 1));
      setRetry((q) => q.some((w) => w.word === current.word) ? q : [...q, current]);
    } else if (retry[0]?.word === current.word) setRetry((q) => q.slice(1));
  }

  function next() {
    if (phase === "assessment") {
      if (assessmentIndex === 9) {
        const score = assessmentScore;
        const result: Level = score <= 3 ? "基礎" : score <= 7 ? "中階" : "進階";
        setLevel(result);
        setPhase("learn");
      } else setAssessmentIndex((n) => n + 1);
    } else if (!retry.length || retry[0].word !== current.word) setWordIndex((n) => n + 1);
    setSelected(null);
  }

  function classify(mastery: Mastery) {
    setMemory((list) => list.map((x) => x.word === current.word ? { ...x, mastery } : x));
    next();
  }

  function watchAd() {
    setAdOpen(true); setAdSeconds(5);
  }
  function finishAd() {
    setLives((n) => n + 1); setAdOpen(false); setAdSeconds(5);
  }

  if (!ready) return <main className="loading">正在準備你的單字卡…</main>;
  const visibleMemory = memory.filter((x) => filter === "all" || x.mastery === filter);
  const correct = selected === current.meaning;

  return (
    <main>
      <header className="topbar">
        <button className="brand" onClick={() => phase !== "assessment" && setPhase("learn")} aria-label="回到學習">
          <span className="brand-mark">V.</span><span>VOCABULARY<br />JOURNAL</span>
        </button>
        <nav>
          <button disabled={phase === "assessment"} className={phase !== "memory" ? "active" : ""} onClick={() => setPhase("learn")}>今日學習</button>
          <button disabled={phase === "assessment"} className={phase === "memory" ? "active" : ""} onClick={() => setPhase("memory")}>回憶錄 <span>{memory.length}</span></button>
        </nav>
        <div className="lives" aria-label={`剩餘 ${lives} 次機會`}><i>♥</i> {lives}<small> / 今日機會</small></div>
      </header>

      {phase === "memory" ? (
        <section className="memory-page">
          <div className="section-kicker">MY COLLECTION</div>
          <div className="memory-heading"><div><h1>單字回憶錄</h1><p>每一次答題都值得留下來。這裡複習答錯也不會扣除機會。</p></div><div className="memory-total"><b>{memory.length}</b><span>收藏單字</span></div></div>
          <div className="filters">
            {(["all", "mastered", "learning", "new"] as const).map((key) => <button key={key} className={filter === key ? "selected" : ""} onClick={() => setFilter(key)}>{key === "all" ? "全部" : LABELS[key]} <span>{key === "all" ? memory.length : memory.filter((x) => x.mastery === key).length}</span></button>)}
          </div>
          {visibleMemory.length ? <div className="word-grid">{visibleMemory.map((item) => <button className="word-tile" key={item.word} onClick={() => setReviewWord(item)}><div><span className={`dot ${item.mastery}`} />{LABELS[item.mastery]}</div><h2>{item.word}</h2><p>{item.pos} {item.meaning}</p><small>{item.correct ? "最近答對" : "最近答錯"} · 練習 {item.attempts} 次</small><b>↗</b></button>)}</div> : <div className="empty"><b>還沒有這一類單字</b><p>回到今日學習，回答一題後就會收藏在這裡。</p></div>}
        </section>
      ) : (
        <section className="study-page">
          <aside>
            <div className="section-kicker">{phase === "assessment" ? "PLACEMENT TEST" : "TODAY'S SESSION"}</div>
            <h1>{phase === "assessment" ? "先找到你的起點" : "今天，再記住一點。"}</h1>
            <p>{phase === "assessment" ? "10 題快速測驗會找到適合你的難度，答錯不扣每日機會。" : "不用一次學會。把不熟的留下，讓它在最剛好的時候再出現。"}</p>
            <div className="session-stat"><span>{phase === "assessment" ? `${assessmentIndex + 1} / 10` : level}</span><small>{phase === "assessment" ? "程度測驗" : "目前程度"}</small></div>
            <div className="quote">“Small steps, every day.”</div>
          </aside>

          <div className="quiz-wrap">
            <div className="quiz-meta"><span>{phase === "assessment" ? `程度測驗 · ${assessmentIndex + 1} / 10` : retry.length ? "錯題再次出現" : `${level}單字 · 今日學習`}</span><span className="progress-line"><i style={{ width: phase === "assessment" ? `${(assessmentIndex + 1) * 10}%` : "42%" }} /></span></div>
            <article className="card">
              <div className="card-no">{String(phase === "assessment" ? assessmentIndex + 1 : wordIndex + 1).padStart(2, "0")}</div>
              <span className="pos">{current.pos}</span>
              <h2>{current.word}</h2>
              <p className="prompt">請選出最適合的中文意思</p>
              <div className="answers">{choices.map((choice, i) => {
                const state = selected ? choice === current.meaning ? "correct" : choice === selected ? "wrong" : "muted" : "";
                return <button key={choice} className={state} onClick={() => answer(choice)}><b>{LETTERS[i]}</b><span>{choice}</span>{state === "correct" && <i>✓</i>}{state === "wrong" && <i>×</i>}</button>;
              })}</div>
              {selected && <div className={`feedback ${correct ? "good" : "bad"}`}><b>{correct ? "答對了，漂亮！" : `正確答案是「${current.meaning}」`}</b><p>{current.example}</p></div>}
            </article>
            {selected && (phase === "learn" ? <div className="classify"><span>這個字對你來說…</span>{(["mastered", "learning", "new"] as Mastery[]).map((key) => <button key={key} onClick={() => classify(key)}>{key === "mastered" ? "✓" : key === "learning" ? "◐" : "○"} {LABELS[key]}</button>)}</div> : <button className="next-button" onClick={next}>{assessmentIndex === 9 ? "查看我的程度" : "下一題 →"}</button>)}
            {phase === "learn" && lives <= 0 && !selected && <div className="out"><b>今天的 3 次機會用完了</b><p>看一則短廣告，即可增加 1 次作答機會。</p><button onClick={watchAd}>▶ 看廣告 · +1 次機會</button></div>}
          </div>
        </section>
      )}

      {reviewWord && <div className="modal-backdrop" onClick={() => setReviewWord(null)}><div className="review-modal" onClick={(e) => e.stopPropagation()}><button className="close" onClick={() => setReviewWord(null)}>×</button><span className="pos">{reviewWord.pos}</span><h2>{reviewWord.word}</h2><h3>{reviewWord.meaning}</h3><p>{reviewWord.example}</p><div className="review-note">回憶錄複習模式 · 答錯不扣機會</div><div className="modal-actions">{(["mastered", "learning", "new"] as Mastery[]).map((key) => <button className={reviewWord.mastery === key ? "chosen" : ""} key={key} onClick={() => { setMemory((list) => list.map((x) => x.word === reviewWord.word ? { ...x, mastery: key } : x)); setReviewWord({ ...reviewWord, mastery: key }); }}>{LABELS[key]}</button>)}</div></div></div>}

      {adOpen && <div className="modal-backdrop"><div className="ad-modal"><div className="ad-label">ADVERTISEMENT</div><div className="fake-ad"><b>FOCUS.</b><p>Good habits build great results.</p></div>{adSeconds > 0 ? <p>廣告將在 {adSeconds} 秒後結束…</p> : <button onClick={finishAd}>領取 +1 次機會</button>}</div></div>}
    </main>
  );
}
