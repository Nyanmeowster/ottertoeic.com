"use client";

import { useEffect, useMemo, useState } from "react";
import { PDF_WORDS } from "./pdfWords";

type Level = "基礎" | "中階" | "進階";
type Mastery = "mastered" | "learning" | "new";
export type Word = { word: string; meaning: string; pos: string; example: string; exampleZh: string; level: Level };
type Memory = Word & { correct: boolean; mastery: Mastery; attempts: number };

const WORDS: Word[] = PDF_WORDS;
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
