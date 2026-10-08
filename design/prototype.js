// Display-only mock FX; native quotes and recorded trade currencies stay intact.
const mockFx = { usdKrw: 1350, at: "2026-09-22T10:30:00+09:00" };

const stocks = [
  { ticker: "005930", name: "삼성전자", market: "KOSPI", logo: "삼성", price: 72600, priceText: "72,600원", change: 1200, changeText: "+1,200원", rate: "+1.68%", direction: "rise", feed: "실시간", feedType: "live", received: "10:32", held: 18, avg: "68,420원" },
  { ticker: "000660", name: "SK하이닉스", market: "KOSPI", logo: "SK", price: 184500, priceText: "184,500원", change: -2500, changeText: "−2,500원", rate: "−1.34%", direction: "fall", feed: "실시간", feedType: "live", received: "10:32", held: 5, avg: "178,200원" },
  { ticker: "TSLA", name: "Tesla", market: "NASDAQ", logo: "T", price: 430.17, priceText: "$430.17", change: 7.42, changeText: "+$7.42", rate: "+1.76%", direction: "rise", feed: "15분 지연", feedType: "delayed", received: "10:17", held: 0, avg: "—" },
  { ticker: "069500", name: "KODEX 200", market: "KOSPI ETF", logo: "KDX", price: 36175, priceText: "36,175원", change: 0, changeText: "0원", rate: "0.00%", direction: "flat", feed: "주기 조회", feedType: "poll", received: "10:32", held: 22, avg: "34,910원" },
  { ticker: "AAPL", name: "Apple", market: "NASDAQ", logo: "A", price: 245.18, priceText: "$245.18", change: -1.2, changeText: "−$1.20", rate: "−0.49%", direction: "fall", feed: "실시간", feedType: "live", received: "10:32", held: 4, avg: "$231.22" },
  { ticker: "005380", name: "현대차", market: "KOSPI", logo: "현대", price: 247500, priceText: "247,500원", change: 3500, changeText: "+3,500원", rate: "+1.43%", direction: "rise", feed: "실시간", feedType: "live", received: "10:32", held: 7, avg: "238,000원" },
  { ticker: "MSFT", name: "Microsoft", market: "NASDAQ", logo: "M", price: 512.4, priceText: "$512.40", change: 2.18, changeText: "+$2.18", rate: "+0.43%", direction: "rise", feed: "주기 조회", feedType: "poll", received: "10:32", held: 0, avg: "—" }
];

const searchUniverse = [stocks[0], stocks[1], stocks[5], stocks[2], stocks[4], stocks[3], stocks[6]];

const state = {
  route: "stocks",
  scenario: "normal",
  stockTab: "watch",
  searchScope: "all",
  watchTickers: ["005930", "000660", "TSLA", "069500", "AAPL"],
  selectedTicker: "005930",
  detailOpen: false,
  reorderDraft: [],
  orderSide: "buy",
  orderDraft: { price: "", quantity: "" },
  entity: "all",
  portfolioTab: "holdings",
  aiDetailTab: "holdings",
  aiMenuOpen: false,
  desktopPanel: null,
  selectedAi: "swing",
  selectedAiDraft: null,
  aiStatuses: { swing: "running", long: "stopped" },
  aiReserved: { swing: 1200000, long: 0 },
  aiDrafts: [],
  tradeFilter: { start: "2026-08-22", end: "2026-09-22", market: "all" },
  tradeFilterApplied: { start: "2026-08-22", end: "2026-09-22", market: "all" },
  tradeVisible: {},
  tradeHistory: {},
  decisionHistory: {},
  orderMessage: "",
  orderMessageOwner: null,
  seller: "personal",
  fundTransfers: { swing: 0, long: 0 },
  fundTarget: null
};

const aiFixtures = {
  swing: { name: "밸런스 중기", type: "중기", asset: 15632010, twr: "+12.68%", drawdown: "−2.88%", original: 12000000, cash: 4340000, reserved: 1200000, holdings: [{ ticker: "005930", quantity: 12, avg: "69,100원" }, { ticker: "000660", quantity: 6, avg: "181,500원" }, { ticker: "005380", quantity: 3, avg: "247,000원" }], records: [{ time: "09.22 10:20", kind: "buy", ticker: "005380", title: "지정가 주문 판단", description: "후보 탐색 24종목 → 현재가·최근 일봉·거래량과 사용 가능 현금 확인 → 지정가 247,000원 5주", result: "3주 체결 · 2주 미체결" }, { time: "09.22 09:30", kind: "other", ticker: "005930", title: "관망", description: "보유 12주와 미체결 주문 없음 확인. 구체적인 전략 기준은 보류 상태입니다.", result: "주문 없음" }, { time: "09.21 14:40", kind: "buy", ticker: "000660", title: "체결·장부 반영 완료", description: "지정가 181,500원 6주 · 전체체결 · 장부 반영 완료", result: "장부 대조 완료" }] },
  long: { name: "컴파운드 장기", type: "장기", asset: 7542000, twr: "+5.72%", drawdown: "−1.03%", original: 6000000, cash: 2100000, reserved: 0, holdings: [{ ticker: "005930", quantity: 8, avg: "68,900원", pnl: "+27,300원" }], records: [{ time: "09.20 15:10", kind: "other", scope: "operation", title: "자동매매 중지 완료", description: "미체결 자동 주문이 모두 종료된 것을 확인했습니다. 보유종목은 유지됩니다.", result: "중지 완료" }, { time: "09.19 09:45", kind: "other", ticker: "005930", title: "보유 유지", description: "기존 보유 8주를 확인하고 신규 주문을 제출하지 않았습니다. 구체적인 전략 기준은 보류 상태입니다.", result: "주문 없음" }] }
};

// Older display-only checks demonstrate paging without creating a trading policy.
Object.entries(aiFixtures).forEach(([key, ai]) => {
  ai.records = ai.records.map((record, index) => ({ ...record, id: `${key}-recent-${index}` }));
  const firstDay = key === "swing" ? 21 : 18;
  const clocks = ["14:30", "14:00", "13:30", "13:00", "12:30", "12:00", "11:30"];
  for (let day = firstDay; day >= 16; day -= 1) {
    clocks.forEach((clock) => {
      const date = `09.${String(day).padStart(2, "0")}`;
      ai.records.push({ id: `${key}-${date}-${clock}`, time: `${date} ${clock}`, kind: "other", scope: "holdings", tickers: ai.holdings.map((holding) => holding.ticker), title: "보유 현황 점검", description: "보유수량과 사용 가능 현금을 확인했습니다. 화면 검토용 기록이며 구체적인 전략 기준은 보류 상태입니다.", result: "주문 없음" });
    });
  }
});

const aiTypeLetters = { 초단타: "S", 중기: "M", 장기: "L" };

const twrSamples = {
  swing: [
    ["2026-09-16T10:00:00+09:00", 0], ["2026-09-17T00:00:00+09:00", 0.8],
    ["2026-09-18T00:00:00+09:00", 2.8], ["2026-09-19T00:00:00+09:00", 5.0],
    ["2026-09-20T00:00:00+09:00", 7.4], ["2026-09-21T00:00:00+09:00", 9.3],
    ["2026-09-22T00:00:00+09:00", 12.68]
  ],
  long: [
    ["2026-09-16T11:00:00+09:00", 0], ["2026-09-17T00:00:00+09:00", 0.4],
    ["2026-09-18T00:00:00+09:00", 1.2], ["2026-09-19T00:00:00+09:00", 2.3],
    ["2026-09-20T00:00:00+09:00", 3.3], ["2026-09-21T00:00:00+09:00", 4.2],
    ["2026-09-22T00:00:00+09:00", 5.72]
  ]
};

const previewOrders = [
  { id: "samsung", stock: "삼성전자", ticker: "005930", side: "매수", price: "72,600원", quantity: 10, filled: 0, status: "접수", badge: "is-accent", time: "10:28:42", owner: "개인" },
  { id: "hyundai", stock: "현대차", ticker: "005380", side: "매수", price: "247,000원", quantity: 5, filled: 3, status: "부분체결", badge: "is-warning", time: "10:14:08", owner: "밸런스 중기" },
  { id: "apple", stock: "Apple", ticker: "AAPL", side: "매도", price: "$246.00", exchangeRate: mockFx.usdKrw, fxAt: mockFx.at, quantity: 2, filled: 0, status: "접수", badge: "is-accent", time: "09:58:31", owner: "개인" }
];

const previewTrades = [
  { stock: "Tesla", side: "매도", price: "$430.17", quantity: "2주", status: "전체체결", time: "09.22 09:52", date: "2026-09-22", market: "us", owner: "개인" },
  { stock: "삼성전자", side: "매수", price: "71,900원", quantity: "8주", status: "전체체결", time: "09.18 14:22", date: "2026-09-18", market: "kr", owner: "개인" },
  { stock: "현대차", side: "매수", price: "245,500원", quantity: "2주", status: "부분체결 후 취소", time: "09.16 10:04", date: "2026-09-16", market: "kr", owner: "밸런스 중기" },
  { stock: "Apple", side: "매수", price: "$242.10", quantity: "1주", status: "전체체결", time: "08.28 23:14", date: "2026-08-28", market: "us", owner: "개인" }
];

// Recent mock fills keep the scroll continuation visible during prototype review.
const sampleTradeDates = [];
for (let day = new Date(Date.UTC(2026, 8, 21)); sampleTradeDates.length < 21; day.setUTCDate(day.getUTCDate() - 1)) {
  if (day.getUTCDay() !== 0 && day.getUTCDay() !== 6) sampleTradeDates.push(day.toISOString().slice(0, 10));
}
const tradeExamples = [
  { owner: "개인", stock: "삼성전자", side: "매수", price: "71,900원", quantity: "2주", market: "kr", clock: "14:22" },
  { owner: aiFixtures.swing.name, stock: "SK하이닉스", side: "매수", price: "181,500원", quantity: "1주", market: "kr", clock: "10:18" },
  { owner: aiFixtures.long.name, stock: "삼성전자", side: "매수", price: "68,900원", quantity: "1주", market: "kr", clock: "09:45" }
];
sampleTradeDates.forEach((date, index) => {
  tradeExamples.forEach((example, ownerIndex) => {
    const variant = index % 3;
    const stock = ownerIndex === 0 && variant === 1 ? "Apple" : ownerIndex === 1 && variant === 2 ? "현대차" : example.stock;
    const usd = stock === "Apple";
    const hour = usd ? "23" : example.clock.slice(0, 2);
    const minute = String((Number(example.clock.slice(3)) + index * 3) % 60).padStart(2, "0");
    previewTrades.push({ ...example, stock, side: variant === 2 ? "매도" : example.side, price: usd ? "$242.10" : stock === "현대차" ? "245,500원" : example.price, market: usd ? "us" : "kr", status: "전체체결", date, time: `${date.slice(5, 7)}.${date.slice(8)} ${hour}:${minute}` });
  });
});
// Each historic USD fixture explicitly carries its own mock conversion snapshot.
// A real record without FX must remain unavailable rather than use today's rate.
previewTrades.forEach((trade) => {
  if (trade.market !== "us") return;
  trade.exchangeRate = 1350;
  trade.fxAt = `${trade.date}T${trade.time.slice(-5)}:00+09:00`;
});
previewTrades.sort((a, b) => b.date.localeCompare(a.date) || b.time.localeCompare(a.time));

const pageContent = document.getElementById("pageContent");
const scenarioSelect = document.getElementById("scenarioSelect");
const searchDialog = document.getElementById("searchDialog");
const searchInput = document.getElementById("searchInput");
const searchResults = document.getElementById("searchResults");
const searchCount = document.getElementById("searchCount");
const confirmDialog = document.getElementById("confirmDialog");
const amendDialog = document.getElementById("amendDialog");
const amendForm = document.getElementById("amendForm");
const aiFormDialog = document.getElementById("aiFormDialog");
const aiForm = document.getElementById("aiForm");
const aiFormError = document.getElementById("aiFormError");
const aiStockSearchInput = document.getElementById("aiStockSearchInput");
const aiStockResults = document.getElementById("aiStockResults");
const aiRenameDialog = document.getElementById("aiRenameDialog");
const aiRenameForm = document.getElementById("aiRenameForm");
const reorderDialog = document.getElementById("reorderDialog");
const reorderList = document.getElementById("reorderList");
const tradeNotifications = document.getElementById("tradeNotifications");
const tradeNotificationList = document.getElementById("tradeNotificationList");
const mobileNotificationDialog = document.getElementById("mobileNotificationDialog");
let notificationCloseToRecord = false;
const notificationMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
let confirmCallback = null;
let confirmCancelCallback = null;
let amendOrder = null;
let amendReview = null;
let aiRenameTarget = null;
let searchTimer = null;
let aiCreation = { selectionMode: "auto", tickers: [], source: "search" };
let aiTargetEditTarget = null;
const dialogClosures = new Map();
const panelClosures = new Map();

function closeAnimatedDialog(dialog, value = "") {
  if (!dialog?.open || dialogClosures.has(dialog)) return;
  const finish = () => {
    const pending = dialogClosures.get(dialog);
    if (!pending) return;
    window.clearTimeout(pending.timer);
    dialog.removeEventListener("animationend", pending.onEnd);
    dialogClosures.delete(dialog);
    dialog.classList.remove("is-closing");
    for (const property of ["--dialog-exit-opacity", "--dialog-exit-transform", "--dialog-exit-backdrop", "--dialog-exit-blur"]) dialog.style.removeProperty(property);
    dialog.inert = false;
    dialog.close(value);
  };
  const onEnd = (event) => {
    if (event.target === dialog && event.animationName === "dialog-exit") finish();
  };
  dialogClosures.set(dialog, { onEnd, finish, timer: null });
  if (notificationMotion.matches) { finish(); return; }
  const style = window.getComputedStyle(dialog);
  const backdrop = window.getComputedStyle(dialog, "::backdrop");
  dialog.style.setProperty("--dialog-exit-opacity", style.opacity);
  dialog.style.setProperty("--dialog-exit-transform", style.transform);
  dialog.style.setProperty("--dialog-exit-backdrop", backdrop.backgroundColor);
  dialog.style.setProperty("--dialog-exit-blur", backdrop.backdropFilter);
  dialog.inert = true;
  dialog.classList.add("is-closing");
  dialog.addEventListener("animationend", onEnd);
  dialogClosures.get(dialog).timer = window.setTimeout(finish, 180);
}

function setAnimatedPanelOpen(panel, open) {
  const pending = panelClosures.get(panel);
  if (pending) {
    window.clearTimeout(pending.timer);
    panel.removeEventListener("transitionend", pending.onEnd);
    panelClosures.delete(panel);
  }
  panel.inert = !open;
  panel.setAttribute("aria-hidden", String(!open));
  if (open) {
    if (panel.hidden) {
      panel.hidden = false;
      // Commit the hidden panel's initial style before starting the transition.
      void panel.offsetHeight;
    }
    panel.classList.remove("is-closing");
    panel.classList.add("is-open");
    return;
  }
  if (panel.hidden) return;
  panel.classList.remove("is-open");
  const finish = () => {
    const closing = panelClosures.get(panel);
    if (!closing) return;
    window.clearTimeout(closing.timer);
    panel.removeEventListener("transitionend", closing.onEnd);
    panelClosures.delete(panel);
    panel.hidden = true;
    panel.classList.remove("is-closing");
  };
  const onEnd = (event) => {
    if (event.target === panel && event.propertyName === "opacity") finish();
  };
  panelClosures.set(panel, { onEnd, finish, timer: null });
  if (notificationMotion.matches) { finish(); return; }
  panel.classList.add("is-closing");
  panel.addEventListener("transitionend", onEnd);
  panelClosures.get(panel).timer = window.setTimeout(finish, 180);
}

document.querySelectorAll("dialog").forEach((dialog) => {
  dialog.addEventListener("cancel", (event) => {
    event.preventDefault();
    closeAnimatedDialog(dialog, "cancel");
  });
});
document.addEventListener("submit", (event) => {
  const form = event.target;
  if (event.defaultPrevented || form.method !== "dialog") return;
  event.preventDefault();
  closeAnimatedDialog(form.closest("dialog"), event.submitter?.value ?? "");
});

function stockByTicker(ticker) {
  return stocks.find((stock) => stock.ticker === ticker);
}

function directionClass(direction) {
  return direction === "rise" ? "is-rise" : direction === "fall" ? "is-fall" : "is-flat";
}

function comma(value) {
  return Number(value || 0).toLocaleString("ko-KR");
}

function stockCurrency(stock) {
  return stock.market.includes("NASDAQ") ? "USD" : "KRW";
}

function toWon(value, currency, exchangeRate) {
  if (!Number.isFinite(value)) return null;
  if (currency === "KRW") return value;
  if (currency !== "USD" || !Number.isFinite(exchangeRate) || exchangeRate <= 0) return null;
  return value * exchangeRate;
}

function formatWon(value, signed = false) {
  if (value === null || !Number.isFinite(value)) return "확인 불가";
  const rounded = Math.round(Math.abs(value));
  const sign = rounded === 0 ? "" : value < 0 ? "−" : signed ? "+" : "";
  return `${sign}${comma(rounded)}원`;
}

function nativeMoneyInWon(text, exchangeRate = mockFx.usdKrw) {
  if (!text || text === "—") return null;
  const numeric = text.replace(/[^0-9.]/g, "");
  if (!/^\d+(\.\d+)?$/.test(numeric) || (!text.includes("$") && !text.endsWith("원"))) return null;
  const value = Number(numeric);
  return toWon(value, text.includes("$") ? "USD" : "KRW", exchangeRate);
}

function formatStockMoney(stock, value, signed = false) {
  return formatWon(toWon(value, stockCurrency(stock), mockFx.usdKrw), signed);
}

function formatAverage(text) {
  return text === "—" ? "—" : formatWon(nativeMoneyInWon(text));
}

function formatTradePrice(trade) {
  // Passing null prevents the default current FX from replacing a missing record rate.
  return formatWon(nativeMoneyInWon(trade.price, trade.exchangeRate ?? null));
}

function isPositiveInteger(value) {
  return /^\d+$/.test(String(value)) && Number.isSafeInteger(Number(value)) && Number(value) > 0;
}

function validOrderDraft(held, isBuy) {
  const { price, quantity } = state.orderDraft;
  return isPositiveInteger(price) && isPositiveInteger(quantity)
    && Number.isSafeInteger(Number(price) * Number(quantity))
    && (isBuy || Number(quantity) <= held);
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[character]);
}

function aiNameTaken(name, except = null) {
  const normalized = name.trim().toLocaleLowerCase("ko-KR");
  return Object.entries(aiFixtures).some(([key, ai]) => (except?.type !== "active" || except.key !== key) && ai.name.toLocaleLowerCase("ko-KR") === normalized)
    || state.aiDrafts.some((draft, index) => (except?.type !== "draft" || except.index !== index) && draft.name.toLocaleLowerCase("ko-KR") === normalized);
}

function openAiRename(target) {
  aiRenameTarget = target;
  const name = target.type === "active" ? aiFixtures[target.key].name : state.aiDrafts[target.index]?.name;
  if (!name) return;
  aiRenameForm.reset();
  aiRenameForm.elements.name.setCustomValidity("");
  aiRenameForm.elements.name.value = name;
  document.getElementById("aiRenameTitle").textContent = `${name} 이름 수정`;
  aiRenameDialog.returnValue = "";
  aiRenameDialog.showModal();
  aiRenameForm.elements.name.focus();
  aiRenameForm.elements.name.select();
}

function aiTraderForTarget(target) {
  return target?.type === "active" ? aiFixtures[target.key] : state.aiDrafts[target?.index];
}

function openAiForm(target = null) {
  const trader = target ? aiTraderForTarget(target) : null;
  if (target && !trader) return;
  aiTargetEditTarget = target;
  aiForm.reset();
  aiCreation = { selectionMode: trader?.selectionMode === "fixed" ? "fixed" : "auto", tickers: [...(trader?.selectedTickers ?? [])], source: "search" };
  aiForm.elements.selectionMode.value = aiCreation.selectionMode;
  document.getElementById("aiFormTitle").textContent = target ? "투자 대상 수정" : "새 트레이더 만들기";
  const traderName = document.getElementById("aiFormTraderName");
  traderName.textContent = trader?.name ?? "";
  traderName.hidden = !target;
  for (const id of ["aiFormBasics", "aiTargetSectionTitle", "aiStrategyNotice"]) document.getElementById(id).hidden = Boolean(target);
  aiStockSearchInput.value = "";
  document.getElementById("aiStockSelectionStatus").textContent = "";
  renderAiStockPicker();
  aiStockResults.scrollTop = 0;
  clearAiFormError();
  const available = personalAvailableCash();
  document.getElementById("aiAmountAvailable").textContent = `개인 미투자 현금 ${comma(entityData("personal").cash)}원 · 주문에 묶인 현금 ${formatWon(personalReservedCash())} · 최대 배정 가능 ${comma(available)}원`;
  aiForm.elements.amount.dataset.maxAvailable = String(available);
  const submit = aiForm.querySelector('[value="confirm"]');
  submit.textContent = target ? "투자 대상 저장" : "트레이더 만들기";
  submit.disabled = !target && available === 0;
  aiFormDialog.returnValue = "";
  aiFormDialog.showModal();
  aiForm.querySelector(".ai-create-body").scrollTop = 0;
  if (target) aiForm.querySelector('[name="selectionMode"]:checked').focus({ preventScroll: true });
}

function aiStatus(key = state.selectedAi) {
  return state.aiStatuses[key];
}

function renderShell() {
  renderSidebar();
  document.querySelectorAll("[data-route]").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.route === state.route);
    if (button.closest("nav")) button.setAttribute("aria-current", button.dataset.route === state.route ? "page" : "false");
  });
  renderAiNavigation();
  renderTopbarMarkets();
  renderGlobalBanner();
  renderNotifications();
}

function renderSidebar() {
  const open = window.innerWidth > 820 && state.desktopPanel !== null;
  const panels = document.getElementById("sidebarPanels");
  if (open) panels.dataset.panel = state.desktopPanel;
  panels.classList.toggle("is-open", open);
  panels.inert = !open;
  panels.setAttribute("aria-hidden", String(!open));
  document.getElementById("sidebarNotificationsHost").hidden = panels.dataset.panel !== "notifications";
  const notificationButton = document.querySelector('.sidebar [data-action="open-notifications"]');
  notificationButton.classList.toggle("is-panel-open", open && state.desktopPanel === "notifications");
  notificationButton.setAttribute("aria-expanded", String(open && state.desktopPanel === "notifications"));
  syncNotificationPlacement();
}

function renderAiNavigation() {
  const desktop = window.innerWidth > 820;
  const open = desktop ? state.desktopPanel === "ai" : state.route === "ai" && state.aiMenuOpen;
  const items = `${Object.entries(aiFixtures).map(([key, ai]) => {
    const selected = state.selectedAiDraft === null && state.selectedAi === key;
    const status = aiStatus(key) === "running" ? "실행 중" : aiStatus(key) === "stopping" ? "중지 처리 중" : "중지 완료";
    return `<button class="ai-nav-item ${selected ? "is-selected" : ""}" type="button" data-ai="${key}" aria-current="${selected && state.route === "ai" ? "page" : "false"}"><span class="ai-nav-avatar" aria-hidden="true">${aiTypeLetters[ai.type]}</span><span class="ai-nav-copy"><strong>${escapeHtml(ai.name)}</strong><small>${ai.type} · ${status}</small></span></button>`;
  }).join("")}${state.aiDrafts.map((draft, index) => {
    const selected = state.selectedAiDraft === index;
    return `<button class="ai-nav-item ${selected ? "is-selected" : ""}" type="button" data-ai-draft="${index}" aria-current="${selected && state.route === "ai" ? "page" : "false"}"><span class="ai-nav-avatar" aria-hidden="true">${aiTypeLetters[draft.style]}</span><span class="ai-nav-copy"><strong>${escapeHtml(draft.name)}</strong><small>${draft.style} · 초안</small></span></button>`;
  }).join("")}<button class="ai-nav-add" type="button" data-action="ai-create"><span aria-hidden="true">＋</span> AI 트레이더 추가</button>`;
  const submenu = document.getElementById("aiNavSubmenu");
  const list = submenu.querySelector(".ai-nav-list");
  if (list.innerHTML !== items) list.innerHTML = items;
  submenu.hidden = !desktop || document.getElementById("sidebarPanels").dataset.panel !== "ai";
  const mobilePicker = document.getElementById("mobileAiPicker");
  setAnimatedPanelOpen(mobilePicker, !desktop && open);
  if (!desktop && open && mobilePicker.innerHTML !== items) mobilePicker.innerHTML = items;
  document.querySelectorAll('[data-route="ai"]').forEach((button) => {
    button.setAttribute("aria-expanded", String(open && desktop === Boolean(button.closest(".sidebar"))));
    button.classList.toggle("is-panel-open", desktop && open && Boolean(button.closest(".sidebar")));
  });
}

function closeDesktopPanel(restoreFocus = document.getElementById("sidebarPanels").contains(document.activeElement)) {
  const panel = state.desktopPanel;
  state.desktopPanel = null;
  renderSidebar();
  renderAiNavigation();
  if (restoreFocus && panel) document.querySelector(panel === "ai" ? '.sidebar [data-route="ai"]' : '.sidebar [data-action="open-notifications"]')?.focus({ preventScroll: true });
}

function toggleDesktopPanel(panel) {
  if (state.desktopPanel === panel) { closeDesktopPanel(); return; }
  state.desktopPanel = panel;
  renderSidebar();
  renderAiNavigation();
  const target = panel === "ai" ? document.querySelector("#aiNavSubmenu .ai-nav-item.is-selected") : tradeNotificationList;
  target?.focus({ preventScroll: true });
}

// Alerts are mock fill summaries; dismissal never changes their source records.
function notificationFromTrade(trade, id) {
  const ownerKey = trade.ownerKey ?? (trade.owner === "개인" ? "personal" : Object.keys(aiFixtures).find((key) => aiFixtures[key].name === trade.owner));
  return { ...trade, id, ownerKey, at: new Date(`${trade.date}T${trade.time.slice(-5)}:00+09:00`).getTime() };
}
const fillNotifications = previewTrades.slice(0, 8).map((trade, index) => notificationFromTrade(trade, `history-fill-${index}`));
fillNotifications.push(notificationFromTrade({ ownerKey: "swing", stock: "현대차", side: "매수", quantity: "3주", price: "247,000원", date: "2026-09-22", time: "09.22 10:14" }, "hyundai-partial-fill"));
const dismissedNotifications = new Set();
const enteredNotifications = new Set();
const notificationDeletions = new Map();
const notificationEntrances = new Map();
let mockFillSequence = 0;

function activeNotifications() {
  return fillNotifications.filter((item) => !dismissedNotifications.has(item.id)).sort((a, b) => b.at - a.at || (b.sequence ?? 0) - (a.sequence ?? 0));
}

function notificationOwner(item) {
  return item.ownerKey === "personal" ? "개인" : aiFixtures[item.ownerKey]?.name ?? "AI";
}

function notificationCardContents(item) {
  const owner = escapeHtml(notificationOwner(item));
  const title = `${escapeHtml(item.stock)} ${item.side}`;
  const price = formatTradePrice(item);
  return `<button class="trade-notification__body" type="button" data-notification-open="${item.id}" aria-label="${owner} ${title} ${item.quantity} · 주당 ${price} · ${escapeHtml(item.time)} · 주문·거래 보기" title="${owner} ${title} ${item.quantity} · 주당 체결가 ${price}">
    <span class="trade-notification__owner">${owner}</span><time datetime="${item.date}T${item.time.slice(-5)}:00+09:00">${escapeHtml(item.time)}</time>
    <span class="trade-notification__summary"><strong class="trade-notification__trade">${title}</strong><span class="trade-notification__amount"><span class="trade-notification__quantity">${item.quantity}</span><span class="trade-notification__separator" aria-hidden="true">/</span><span class="trade-notification__price">${price}</span></span></span>
  </button><button class="trade-notification__dismiss" type="button" data-notification-dismiss="${item.id}" aria-label="${owner} ${title} 알림 지우기" title="이 알림 지우기"><svg viewBox="0 0 16 16" aria-hidden="true" focusable="false"><path d="m3 3 10 10M13 3 3 13" /></svg></button>`;
}

function syncNotificationPlacement() {
  const mobile = window.innerWidth <= 820;
  const host = document.getElementById(mobile ? "mobileNotificationsHost" : "sidebarNotificationsHost");
  if (!mobile && mobileNotificationDialog.open) {
    dialogClosures.get(mobileNotificationDialog)?.finish();
    mobileNotificationDialog.close();
  }
  if (tradeNotifications.parentElement !== host) host.append(tradeNotifications);
  // Closed panels must not leave cards in the keyboard order.
  tradeNotifications.inert = !mobile && state.desktopPanel !== "notifications";
  animatePendingNotifications();
}

function animatePendingNotifications() {
  if (!tradeNotifications.getClientRects().length || (window.innerWidth > 820 ? state.desktopPanel !== "notifications" : !mobileNotificationDialog.open)) return;
  tradeNotificationList.querySelectorAll("[data-notification-id]").forEach((card) => {
    const id = card.dataset.notificationId;
    if (enteredNotifications.has(id) || notificationDeletions.has(id)) return;
    enteredNotifications.add(id);
    if (notificationMotion.matches) return;
    const animation = card.animate([{ transform: "translateX(110%)", opacity: 0 }, { transform: "translateX(0)", opacity: 1 }], { duration: 260, easing: "cubic-bezier(0.2, 0.8, 0.2, 1)" });
    notificationEntrances.set(id, animation);
    animation.onfinish = animation.oncancel = () => notificationEntrances.delete(id);
  });
}

function renderNotifications() {
  const items = activeNotifications();
  const activeIds = new Set(items.map((item) => item.id));
  tradeNotificationList.querySelectorAll("[data-notification-id]").forEach((card) => {
    if (!activeIds.has(card.dataset.notificationId)) card.remove();
  });
  tradeNotificationList.querySelector(".notification-empty")?.remove();
  items.forEach((item, index) => {
    let card = tradeNotificationList.querySelector(`[data-notification-id="${item.id}"]`);
    if (!card) {
      card = document.createElement("article");
      card.className = "trade-notification";
      card.dataset.notificationId = item.id;
    }
    const content = notificationCardContents(item);
    // Keep focused controls and running animations intact during unrelated renders.
    if (card.dataset.content !== content && !notificationDeletions.has(item.id)) { card.innerHTML = content; card.dataset.content = content; }
    const position = tradeNotificationList.children[index];
    if (position !== card) tradeNotificationList.insertBefore(card, position ?? null);
  });
  if (!items.length) tradeNotificationList.innerHTML = '<p class="notification-empty">체결 알림이 없습니다.</p>';
  tradeNotifications.querySelector('[data-action="clear-notifications"]').disabled = !items.some((item) => !notificationDeletions.has(item.id));
  document.querySelectorAll("[data-notification-count]").forEach((count) => {
    count.textContent = items.length > 99 ? "99+" : items.length;
    count.classList.toggle("notification-count--overflow", items.length > 99);
    count.hidden = !items.length;
    const label = `남은 체결 알림 ${items.length}개, 목록 보기`;
    count.closest("button").setAttribute("aria-label", label);
    count.closest("button").title = label;
  });
  animatePendingNotifications();
}

function dismissNotifications(ids, restoreKeyboardFocus = false) {
  // Freeze only this batch. A fill arriving during its animation stays in the list.
  const batch = ids.filter((id) => !dismissedNotifications.has(id) && !notificationDeletions.has(id));
  const clearButton = tradeNotifications.querySelector('[data-action="clear-notifications"]');
  const restoreClearFocus = document.activeElement === clearButton;
  const stagger = batch.length > 1 ? Math.min(70, 420 / (batch.length - 1)) : 0;
  batch.forEach((id, index) => {
    const card = tradeNotificationList.querySelector(`[data-notification-id="${id}"]`);
    if (!card) return;
    const controls = [...card.querySelectorAll("button")];
    const restoreFocus = restoreKeyboardFocus && card.contains(document.activeElement);
    const neighbor = card.nextElementSibling ?? card.previousElementSibling;
    const target = neighbor?.querySelector("button");
    const entrance = notificationEntrances.get(id);
    const startStyle = getComputedStyle(card);
    const start = { transform: startStyle.transform, opacity: startStyle.opacity };
    entrance?.cancel();
    controls.forEach((button) => { button.disabled = true; });
    card.classList.add("is-deleting");
    const finish = () => {
      if (!notificationDeletions.has(id)) return;
      notificationDeletions.delete(id);
      dismissedNotifications.add(id);
      renderNotifications();
      if (restoreFocus && (document.activeElement === document.body || card.contains(document.activeElement))) {
        const closeButton = tradeNotifications.querySelector(".notification-mobile-close");
        const fallback = closeButton.getClientRects().length ? closeButton : tradeNotificationList;
        (target?.isConnected && !target.disabled ? target : fallback).focus({ preventScroll: true });
      }
    };
    const animation = notificationMotion.matches || !card.getClientRects().length ? null : card.animate([start, { transform: "translateX(-110%)", opacity: 0 }], { duration: 220, delay: index * stagger, easing: "cubic-bezier(0.4, 0, 0.6, 1)", fill: "forwards" });
    notificationDeletions.set(id, { animation, finish });
    if (animation) animation.onfinish = finish;
    else finish();
  });
  renderNotifications();
  if (restoreClearFocus && clearButton.disabled) tradeNotificationList.focus({ preventScroll: true });
  document.getElementById("notificationStatus").textContent = `${batch.length}개 알림을 지웠습니다. 거래 기록은 유지됩니다.`;
}

function addMockFillNotification() {
  const ownerKey = ["personal", "swing", "long"][mockFillSequence % 3];
  const source = tradeExamples[mockFillSequence % 3];
  const trade = { ...source, owner: ownerKey === "personal" ? "개인" : aiFixtures[ownerKey].name, ownerKey, date: "2026-09-22", time: "09.22 10:32", status: "전체체결" };
  previewTrades.unshift(trade);
  const item = notificationFromTrade(trade, `new-mock-fill-${++mockFillSequence}`);
  item.sequence = mockFillSequence;
  fillNotifications.push(item);
  tradeNotificationList.scrollTop = 0;
  render();
  document.getElementById("notificationStatus").textContent = `${notificationOwner(item)} ${item.stock} ${item.quantity} ${item.side} 모의 체결 알림`;
}

function openTradeNotifications() {
  if (window.innerWidth > 820) {
    toggleDesktopPanel("notifications");
  } else {
    closeAiMenuPopup();
    syncNotificationPlacement();
    notificationCloseToRecord = false;
    if (!mobileNotificationDialog.open) mobileNotificationDialog.showModal();
    document.querySelector('.mobile-nav [data-action="open-notifications"]').setAttribute("aria-expanded", "true");
    animatePendingNotifications();
    tradeNotifications.querySelector(".notification-mobile-close").focus({ preventScroll: true });
  }
}

function openNotificationRecord(id) {
  const item = fillNotifications.find((record) => record.id === id);
  if (!item || dismissedNotifications.has(id) || notificationDeletions.has(id)) return;
  closeDesktopPanel(false);
  if (mobileNotificationDialog.open) {
    notificationCloseToRecord = true;
    mobileNotificationDialog.close();
  }
  if (item.ownerKey === "personal") {
    state.entity = "personal";
    state.portfolioTab = "orders";
    setRoute("portfolio");
  } else {
    state.selectedAi = item.ownerKey;
    state.selectedAiDraft = null;
    state.aiDetailTab = "orders";
    state.aiMenuOpen = false;
    setRoute("ai");
  }
}

function renderTopbarMarkets() {
  const marketError = state.scenario === "market-error";
  document.getElementById("topbarMarkets").innerHTML = marketError
    ? `<span class="market-chip"><span class="status-dot is-error"></span><strong>시장 상태 확인 실패</strong><span>재시도 필요</span></span>`
    : `<span class="market-chip"><span class="status-dot"></span><strong>한국 정규장</strong><span>15:30까지</span></span>
       <span class="market-chip is-closed"><span class="status-dot is-closed"></span><strong>미국 거래시간 외</strong><span>22:00 프리마켓</span></span>`;
}

function renderGlobalBanner() {
  const banner = document.getElementById("globalBanner");
  if (state.scenario === "ledger-mismatch") {
    banner.innerHTML = `<div class="global-banner"><div class="global-banner__copy"><span aria-hidden="true">!</span><div><strong>장부와 실제 계좌가 일치하지 않습니다</strong><p>모든 AI 트레이더의 신규 자동 주문을 차단했습니다. 기존 주문 상태 확인은 계속됩니다.</p></div></div><button class="button button--small button--danger" data-action="reconcile">다시 대조</button></div>`;
  } else if (state.scenario === "disconnected") {
    banner.innerHTML = `<div class="global-banner"><div class="global-banner__copy"><span aria-hidden="true">↻</span><div><strong>실시간 시세 연결이 끊겼습니다</strong><p>마지막 수신 가격을 유지하며 자동 재연결 중입니다.</p></div></div><button class="button button--small button--secondary" data-action="retry-connection">지금 재시도</button></div>`;
  } else if (state.scenario === "order-uncertain") {
    banner.innerHTML = `<div class="global-banner"><div class="global-banner__copy"><span aria-hidden="true">…</span><div><strong>삼성전자 주문 접수 여부를 확인하고 있습니다</strong><p>같은 주문을 다시 보내지 않고 주문 조회 결과를 기다립니다.</p></div></div><button class="button button--small button--secondary" data-action="view-pending-order">주문 보기</button></div>`;
  } else {
    banner.innerHTML = "";
  }
}

let performanceEntranceObserver = null;
let stockDetailMotion = null;
const stockDetailResizeObserver = new ResizeObserver(() => {
  const motion = stockDetailMotion;
  if (!motion) return;
  // Opening a taller panel may add a scrollbar; that width change belongs to this motion.
  const scrollbarChange = Math.abs(document.documentElement.clientWidth - motion.viewportWidth);
  if (Math.abs(motion.layout.getBoundingClientRect().width - motion.width) < scrollbarChange + 0.5) return;
  const completeDetailClose = motion.onComplete;
  clearStockDetailMotion();
  completeDetailClose?.();
});
const tabIndicatorAnimations = new Set();
const tabIndicatorObserver = new ResizeObserver((entries) => {
  const controls = new Set(entries.map((entry) => entry.target.closest("[data-sliding-tabs]")));
  controls.forEach((control) => { if (control?.isConnected) positionTabIndicator(control); });
});

function tabSelection(control) {
  const active = control.querySelector("button.is-active");
  return active?.dataset.stockTab || active?.dataset.portfolioTab || active?.dataset.aiDetailTab || active?.dataset.entity;
}

function captureTabIndicators() {
  return new Map(Array.from(pageContent.querySelectorAll("[data-sliding-tabs]")).map((control) => {
    const indicator = control.querySelector(".tab-indicator");
    const style = indicator && getComputedStyle(indicator);
    return [control.dataset.slidingTabs, { value: tabSelection(control), left: parseFloat(style?.left), width: parseFloat(style?.width) }];
  }));
}

function positionTabIndicator(control) {
  const active = control.querySelector("button.is-active");
  const indicator = control.querySelector(".tab-indicator");
  if (!active || !indicator) return;
  const bounds = control.getBoundingClientRect();
  const button = active.getBoundingClientRect();
  const position = {
    left: button.left - bounds.left - control.clientLeft + control.scrollLeft,
    top: button.top - bounds.top - control.clientTop + control.scrollTop,
    width: button.width,
    height: button.height
  };
  if (Object.entries(position).some(([property, value]) => !Number.isFinite(parseFloat(indicator.style[property])) || Math.abs(parseFloat(indicator.style[property]) - value) > 0.1)) {
    indicator.getAnimations().forEach((animation) => animation.cancel());
    Object.entries(position).forEach(([property, value]) => { indicator.style[property] = `${value}px`; });
  }
  return position;
}

function syncTabIndicators(previous) {
  pageContent.querySelectorAll("[data-sliding-tabs]").forEach((control) => {
    const indicator = document.createElement("span");
    indicator.className = "tab-indicator";
    indicator.setAttribute("aria-hidden", "true");
    control.append(indicator);
    control.classList.add("has-tab-indicator");
    const position = positionTabIndicator(control);
    const before = previous.get(control.dataset.slidingTabs);
    if (position && before && before.value !== tabSelection(control) && Number.isFinite(before.left) && Number.isFinite(before.width) && !notificationMotion.matches) {
      const animation = indicator.animate([
        { left: `${before.left}px`, width: `${before.width}px` },
        { left: `${position.left}px`, width: `${position.width}px` }
      ], { duration: 160, easing: "cubic-bezier(0.2, 0.8, 0.2, 1)" });
      tabIndicatorAnimations.add(animation);
      animation.onfinish = animation.oncancel = () => tabIndicatorAnimations.delete(animation);
    }
    tabIndicatorObserver.observe(control);
    control.querySelectorAll("button").forEach((button) => tabIndicatorObserver.observe(button));
  });
}

function captureStockDetailMotion() {
  const layout = pageContent.querySelector(".stocks-layout");
  if (!layout) return null;
  const detail = layout.querySelector(".stock-detail");
  const style = detail && getComputedStyle(detail);
  return {
    width: layout.querySelector(".surface-card").getBoundingClientRect().width,
    gap: getComputedStyle(layout).rowGap,
    detail: detail && { opacity: style.opacity, transform: style.transform, height: detail.getBoundingClientRect().height },
    moving: Boolean(stockDetailMotion)
  };
}

function clearStockDetailMotion() {
  const motion = stockDetailMotion;
  stockDetailMotion = null;
  if (!motion) return;
  stockDetailResizeObserver.disconnect();
  motion.animations.forEach((animation) => animation.cancel());
  motion.layout.classList.remove("is-detail-moving");
  motion.detail.inert = false;
}

function animateStockDetail(previous, closing = false, onComplete = null) {
  const layout = pageContent.querySelector(".stocks-layout");
  const detail = layout?.querySelector(".stock-detail");
  if (!previous || !detail || notificationMotion.matches) { onComplete?.(); return; }
  if (!closing && previous.detail && !previous.moving) return;
  const wide = window.innerWidth >= 1200;
  const stacked = window.innerWidth > 820 && !wide;
  const list = layout.querySelector(".surface-card");
  const bounds = detail.getBoundingClientRect();
  const offset = wide ? "translateX(12px)" : "translateY(10px)";
  const before = { opacity: previous.detail?.opacity || "0", transform: previous.detail?.transform || offset };
  const after = { opacity: closing ? "0" : "1", transform: closing ? offset : "none" };
  if (stacked) {
    before.height = `${previous.detail?.height || 0}px`;
    after.height = `${closing ? 0 : bounds.height}px`;
  }
  const motion = { layout, detail, width: layout.getBoundingClientRect().width, viewportWidth: document.documentElement.clientWidth, animations: [], onComplete };
  stockDetailMotion = motion;
  layout.classList.add("is-detail-moving");
  detail.inert = closing;
  const options = { duration: 180, easing: "cubic-bezier(0.2, 0.8, 0.2, 1)", fill: "both" };
  motion.animations.push(detail.animate([before, after], options));
  if (wide) {
    const targetWidth = closing ? layout.getBoundingClientRect().width : list.getBoundingClientRect().width;
    motion.animations.push(list.animate([{ width: `${previous.width}px` }, { width: `${targetWidth}px` }], options));
  } else if (stacked) {
    motion.animations.push(layout.animate([{ rowGap: previous.detail ? previous.gap : "0px" }, { rowGap: closing ? "0px" : "18px" }], options));
  }
  stockDetailResizeObserver.observe(layout);
  Promise.all(motion.animations.map((animation) => animation.finished)).then(() => {
    if (stockDetailMotion !== motion) return;
    clearStockDetailMotion();
    onComplete?.();
  }).catch(() => {}); // A new render cancels the previous transition and its callback.
}

function closeStockDetail() {
  if (!state.detailOpen || stockDetailMotion?.onComplete) return;
  const previous = captureStockDetailMotion();
  const ticker = state.selectedTicker;
  clearStockDetailMotion();
  animateStockDetail(previous, true, () => {
    state.detailOpen = false;
    state.orderDraft = { price: "", quantity: "" };
    render();
    pageContent.querySelector(`[data-stock-row="${ticker}"]`)?.focus({ preventScroll: true });
  });
}

function cancelStockDetailClose() {
  if (!stockDetailMotion?.onComplete) return;
  const previous = captureStockDetailMotion();
  clearStockDetailMotion();
  animateStockDetail(previous);
}

function render() {
  // Unrelated updates finish a requested close; explicit stock selection reverses it.
  const completeDetailClose = stockDetailMotion?.onComplete;
  if (completeDetailClose) {
    clearStockDetailMotion();
    completeDetailClose();
    return;
  }
  captureDecisionHistory();
  captureTradeHistory();
  finishHistoryResize();
  const previousStockDetail = captureStockDetailMotion();
  clearStockDetailMotion();
  const previousTabIndicators = captureTabIndicators();
  tabIndicatorAnimations.forEach((animation) => animation.cancel());
  tabIndicatorAnimations.clear();
  tabIndicatorObserver.disconnect();
  const previousChart = pageContent.querySelector("[data-twr-chart]");
  const previousChartKey = previousChart?.dataset.twrChart;
  const entrancePending = previousChart?.classList.contains("is-entering-pending");
  performanceEntranceObserver?.disconnect();
  renderShell();
  if (state.route === "stocks") renderStocksPage();
  if (state.route === "portfolio") renderPortfolioPage();
  if (state.route === "ai") renderAiPage();
  syncDecisionHistory();
  syncTradeHistory();
  syncMobileDetail();
  syncTabIndicators(previousTabIndicators);
  animateStockDetail(previousStockDetail);
  const chart = pageContent.querySelector("[data-twr-chart]");
  if (chart && (chart.dataset.twrChart !== previousChartKey || entrancePending) && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    chart.classList.add("is-entering-pending");
    performanceEntranceObserver = new IntersectionObserver((entries, observer) => {
      if (!chart.isConnected || !chart.classList.contains("is-entering-pending")) return;
      if (!entries.some((entry) => entry.isIntersecting && entry.intersectionRatio >= 0.5)) return;
      chart.classList.remove("is-entering-pending");
      if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        chart.classList.add("is-entering");
        chart.addEventListener("animationend", () => chart.classList.remove("is-entering"), { once: true });
      }
      observer.disconnect();
    }, { threshold: 0.5 });
    performanceEntranceObserver.observe(chart);
  }
}

function renderAndFocus(selector) {
  render();
  pageContent.querySelector(selector)?.focus({ preventScroll: true });
}

function syncMobileDetail() {
  const modalDetail = state.route === "stocks" && state.detailOpen && window.innerWidth <= 820;
  const detail = pageContent.querySelector(".stock-detail");
  document.querySelectorAll(".page-heading, .market-grid, .stocks-layout > .surface-card, .sidebar, .topbar, .mobile-nav").forEach((element) => { element.inert = modalDetail; });
  document.body.classList.toggle("has-mobile-detail", modalDetail);
  if (detail) {
    if (modalDetail) { detail.setAttribute("role", "dialog"); detail.setAttribute("aria-modal", "true"); }
    else { detail.removeAttribute("role"); detail.removeAttribute("aria-modal"); }
  }
}

function marketCards() {
  if (state.scenario === "market-error") {
    return `
      <article class="market-card is-error">
        <div class="market-card__top"><div class="market-card__name"><span class="flag-mark">KR</span><span><strong>한국 시장</strong><small>KST</small></span></div><span class="pill is-danger">확인 실패</span></div>
        <div class="market-card__session"><strong>장 정보를 불러오지 못했어요</strong></div>
        <div class="market-card__footer"><span>휴장이나 거래시간 외로 판단하지 않습니다.</span><button class="button button--small button--secondary" data-action="retry-market">재시도</button></div>
      </article>
      <article class="market-card is-error">
        <div class="market-card__top"><div class="market-card__name"><span class="flag-mark">US</span><span><strong>미국 시장</strong><small>KST</small></span></div><span class="pill is-danger">확인 실패</span></div>
        <div class="market-card__session"><strong>장 정보를 불러오지 못했어요</strong></div>
        <div class="market-card__footer"><span>마지막 확인 10:29:02</span><button class="button button--small button--secondary" data-action="retry-market">재시도</button></div>
      </article>`;
  }
  return `
    <article class="market-card">
      <div class="market-card__top"><div class="market-card__name"><span class="flag-mark">KR</span><span><strong>한국 시장</strong><small>Asia/Seoul · KST</small></span></div><span class="pill">진행 중</span></div>
      <div class="market-card__session"><strong>정규장</strong><span>09:00 – 15:30</span></div>
      <div class="market-card__footer"><span>다음 세션 · 시간외 단일가 16:00</span><span>실시간</span></div>
    </article>
    <article class="market-card">
      <div class="market-card__top"><div class="market-card__name"><span class="flag-mark">US</span><span><strong>미국 시장</strong><small>한국시간 · KST</small></span></div><span class="pill is-muted">거래시간 외</span></div>
      <div class="market-card__session"><strong>정규장 종료</strong><span>05:00 종료</span></div>
      <div class="market-card__footer"><span>다음 세션 · 오늘 22:00 프리마켓</span><span>2026.09.22</span></div>
    </article>`;
}

function visibleStocks() {
  if (state.stockTab === "holdings") return state.seller === "personal" ? stocks.filter((stock) => stock.held > 0) : aiFixtures[state.seller].holdings.map((holding) => stockByTicker(holding.ticker));
  return state.watchTickers.map(stockByTicker).filter(Boolean);
}

function stockRow(stock) {
  const disconnected = state.scenario === "disconnected";
  const exceptionType = disconnected ? "disconnected" : "";
  const exceptionLabel = disconnected ? "연결 끊김" : "";
  const isSelected = stock.ticker === state.selectedTicker && state.detailOpen;
  const priceDetail = state.stockTab === "holdings"
    ? `${state.seller === "personal" ? `${stock.held}주 · 평균 ${formatAverage(stock.avg)}` : `${aiFixtures[state.seller].holdings.find((holding) => holding.ticker === stock.ticker)?.quantity || 0}주 · ${escapeHtml(aiFixtures[state.seller].name)}`}${exceptionLabel ? ` · ${exceptionLabel}` : ""}`
    : exceptionLabel;
  return `<tr class="${isSelected ? "is-selected" : ""}" data-stock-row="${stock.ticker}" role="button" tabindex="0" aria-label="${stock.name} 상세 보기" aria-describedby="stock-price-${stock.ticker} stock-change-${stock.ticker}" aria-expanded="${isSelected}">
    <td><div class="stock-identity"><span class="stock-logo">${stock.logo}</span><span><strong>${stock.name}</strong><small>${stock.ticker} · ${stock.market}</small></span></div></td>
    <td class="is-number price-cell" id="stock-price-${stock.ticker}"><strong>${formatStockMoney(stock, stock.price)}</strong>${priceDetail ? `<span class="status-detail ${exceptionType ? `is-${exceptionType}` : ""}">${priceDetail}</span>` : ""}</td>
    <td class="is-number change-cell ${directionClass(stock.direction)}" id="stock-change-${stock.ticker}"><strong>${formatStockMoney(stock, stock.change, true)}</strong><span>${stock.rate}</span></td>
    <td><span class="row-action row-action--chevron" aria-hidden="true">›</span></td>
  </tr>`;
}

function renderStocksPage() {
  const list = visibleStocks();
  const selected = stockByTicker(state.selectedTicker);
  const showDetail = Boolean(selected) && state.detailOpen;
  pageContent.innerHTML = `
    <header class="page-heading">
      <div class="page-heading__copy"><h1>종목</h1></div>
      <button class="button button--primary" data-action="open-search"><span aria-hidden="true">＋</span> 종목 추가</button>
    </header>
    <section class="market-grid" aria-label="시장 운영 상태">${marketCards()}</section>
    <section class="stocks-layout ${showDetail ? "has-detail" : ""}">
      <article class="surface-card">
        <header class="surface-card__header">
          <div class="segmented-control" data-sliding-tabs="stocks" aria-label="종목 목록">
            <button type="button" class="${state.stockTab === "watch" ? "is-active" : ""}" data-stock-tab="watch" aria-pressed="${state.stockTab === "watch"}">관심 <span>${state.watchTickers.length}</span></button>
            <button type="button" class="${state.stockTab === "holdings" ? "is-active" : ""}" data-stock-tab="holdings" aria-pressed="${state.stockTab === "holdings"}">보유 <span>${state.seller === "personal" ? stocks.filter((stock) => stock.held > 0).length : aiFixtures[state.seller].holdings.length}</span></button>
          </div>
          <div class="table-actions">
            ${state.stockTab === "watch" ? `<button class="button button--small button--secondary" data-action="open-reorder">순서 변경</button>` : ""}
          </div>
        </header>
        ${list.length ? `<table class="stock-table"><thead><tr><th>종목</th><th class="is-number">현재가</th><th class="is-number">전일 대비</th><th></th></tr></thead><tbody>${list.map(stockRow).join("")}</tbody></table>` : `<div class="empty-state"><div><span class="empty-symbol">◎</span><h2>등록한 관심종목이 없어요</h2><p>종목을 추가하면 실시간 가격과 장 상태를 한곳에서 볼 수 있습니다.</p><button class="button button--primary" data-action="open-search">첫 종목 추가</button></div></div>`}
        <footer class="table-footer"><span title="모의 환율 1달러 = 1,350원 · 2026.09.22 10:30 KST">원화 환산 · 모의 환율 10:30 기준</span><span>${list.length}개</span></footer>
      </article>
      ${showDetail ? renderStockDetail(selected) : ""}
    </section>`;
}

function renderStockDetail(stock) {
  const disconnected = state.scenario === "disconnected";
  const estimated = Number(state.orderDraft.price || 0) * Number(state.orderDraft.quantity || 0);
  const isBuy = state.orderSide === "buy";
  const aiHolding = state.seller !== "personal" ? aiFixtures[state.seller].holdings.find((holding) => holding.ticker === stock.ticker) : null;
  const held = state.seller === "personal" ? stock.held : aiHolding?.quantity || 0;
  const avg = state.seller === "personal" ? stock.avg : aiHolding?.avg || "—";
  const ownerName = state.seller === "personal" ? "개인" : escapeHtml(aiFixtures[state.seller].name);
  const validOrder = validOrderDraft(held, isBuy);
  return `<aside class="stock-detail" aria-label="${stock.name} 상세">
    <header class="stock-detail__header">
      <div class="stock-detail__title">
        <div><span class="stock-logo">${stock.logo}</span><span><h2>${stock.name}</h2><small class="cell-secondary">${stock.ticker} · ${stock.market}</small></span></div>
        <button class="icon-button detail-close" type="button" data-action="close-detail" aria-label="${stock.name} 상세 닫기">×</button>
      </div>
      <div class="detail-price-row"><div><div class="detail-price">${formatStockMoney(stock, stock.price)}</div><div class="detail-change ${directionClass(stock.direction)}">${formatStockMoney(stock, stock.change, true)} (${stock.rate}) · 전일 정규장 종가 대비</div></div>${disconnected ? `<span class="status-badge is-disconnected">연결 끊김</span>` : ""}</div>
      <div class="detail-meta-row"><span>토스증권 · ${disconnected ? "마지막 수신" : "시세 수신"} ${stock.received}</span><span>KST</span></div>
    </header>
    <section class="detail-section">
      <div class="section-label">내 보유</div>
      ${held ? `<div class="holding-summary"><div class="holding-main"><strong>${held}주</strong><small>${ownerName} · 평균매입가 ${formatAverage(avg)}</small></div></div>` : `<div class="notice"><strong>${ownerName} 보유분이 없습니다.</strong><span>관심 등록 여부와 실제 보유 여부는 서로 독립적입니다.</span></div>`}
    </section>
    <section class="detail-section">
      <div class="section-label">지정가 주문 · ${ownerName} · 모의 흐름</div>
      <div class="order-side"><button type="button" data-action="order-side" data-side="buy" class="${isBuy ? "is-active" : ""}" ${state.seller !== "personal" ? "disabled" : ""}>매수</button><button type="button" data-action="order-side" data-side="sell" class="${!isBuy ? "is-active" : ""}" ${held ? "" : "disabled"}>매도</button></div>
      <div class="order-form">
        <label class="field"><span>주문가격</span><div class="input-affix"><input data-order-input="price" inputmode="numeric" value="${state.orderDraft.price}" placeholder="${Math.round(toWon(stock.price, stockCurrency(stock), mockFx.usdKrw))}" /><span>원</span></div></label>
        <label class="field"><span>수량</span><div class="input-affix"><input data-order-input="quantity" inputmode="numeric" value="${state.orderDraft.quantity}" placeholder="0" /><span>주</span></div></label>
        <div class="order-estimate"><span>예상 주문금액</span><strong>${formatWon(validOrder ? estimated : 0)}</strong></div>
        <div class="order-support"><span aria-hidden="true">ⓘ</span><span>세션·종목별 실제 주문 지원은 API 확인 전입니다. 아래는 제출되지 않는 모의 흐름입니다.</span></div>
        <button class="button ${isBuy ? "button--primary" : "button--secondary"}" data-action="submit-order" ${validOrder ? "" : "disabled"}>${isBuy ? "매수" : "매도"} 모의 확인</button>
      </div>
    </section>
  </aside>`;
}

function entityData(key = state.entity) {
  if (key.startsWith("draft:")) {
    const draft = state.aiDrafts[Number(key.slice(6))];
    const cash = draft.cash ?? draft.amount;
    return { name: draft.name, description: `${draft.style} 트레이더 · 운용 전 초안`, asset: cash, cash, costBasis: 0, pnl: 0, domestic: 0, us: 0, realized: 0, estimated: 0, tax: 0, fee: 0 };
  }
  const map = {
    all: { name: "전체", description: "개인과 모든 AI 트레이더를 합산한 예시 계좌", asset: 54382410, cash: 17940000, costBasis: 33765150, pnl: 4168520, domestic: 28495100, us: 7947310, realized: 1615100, estimated: 2553420, tax: 230500, fee: 119600 },
    personal: { name: "개인", description: "AI에 배정한 자금을 제외한 개인 귀속 자산", asset: 31208400, cash: 11500000, costBasis: 18552580, pnl: 1804320, domestic: 11761090, us: 7947310, realized: 700000, estimated: 1104320, tax: 95000, fee: 50000 },
    swing: { name: aiFixtures.swing.name, description: "중기 트레이더에게 귀속된 현금·보유·성과", asset: 15632010, cash: 4340000, costBasis: 10035910, pnl: 1952600, domestic: 11292010, us: 0, realized: 750000, estimated: 1202600, tax: 105000, fee: 50000 },
    long: { name: aiFixtures.long.name, description: "장기 트레이더에게 귀속된 현금·보유·성과", asset: 7542000, cash: 2100000, costBasis: 5176660, pnl: 411600, domestic: 5442000, us: 0, realized: 165100, estimated: 246500, tax: 30500, fee: 19600 }
  };
  const entity = { ...map[key] };
  const draftFunding = state.aiDrafts.reduce((total, draft) => total + (draft.cash ?? draft.amount), 0);
  const movement = key === "personal" ? -state.fundTransfers.swing - state.fundTransfers.long - draftFunding : key === "all" ? 0 : state.fundTransfers[key];
  entity.asset += movement;
  entity.cash += movement;
  return entity;
}

function personalReservedCash() {
  return previewOrders.reduce((total, order) => {
    const outstanding = order.quantity - order.filled;
    if (order.owner !== "개인" || order.side !== "매수" || outstanding <= 0 || (order.id === "samsung" && state.scenario === "order-rejected")) return total;
    const price = orderPriceInWon(order);
    return price === null ? NaN : total + price * outstanding;
  }, 0);
}

function personalAvailableCash() {
  const reserved = personalReservedCash();
  const cash = entityData("personal").cash;
  if (!Number.isFinite(reserved) || !Number.isFinite(cash)) return 0;
  return Math.max(0, Math.floor(cash - reserved));
}

function fundTargetCash() {
  const target = state.fundTarget;
  return target?.type === "draft"
    ? state.aiDrafts[target.index].cash ?? state.aiDrafts[target.index].amount
    : aiFixtures[target.key].cash + state.fundTransfers[target.key] - state.aiReserved[target.key];
}

function fundTargetName() {
  const target = state.fundTarget;
  return target?.type === "draft" ? state.aiDrafts[target.index].name : aiFixtures[target.key].name;
}

function renderInvestmentSummary(entity, { draft = false } = {}) {
  const holdingValue = entity.domestic + entity.us;
  const valuationCosts = holdingValue - entity.costBasis - entity.estimated;
  const returnRate = entity.costBasis > 0 ? `${entity.estimated >= 0 ? "+" : ""}${(entity.estimated / entity.costBasis * 100).toFixed(2)}%` : "—";
  const profit = `${entity.estimated > 0 ? "+" : ""}${comma(entity.estimated)}원`;
  const profitTone = directionClass(entity.estimated > 0 ? "rise" : entity.estimated < 0 ? "fall" : "flat");
  const items = [
    ["총 자산", `${comma(entity.asset)}원`, "현금 + 보유 평가액", ""],
    ["미투자 현금", `${comma(entity.cash)}원`, "주문에 묶인 현금 포함", ""],
    ["투자금", `${comma(entity.costBasis)}원`, "현재 보유분의 매입원가", ""],
    ["보유 평가액", `${comma(holdingValue)}원`, "현재 보유분의 시가 평가", ""],
    ["평가 순손익", profit, "평가에 필요한 비용 반영", profitTone],
    ["보유 수익률", returnRate, "평가 순손익 ÷ 투자금", profitTone]
  ];
  return `<section class="metrics-grid investment-summary" aria-label="${escapeHtml(entity.name)} 자산과 보유 투자 현황">${items.map(([label, value, footer, tone]) => `<div class="metric-card"><span class="metric-card__label">${label}</span><strong class="metric-card__value ${tone}">${value}</strong><span class="metric-card__footer">${footer}</span></div>`).join("")}</section>
    <p class="investment-summary__note">${draft ? "개인 현금에서 배정한 금액과 이후 자금 이동을 반영한 모의 현황입니다. 아직 매매·성과 기록이 없으며 실제 계좌 장부에 반영되지 않습니다." : `평가 09.22 10:32 · 환율 기준 10:30 · 원화 환산 모의 금액. 평가 순손익은 보유 평가액에서 투자금과 평가 반영 비용 ${comma(valuationCosts)}원을 뺀 값입니다. 이미 매도한 종목의 실현손익은 제외됩니다.`}</p>`;
}

function performanceChart(aiKey) {
  const ai = aiFixtures[aiKey];
  const points = performancePoints(aiKey);
  const path = points.slice(1).reduce((result, point, index) => {
    const previous = points[index];
    const middle = (previous.x + point.x) / 2;
    return `${result} C${middle} ${previous.y} ${middle} ${point.y} ${point.x} ${point.y}`;
  }, `M${points[0].x} ${points[0].y}`);
  const area = `${path} L${points.at(-1).x} 146 L${points[0].x} 146 Z`;
  const gradientTop = Math.min(...points.map((point) => point.y));
  return `<div class="chart-wrap" data-twr-chart="${aiKey}" role="group" tabindex="0" aria-label="${escapeHtml(ai.name)} 시간가중수익률 평가 기록. 최근 평가 ${ai.twr}. 좌우 화살표로 시점 이동">
    <svg viewBox="0 0 720 190" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id="twr-area-${aiKey}" gradientUnits="userSpaceOnUse" x1="0" y1="${gradientTop}" x2="0" y2="146"><stop offset="0" stop-color="var(--accent)" stop-opacity="0.22"/><stop offset="0.55" stop-color="var(--accent)" stop-opacity="0.08"/><stop offset="1" stop-color="var(--accent)" stop-opacity="0"/></linearGradient>
        <clipPath id="twr-area-clip-${aiKey}"><path d="${area}"/></clipPath>
        <filter id="twr-glow-${aiKey}" x="-20%" y="-50%" width="140%" height="200%"><feGaussianBlur stdDeviation="5"/></filter>
      </defs>
      <line class="chart-grid-line" x1="34" y1="26" x2="704" y2="26"/><line class="chart-grid-line" x1="34" y1="86" x2="704" y2="86"/><line class="chart-grid-line" x1="34" y1="146" x2="704" y2="146"/><text class="chart-label" x="0" y="30">+12%</text><text class="chart-label" x="8" y="90">+6%</text><text class="chart-label" x="20" y="150">0%</text>
      <g class="chart-series"><path class="chart-area" d="${area}" fill="url(#twr-area-${aiKey})"/><g clip-path="url(#twr-area-clip-${aiKey})"><path class="chart-glow" d="${path}" filter="url(#twr-glow-${aiKey})"/></g><path class="chart-line" d="${path}"/></g>
      <line class="chart-cursor-line" x1="34" y1="146" x2="34" y2="146"/><circle class="chart-cursor-dot" cx="34" cy="146" r="6"/><text class="chart-label" x="34" y="183">운용 시작</text><text class="chart-label" x="674" y="183">09.22</text>
    </svg>
    <div class="chart-tooltip" data-chart-tooltip role="status" aria-live="polite" hidden><time data-chart-time></time><strong data-chart-value></strong></div>
  </div>`;
}

function performancePoints(aiKey) {
  const samples = twrSamples[aiKey];
  const first = Date.parse(samples[0][0]);
  const duration = Date.parse(samples.at(-1)[0]) - first;
  return samples.map(([at, value]) => ({
    at,
    value,
    x: Number((34 + (Date.parse(at) - first) / duration * 670).toFixed(2)),
    y: Number((146 - value * 10).toFixed(2))
  }));
}

function showPerformancePoint(chart, index) {
  performanceEntranceObserver?.disconnect();
  chart.classList.remove("is-entering", "is-entering-pending");
  const point = performancePoints(chart.dataset.twrChart)[index];
  const svg = chart.querySelector("svg");
  const matrix = svg.getScreenCTM();
  if (!point || !matrix) return;
  const screen = new DOMPoint(point.x, point.y).matrixTransform(matrix);
  const bounds = chart.getBoundingClientRect();
  const tooltip = chart.querySelector("[data-chart-tooltip]");
  const edge = Math.min(82, bounds.width / 2);
  tooltip.querySelector("[data-chart-time]").textContent = `${point.at.slice(0, 10).replaceAll("-", ".")} ${point.at.slice(11, 16)} KST`;
  tooltip.querySelector("[data-chart-value]").textContent = `${point.value > 0 ? "+" : ""}${point.value.toFixed(2)}%`;
  tooltip.style.left = `${Math.max(edge, Math.min(bounds.width - edge, screen.x - bounds.left))}px`;
  tooltip.classList.toggle("is-below", screen.y - bounds.top < 90);
  tooltip.style.top = `${screen.y - bounds.top + (tooltip.classList.contains("is-below") ? 14 : -12)}px`;
  tooltip.hidden = false;
  chart.querySelector(".chart-cursor-line").setAttribute("x1", point.x);
  chart.querySelector(".chart-cursor-line").setAttribute("x2", point.x);
  chart.querySelector(".chart-cursor-line").setAttribute("y1", point.y);
  chart.querySelector(".chart-cursor-dot").setAttribute("cx", point.x);
  chart.querySelector(".chart-cursor-dot").setAttribute("cy", point.y);
  chart.dataset.chartIndex = String(index);
  chart.classList.add("is-inspecting");
}

function hidePerformancePoint(chart) {
  chart.querySelector("[data-chart-tooltip]").hidden = true;
  chart.classList.remove("is-inspecting");
}

function showNearestPerformancePoint(chart, clientX, clientY) {
  const matrix = chart.querySelector("svg").getScreenCTM();
  if (!matrix) return;
  const cursorX = new DOMPoint(clientX, clientY).matrixTransform(matrix.inverse()).x;
  const points = performancePoints(chart.dataset.twrChart);
  const index = points.reduce((nearest, point, current) => Math.abs(point.x - cursorX) < Math.abs(points[nearest].x - cursorX) ? current : nearest, 0);
  if (chart.classList.contains("is-inspecting") && chart.dataset.chartIndex === String(index)) return;
  showPerformancePoint(chart, index);
}

document.addEventListener("pointermove", (event) => {
  if (event.pointerType === "touch") return;
  const chart = event.target.closest("[data-twr-chart]");
  if (chart) showNearestPerformancePoint(chart, event.clientX, event.clientY);
});

document.addEventListener("pointerout", (event) => {
  const chart = event.target.closest("[data-twr-chart]");
  if (chart && event.pointerType !== "touch" && !chart.contains(event.relatedTarget)) hidePerformancePoint(chart);
});

document.addEventListener("click", (event) => {
  const chart = event.target.closest("[data-twr-chart]");
  if (chart) showNearestPerformancePoint(chart, event.clientX, event.clientY);
  else document.querySelectorAll("[data-twr-chart].is-inspecting").forEach(hidePerformancePoint);
});

document.addEventListener("focusin", (event) => {
  if (event.target.matches("[data-twr-chart]")) showPerformancePoint(event.target, performancePoints(event.target.dataset.twrChart).length - 1);
});

document.addEventListener("focusout", (event) => {
  if (event.target.matches("[data-twr-chart]")) hidePerformancePoint(event.target);
});

document.addEventListener("keydown", (event) => {
  const chart = event.target.closest("[data-twr-chart]");
  if (!chart || !["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
  const last = performancePoints(chart.dataset.twrChart).length - 1;
  const current = Number(chart.dataset.chartIndex ?? last);
  const next = event.key === "Home" ? 0 : event.key === "End" ? last : Math.max(0, Math.min(last, current + (event.key === "ArrowRight" ? 1 : -1)));
  showPerformancePoint(chart, next);
  event.preventDefault();
});

window.addEventListener("resize", () => {
  document.querySelectorAll("[data-twr-chart].is-inspecting").forEach((chart) => showPerformancePoint(chart, Number(chart.dataset.chartIndex)));
});

function renderPortfolioPage() {
  const entity = entityData();
  pageContent.innerHTML = `
    <header class="page-heading entity-heading"><div class="page-heading__copy"><h1>투자 현황</h1></div><div class="subtabs entity-tabs" data-sliding-tabs="portfolio-entity" aria-label="투자 주체"><button class="${state.entity === "all" ? "is-active" : ""}" data-entity="all" aria-pressed="${state.entity === "all"}">전체</button><button class="${state.entity === "personal" ? "is-active" : ""}" data-entity="personal" aria-pressed="${state.entity === "personal"}">개인</button></div></header>
    <div class="entity-heading entity-summary" style="margin-bottom:14px"><div><h2>${escapeHtml(entity.name)}</h2><p class="cell-secondary">${entity.description}</p></div></div>
    ${renderInvestmentSummary(entity)}
    ${renderAccountSection(state.entity, state.portfolioTab, "portfolio")}`;
}

function renderAccountSection(entityKey, tab, context) {
  const tabAttribute = context === "ai" ? "data-ai-detail-tab" : "data-portfolio-tab";
  return `<article class="surface-card">
    <header class="card-heading account-card-heading"><div class="subtabs" data-sliding-tabs="${context}:${entityKey}" aria-label="${escapeHtml(entityData(entityKey).name)} 계좌 내역"><button class="${tab === "holdings" ? "is-active" : ""}" ${tabAttribute}="holdings" aria-pressed="${tab === "holdings"}">보유종목</button><button class="${tab === "pnl" ? "is-active" : ""}" ${tabAttribute}="pnl" aria-pressed="${tab === "pnl"}">손익</button><button class="${tab === "orders" ? "is-active" : ""}" ${tabAttribute}="orders" aria-pressed="${tab === "orders"}">주문·거래</button></div><span class="cell-secondary">금액은 원화 환산</span></header>
    ${renderPortfolioTable(entityKey, tab)}
  </article>`;
}

function accountTrades(entityKey) {
  const name = entityData(entityKey).name;
  return previewTrades.filter((trade) => (entityKey === "all" || trade.owner === name) && trade.date >= state.tradeFilterApplied.start && trade.date <= state.tradeFilterApplied.end && (state.tradeFilterApplied.market === "all" || trade.market === state.tradeFilterApplied.market));
}

function renderAccountTradeRows(trades) {
  return trades.map((trade) => `<tr><td><span class="micro-badge">${escapeHtml(trade.owner)}</span></td><td><strong>${trade.stock}</strong></td><td class="${trade.side === "매수" ? "is-rise" : "is-fall"}">${trade.side}</td><td class="is-number">${formatTradePrice(trade)}</td><td class="is-number">${trade.quantity}</td><td>${trade.status}</td><td>${trade.time}</td><td aria-hidden="true"></td></tr>`).join("");
}

function tradeView(key) {
  return state.tradeHistory[key] ??= { height: 280, scrollTop: 0, scrollLeft: 0 };
}

function captureTradeHistory() {
  const section = pageContent.querySelector("[data-trade-history]");
  if (!section) return;
  const scroll = section.querySelector("[data-trade-scroll]");
  const view = tradeView(section.dataset.tradeHistory);
  view.scrollTop = scroll.scrollTop;
  view.scrollLeft = scroll.scrollLeft;
}

function syncTradeHistory() {
  const section = pageContent.querySelector("[data-trade-history]");
  if (!section) return;
  const view = tradeView(section.dataset.tradeHistory);
  setHistoryHeight(section, view.height, false);
  const scroll = section.querySelector("[data-trade-scroll]");
  scroll.scrollTop = view.scrollTop;
  scroll.scrollLeft = view.scrollLeft;
  view.scrollTop = scroll.scrollTop;
  view.scrollLeft = scroll.scrollLeft;
  fillAccountTradeViewport(section);
}

function resetTradeHistory() {
  state.tradeVisible = {};
  Object.values(state.tradeHistory).forEach((view) => { view.scrollTop = 0; view.scrollLeft = 0; });
  // The next render captures the current DOM, so reset it along with the state.
  const scroll = pageContent.querySelector("[data-trade-scroll]");
  if (scroll) { scroll.scrollTop = 0; scroll.scrollLeft = 0; }
}

function loadNextAccountTrades(section = pageContent.querySelector("[data-trade-history]")) {
  if (!section?.isConnected) return;
  const entityKey = section.dataset.tradeHistory;
  const trades = accountTrades(entityKey);
  const current = Math.min(state.tradeVisible[entityKey] ?? 10, trades.length);
  if (current >= trades.length) return;
  const next = Math.min(current + 10, trades.length);
  const scroll = section.querySelector("[data-trade-scroll]");
  const top = scroll.scrollTop;
  const left = scroll.scrollLeft;
  section.querySelector("tbody").insertAdjacentHTML("beforeend", renderAccountTradeRows(trades.slice(current, next)));
  state.tradeVisible[entityKey] = next;
  scroll.scrollTop = top;
  scroll.scrollLeft = left;
  const view = tradeView(entityKey);
  view.scrollTop = scroll.scrollTop;
  view.scrollLeft = scroll.scrollLeft;
  section.querySelector("[data-trade-count]").textContent = `${next} / ${trades.length}건 표시 · 모의 데이터`;
}

function fillAccountTradeViewport(section) {
  if (!section?.isConnected) return;
  const scroll = section.querySelector("[data-trade-scroll]");
  if (!scroll?.clientHeight) return;
  const key = section.dataset.tradeHistory;
  while (scroll.scrollHeight <= scroll.clientHeight) {
    const before = state.tradeVisible[key] ?? 10;
    loadNextAccountTrades(section);
    if ((state.tradeVisible[key] ?? 10) === before) break;
  }
}

function renderPortfolioTable(entityKey, tab) {
  const entity = entityData(entityKey);
  if (tab === "pnl") {
    if (entityKey.startsWith("draft:")) return `<div class="ai-section-empty"><p>아직 손익 기록이 없습니다.</p></div>`;
    const realizedTax = Math.round(entity.tax * 0.8);
    const realizedFee = Math.round(entity.fee * 0.35);
    const estimatedTax = entity.tax - realizedTax;
    const estimatedFee = entity.fee - realizedFee;
    const realizedCost = realizedTax + realizedFee;
    const estimatedCost = estimatedTax + estimatedFee;
    return `<div class="table-scroll"><table class="data-table"><thead><tr><th>구분</th><th class="is-number">비용 전 손익</th><th class="is-number">세금</th><th class="is-number">수수료</th><th class="is-number">비용 합계</th><th class="is-number">순손익</th></tr></thead><tbody><tr><td><strong>실현손익</strong><span class="cell-secondary">체결된 매도</span></td><td class="is-number is-rise">+${comma(entity.realized + realizedCost)}원</td><td class="is-number">${comma(realizedTax)}원</td><td class="is-number">${comma(realizedFee)}원</td><td class="is-number">${comma(realizedCost)}원</td><td class="is-number is-rise">+${comma(entity.realized)}원</td></tr><tr><td><strong>평가손익</strong><span class="cell-secondary">현재 보유분</span></td><td class="is-number is-rise">+${comma(entity.estimated + estimatedCost)}원</td><td class="is-number">${comma(estimatedTax)}원</td><td class="is-number">${comma(estimatedFee)}원</td><td class="is-number">${comma(estimatedCost)}원</td><td class="is-number is-rise">+${comma(entity.estimated)}원</td></tr><tr><td><strong>총손익</strong></td><td class="is-number is-rise">+${comma(entity.pnl + entity.tax + entity.fee)}원</td><td class="is-number">${comma(entity.tax)}원</td><td class="is-number">${comma(entity.fee)}원</td><td class="is-number">${comma(entity.tax + entity.fee)}원</td><td class="is-number is-rise">+${comma(entity.pnl)}원</td></tr></tbody></table></div><p class="table-note">실현손익은 체결 기록 기준, 평가손익은 현재 보유분 기준 예상값입니다. 총손익은 두 항목의 합계입니다. 위 금액은 화면 검토용 모의 예시이며 실제 비용 산식·제공 값은 API 확인이 필요합니다.</p>`;
  }
  if (tab === "orders") {
    const orders = previewOrders.filter((order) => entityKey === "all" || order.owner === entity.name);
    const trades = accountTrades(entityKey);
    const visible = Math.min(state.tradeVisible[entityKey] ?? 10, trades.length);
    const tradeHeight = historyHeight(tradeView(entityKey).height);
    const tradeId = `trade-history-${entityKey.replace(":", "-")}`;
    const uncertain = state.scenario === "order-uncertain";
    const rejected = state.scenario === "order-rejected";
    const ledgerColumns = `<colgroup><col class="ledger-owner"><col class="ledger-stock"><col class="ledger-side"><col class="ledger-price"><col class="ledger-quantity"><col class="ledger-status"><col class="ledger-time"><col class="ledger-action"></colgroup>`;
    return `<section class="account-order-section" aria-label="주문">
      <div class="account-section-heading"><h4>주문</h4><button class="icon-button" type="button" data-action="refresh-orders" aria-label="주문 상태 새로고침" title="주문 상태 새로고침"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 12a9 9 0 0 1 15.36-6.36L21 8"></path><path d="M21 3v5h-5"></path><path d="M21 12a9 9 0 0 1-15.36 6.36L3 16"></path><path d="M8 16H3v5"></path></svg></button></div>
      ${uncertain ? `<div class="notice notice--warning account-order-notice"><strong>접수 결과를 확인하는 주문이 있습니다.</strong><span>조회 결과가 확인되기 전에는 같은 주문을 다시 제출하지 않습니다.</span></div>` : rejected ? `<div class="notice notice--danger account-order-notice"><strong>삼성전자 주문이 거부됐습니다.</strong><span>거부 사유를 확인한 뒤 다시 주문할 수 있습니다.</span></div>` : ""}
      ${state.orderMessage && (!state.orderMessageOwner || entityKey === "all" || entity.name === state.orderMessageOwner) ? `<p class="inline-feedback" role="status">${escapeHtml(state.orderMessage)}</p>` : ""}
      <div class="table-scroll"><table class="data-table account-ledger-table account-orders-table">${ledgerColumns}<thead><tr><th>투자 주체</th><th>종목</th><th>구분</th><th class="is-number">주문가격</th><th class="is-number">주문·체결 수량</th><th>상태</th><th>주문시각</th><th>관리</th></tr></thead>
      <tbody>${orders.length ? orders.map((order) => {
        const pending = order.id === "samsung" && uncertain;
        const denied = order.id === "samsung" && rejected;
        const remaining = denied ? 0 : order.quantity - order.filled;
        const disabled = pending || denied || !remaining || order.status.includes("요청");
        return `<tr><td><span class="micro-badge">${escapeHtml(order.owner)}</span></td><td><strong>${order.stock}</strong><span class="cell-secondary">${order.ticker}</span></td><td class="${order.side === "매수" ? "is-rise" : "is-fall"}">${order.side}</td><td class="is-number">${formatOrderPrice(order)}</td><td class="is-number"><strong>${order.quantity}주</strong><span class="cell-secondary">${pending ? "체결 — · 잔여 —" : `체결 ${order.filled}주 · 잔여 ${remaining}주`}</span></td><td><span class="micro-badge ${pending ? "is-warning" : denied ? "is-danger" : order.badge}">${pending ? "접수 확인 중" : denied ? "거부" : order.status}</span></td><td>${order.time}</td><td><div class="row-actions"><button class="row-action" data-action="amend-order" data-order-id="${order.id}" ${disabled || !Number.isFinite(orderPriceInWon(order)) ? "disabled" : ""}>정정</button><button class="row-action is-danger" data-action="cancel-order" data-order-id="${order.id}" ${disabled ? "disabled" : ""}>취소</button></div></td></tr>`;
      }).join("") : `<tr><td class="table-empty" colspan="8">주문 내역이 없습니다.</td></tr>`}</tbody></table></div>
      <p class="table-note">09.22 10:32 기준 모의 주문 상태입니다. 금액은 원화로 표시하며 실제 주문·정정·취소 요청은 전송하지 않습니다.</p>
    </section>
    <section class="account-trade-section" data-trade-history="${entityKey}" aria-label="거래내역">
      <h4 class="portfolio-subheading">거래내역</h4>
      <div class="filter-bar">
        <label class="filter-field"><span>시작일</span><input type="date" data-filter="start" value="${state.tradeFilter.start}" /></label>
        <label class="filter-field"><span>종료일</span><input type="date" data-filter="end" value="${state.tradeFilter.end}" /></label>
        <label class="filter-field"><span>시장</span><select data-filter="market"><option value="all" ${state.tradeFilter.market === "all" ? "selected" : ""}>전체 시장</option><option value="kr" ${state.tradeFilter.market === "kr" ? "selected" : ""}>국내</option><option value="us" ${state.tradeFilter.market === "us" ? "selected" : ""}>미국</option></select></label>
        <button class="button button--small button--secondary" data-action="apply-trade-filter">조회</button>
      </div>
      <div class="table-scroll trade-history-scroll" data-trade-scroll id="${tradeId}" role="region" aria-label="거래내역 목록" tabindex="0" style="height:${tradeHeight}px"><table class="data-table account-ledger-table account-trades-table">${ledgerColumns}<thead><tr><th>투자 주체</th><th>종목</th><th>구분</th><th class="is-number">평균 체결가격</th><th class="is-number">체결수량</th><th>결과</th><th>마지막 체결</th><th aria-hidden="true"></th></tr></thead>
        <tbody>${trades.length ? renderAccountTradeRows(trades.slice(0, visible)) : `<tr><td class="table-empty" colspan="8">조건에 맞는 거래내역이 없습니다.</td></tr>`}</tbody></table></div>
      <div class="table-footer"><span data-trade-count role="status" aria-live="polite">${visible} / ${trades.length}건 표시 · 모의 데이터</span></div>
      <p class="table-note">해외 거래는 각 기록에 저장된 모의 환율로 환산합니다. 환율이 없는 기록은 확인 불가로 표시합니다.</p>
      ${renderHistoryResizer("trade", tradeId, tradeHeight)}
    </section>`;
  }
  const ownership = {
    "005930": { personal: 18, swing: 12, long: 8 },
    "000660": { personal: 5, swing: 6 },
    AAPL: { personal: 4 },
    "005380": { personal: 7, swing: 3 }
  };
  const ownerNames = { personal: "개인", swing: aiFixtures.swing.name, long: aiFixtures.long.name };
  const rows = [stocks[0], stocks[1], stocks[4], stocks[5]].filter((stock) => entityKey === "all" || ownership[stock.ticker][entityKey]);
  return `<div class="table-scroll"><table class="data-table account-holdings-table">
    <thead><tr><th>종목</th><th class="is-number">수량</th><th>투자 주체별 수량</th><th class="is-number">평균매입가</th><th class="is-number">현재가</th><th class="is-number">평가금액</th><th class="is-number">평가손익·수익률</th><th></th></tr></thead>
    <tbody>${rows.length ? rows.map((stock) => {
      const owned = ownership[stock.ticker];
      const count = entityKey === "all" ? Object.values(owned).reduce((total, quantity) => total + quantity, 0) : owned[entityKey];
      const ownerDetail = entityKey === "all" ? Object.entries(owned).filter(([, quantity]) => quantity > 0).map(([owner, quantity]) => `${escapeHtml(ownerNames[owner])} ${quantity}`).join(" · ") : `${escapeHtml(ownerNames[entityKey])} ${count}`;
      const formatAmount = (value) => formatStockMoney(stock, Math.abs(value));
      const cost = Object.entries(owned).reduce((total, [owner, quantity]) => {
        if (entityKey !== "all" && entityKey !== owner) return total;
        const averageText = owner === "personal" ? stock.avg : aiFixtures[owner].holdings.find((holding) => holding.ticker === stock.ticker)?.avg;
        return total + Number(averageText?.replace(/[^\d.]/g, "") || 0) * quantity;
      }, 0);
      const average = cost / count;
      const pnl = stock.price * count - cost;
      const rate = (stock.price / average - 1) * 100;
      const movement = pnl > 0 ? "rise" : pnl < 0 ? "fall" : "flat";
      const sign = pnl > 0 ? "+" : pnl < 0 ? "−" : "";
      const rateSign = rate > 0 ? "+" : rate < 0 ? "−" : "";
      const priceStatus = state.scenario === "disconnected" ? "연결 끊김" : stock.feedType === "delayed" ? stock.feed : "";
      return `<tr><td><strong>${stock.name}</strong><span class="cell-secondary">${stock.ticker}</span></td><td class="is-number">${count}주</td><td>${ownerDetail}</td><td class="is-number">${formatAmount(average)}</td><td class="is-number"><strong>${formatStockMoney(stock, stock.price)}</strong>${priceStatus ? `<span class="cell-secondary price-status ${state.scenario === "disconnected" ? "is-disconnected" : "is-delayed"}">${priceStatus}</span>` : ""}</td><td class="is-number">${formatAmount(stock.price * count)}</td><td class="is-number"><strong class="${directionClass(movement)}">${sign}${formatAmount(pnl)}</strong><span class="cell-secondary ${directionClass(movement)}">${rateSign}${Math.abs(rate).toFixed(2)}%</span></td><td><button class="row-action" data-action="choose-seller" data-owner="${entityKey}" data-ticker="${stock.ticker}">매도</button></td></tr>`;
    }).join("") : `<tr><td colspan="8" class="table-empty">보유종목이 없습니다.</td></tr>`}</tbody>
  </table></div>${rows.length ? `<p class="table-note">09.22 10:32 모의 시세 · 모의 환율 1달러 = 1,350원 (10:30 KST). 가격·평균매입가·평가손익은 같은 환율로 환산하고 수익률은 원래 시세 기준을 유지합니다. 비용 전 예시이며 전체 평균매입가는 주체별 보유수량으로 가중합니다. 보유목록은 일부 예시이며 요약 합계와 다릅니다.</p>` : ""}`;
}

const decisionPageSize = 10;
let historyResize = null;

function preserveHistoryResizePage() {
  if (!historyResize) return;
  historyResize.pageFloor = Math.max(historyResize.pageFloor, document.documentElement.scrollHeight);
  document.body.style.minHeight = `${historyResize.pageFloor}px`;
}

function updateHistoryResizeHeight() {
  if (!historyResize) return;
  const resize = historyResize;
  preserveHistoryResizePage();
  setHistoryHeight(resize.section, resize.startHeight + resize.pointY - resize.startY + window.scrollY - resize.startPageY);
}

function continueHistoryResize(time) {
  const resize = historyResize;
  if (!resize) return;
  resize.frame = null;
  const top = Math.max(0, document.querySelector(".topbar").getBoundingClientRect().bottom);
  const mobileNav = document.querySelector(".mobile-nav");
  const bottom = mobileNav.offsetHeight ? mobileNav.getBoundingClientRect().top : window.innerHeight;
  const edge = 48;
  const strength = resize.direction > 0 ? Math.max(0, Math.min(1, (resize.pointY - bottom + edge) / edge))
    : resize.direction < 0 ? -Math.max(0, Math.min(1, (top + edge - resize.pointY) / edge)) : 0;
  if (!strength) { resize.lastFrameTime = null; return; }
  const elapsed = Math.min(32, resize.lastFrameTime === null ? 16 : time - resize.lastFrameTime);
  resize.lastFrameTime = time;
  let step = Math.sign(strength) * Math.max(1, Math.abs(strength * 600 * elapsed / 1000));
  if (step < 0) step = -Math.min(-step, window.scrollY);
  const current = Number(resize.handle.getAttribute("aria-valuenow"));
  const next = historyHeight(current + step);
  if (next === current) return;
  // Grow first so even the page's last panel creates room to scroll into.
  preserveHistoryResizePage();
  setHistoryHeight(resize.section, next);
  window.scrollBy({ top: next - current, behavior: "auto" });
  updateHistoryResizeHeight();
  resize.frame = window.requestAnimationFrame(continueHistoryResize);
}

function decisionView(key) {
  return state.decisionHistory[key] ??= { visible: decisionPageSize, height: 280, scrollTop: 0 };
}

function decisionRecords(key) {
  return aiFixtures[key]?.records || [];
}

function historyHeightBounds() {
  return { min: 160, max: Math.max(160, Math.min(640, Math.floor(window.innerHeight * 0.75))) };
}

function historyHeight(value) {
  const { min, max } = historyHeightBounds();
  return Math.max(min, Math.min(max, Math.round(value)));
}

function historyView(section) {
  return section.hasAttribute("data-trade-history") ? tradeView(section.dataset.tradeHistory) : decisionView(section.dataset.decisionHistory);
}

function historyScroll(section) {
  return section.querySelector("[data-decision-scroll], [data-trade-scroll]");
}

function renderHistoryResizer(type, id, height) {
  const bounds = historyHeightBounds();
  const name = type === "trade" ? "거래내역" : "판단 기록";
  return `<div class="${type === "trade" ? "trade-history" : "decision"}-resizer" data-history-resize="${type}" ${type === "decision" ? "data-decision-resize" : ""} role="separator" aria-orientation="horizontal" aria-label="${name} 높이 조절" aria-controls="${id}" aria-valuemin="${bounds.min}" aria-valuemax="${bounds.max}" aria-valuenow="${height}" aria-valuetext="${height}픽셀" tabindex="0" title="위아래로 드래그하거나 방향키로 높이 조절"></div>`;
}

function renderDecisionRows(records) {
  return records.map((record) => {
    const kind = ["buy", "sell"].includes(record.kind) ? record.kind : "other";
    const kindLabel = { buy: "매수", sell: "매도", other: "기타" }[kind];
    const tickers = [...new Set(record.tickers ?? (record.ticker ? [record.ticker] : []))];
    const subjects = record.scope === "operation" ? `<span class="decision-badge"><span class="sr-only">기록 범위: </span>운영</span>`
      : tickers.length ? tickers.map((ticker) => `<span class="decision-badge decision-badge--stock"><span class="sr-only">${record.scope === "holdings" ? "보유 종목" : "대상 종목"}: </span>${escapeHtml(stockByTicker(ticker)?.name ?? ticker)}</span>`).join("")
        : `<span class="decision-badge">대상 미상</span>`;
    return `<div class="timeline-item" data-decision-id="${escapeHtml(record.id)}"><time>${escapeHtml(record.time)}</time><span class="timeline-rail" aria-hidden="true"><i class="timeline-dot"></i></span><div class="timeline-content"><div class="timeline-heading"><strong>${escapeHtml(record.title)}</strong><span class="decision-badge decision-badge--${kind}"><span class="sr-only">판단 분류: </span>${kindLabel}</span>${subjects}</div><p>${escapeHtml(record.description)}</p><span class="micro-badge">${escapeHtml(record.result)}</span></div></div>`;
  }).join("");
}

function renderDecisionHistory(key) {
  const records = decisionRecords(key);
  const view = decisionView(key);
  const visible = Math.min(view.visible, records.length);
  const height = historyHeight(view.height);
  const id = `decision-history-${key.replace(":", "-")}`;
  return `<article class="surface-card decision-card" data-decision-history="${key}">
    <header class="card-heading"><div class="card-heading__copy"><h3>최근 판단 기록</h3><p>탐색·판단·주문 결과를 연결해 기록</p></div><span class="pill is-muted">전략 기준 보류</span></header>
    <div class="decision-scroll" data-decision-scroll id="${id}" role="region" aria-label="최근 판단 기록" tabindex="0" style="height:${height}px">${records.length ? `<div class="timeline">${renderDecisionRows(records.slice(0, visible))}</div>` : `<div class="ai-section-empty"><p>아직 판단 기록이 없습니다.</p></div>`}</div>
    <div class="decision-footer"><span data-decision-count role="status" aria-live="polite">${visible} / ${records.length}건 표시 · 모의 데이터</span></div>
    ${renderHistoryResizer("decision", id, height)}
  </article>`;
}

function captureDecisionHistory() {
  const section = pageContent.querySelector("[data-decision-history]");
  if (section) decisionView(section.dataset.decisionHistory).scrollTop = section.querySelector("[data-decision-scroll]").scrollTop;
}

function syncDecisionHistory() {
  const section = pageContent.querySelector("[data-decision-history]");
  if (!section) return;
  const view = decisionView(section.dataset.decisionHistory);
  setHistoryHeight(section, view.height, false);
  const scroll = section.querySelector("[data-decision-scroll]");
  scroll.scrollTop = view.scrollTop;
  view.scrollTop = scroll.scrollTop;
}

function setHistoryHeight(section, value, persist = true) {
  const height = historyHeight(value);
  if (persist) historyView(section).height = height;
  historyScroll(section).style.height = `${height}px`;
  const handle = section.querySelector("[data-history-resize]");
  const bounds = historyHeightBounds();
  handle.setAttribute("aria-valuemin", bounds.min);
  handle.setAttribute("aria-valuemax", bounds.max);
  handle.setAttribute("aria-valuenow", height);
  handle.setAttribute("aria-valuetext", `${height}픽셀`);
  if (persist && section.hasAttribute("data-trade-history")) fillAccountTradeViewport(section);
}

function loadNextDecisions(section) {
  if (!section?.isConnected) return;
  const key = section.dataset.decisionHistory;
  const records = decisionRecords(key);
  const view = decisionView(key);
  const current = Math.min(view.visible, records.length);
  if (current >= records.length) return;
  const next = Math.min(current + decisionPageSize, records.length);
  const scroll = section.querySelector("[data-decision-scroll]");
  const top = scroll.scrollTop;
  section.querySelector(".timeline").insertAdjacentHTML("beforeend", renderDecisionRows(records.slice(current, next)));
  view.visible = next;
  scroll.scrollTop = top;
  view.scrollTop = scroll.scrollTop;
  const count = section.querySelector("[data-decision-count]");
  count.textContent = `${next} / ${records.length}건 표시 · 모의 데이터`;
}

document.addEventListener("scroll", (event) => {
  const scroll = event.target;
  if (!scroll.matches?.("[data-decision-scroll], [data-trade-scroll]")) return;
  const section = scroll.closest("[data-decision-history], [data-trade-history]");
  if (!section?.isConnected) return;
  const view = historyView(section);
  const trade = section.hasAttribute("data-trade-history");
  const scrollingDown = scroll.scrollTop > view.scrollTop;
  view.scrollTop = scroll.scrollTop;
  if (trade) view.scrollLeft = scroll.scrollLeft;
  if (scrollingDown && scroll.scrollHeight - scroll.scrollTop - scroll.clientHeight <= 80) {
    if (trade) loadNextAccountTrades(section);
    else loadNextDecisions(section);
  }
}, { capture: true, passive: true });

function finishHistoryResize(event, cancelled = false) {
  if (!historyResize || (event && event.pointerId !== undefined && event.pointerId !== historyResize.pointerId)) return;
  const resize = historyResize;
  historyResize = null;
  if (resize.frame !== null) window.cancelAnimationFrame(resize.frame);
  if (cancelled) {
    setHistoryHeight(resize.section, resize.startRequestedHeight, false);
    const view = historyView(resize.section);
    view.height = resize.startRequestedHeight;
    resize.scroll.scrollTop = resize.startScrollTop;
    resize.scroll.scrollLeft = resize.startScrollLeft;
    view.scrollTop = resize.scroll.scrollTop;
    if (resize.section.hasAttribute("data-trade-history")) view.scrollLeft = resize.scroll.scrollLeft;
    window.scrollTo({ top: resize.startPageY, behavior: "auto" });
  }
  resize.section.classList.remove("is-resizing");
  document.body.style.minHeight = resize.bodyMinHeight;
  document.body.classList.remove("is-resizing-history");
  if (resize.handle.hasPointerCapture(resize.pointerId)) resize.handle.releasePointerCapture(resize.pointerId);
}

document.addEventListener("pointerdown", (event) => {
  const handle = event.target.closest("[data-history-resize]");
  if (!handle || historyResize || !event.isPrimary || event.button !== 0) return;
  const section = handle.closest("[data-decision-history], [data-trade-history]");
  const scroll = historyScroll(section);
  historyResize = { section, scroll, handle, pointerId: event.pointerId, startY: event.clientY, pointY: event.clientY, direction: 0, startPageY: window.scrollY, pageFloor: document.documentElement.scrollHeight, bodyMinHeight: document.body.style.minHeight, frame: null, lastFrameTime: null, startHeight: scroll.getBoundingClientRect().height, startRequestedHeight: historyView(section).height, startScrollTop: scroll.scrollTop, startScrollLeft: scroll.scrollLeft };
  preserveHistoryResizePage();
  handle.focus({ preventScroll: true });
  handle.setPointerCapture(event.pointerId);
  section.classList.add("is-resizing");
  document.body.classList.add("is-resizing-history");
  event.preventDefault();
});

document.addEventListener("pointermove", (event) => {
  if (!historyResize || event.pointerId !== historyResize.pointerId) return;
  const delta = event.clientY - historyResize.pointY;
  if (delta) historyResize.direction = Math.sign(delta);
  historyResize.pointY = event.clientY;
  updateHistoryResizeHeight();
  if (historyResize.frame === null) historyResize.frame = window.requestAnimationFrame(continueHistoryResize);
  event.preventDefault();
});
window.addEventListener("scroll", updateHistoryResizeHeight, { passive: true });
document.addEventListener("pointerup", (event) => finishHistoryResize(event));
document.addEventListener("pointercancel", (event) => finishHistoryResize(event, true));
document.addEventListener("lostpointercapture", (event) => finishHistoryResize(event, true));

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && historyResize) { finishHistoryResize(null, true); event.preventDefault(); return; }
  const handle = event.target.closest("[data-history-resize]");
  if (!handle || !["ArrowUp", "ArrowDown", "Home", "End"].includes(event.key)) return;
  const section = handle.closest("[data-decision-history], [data-trade-history]");
  const current = Number(handle.getAttribute("aria-valuenow"));
  const bounds = historyHeightBounds();
  setHistoryHeight(section, event.key === "Home" ? bounds.min : event.key === "End" ? bounds.max : current + (event.key === "ArrowDown" ? 32 : -32));
  handle.scrollIntoView({ block: "nearest", behavior: "auto" });
  event.preventDefault();
});

window.addEventListener("resize", () => { finishHistoryResize(); syncDecisionHistory(); syncTradeHistory(); });

function renderAiDetailSections(ai, aiKey = null) {
  const draft = aiKey === null;
  return `
    <article class="surface-card chart-card"><div class="card-heading" style="padding:0;border:0;min-height:auto"><div class="card-heading__copy"><h3>시간가중수익률</h3><p>${draft ? "운용 시작 후 성과를 확인할 수 있습니다." : `운용 전체 성과 · 보유 수익률과 별개 · 모의 평가 기록 · 현재 낙폭 ${ai.drawdown}`}</p></div><strong class="chart-card__value ${draft ? "" : "is-rise"}">${draft ? "—" : ai.twr}</strong></div>${draft ? `<div class="ai-section-empty ai-section-empty--chart"><p>아직 운용 성과 기록이 없습니다.</p></div>` : performanceChart(aiKey)}</article>
    ${renderDecisionHistory(draft ? `draft:${state.selectedAiDraft}` : aiKey)}
    ${renderAccountSection(draft ? `draft:${state.selectedAiDraft}` : aiKey, state.aiDetailTab, "ai")}`;
}

function renderAiInvestmentScope(trader, target) {
  const fixed = trader.selectionMode === "fixed";
  const targets = fixed ? trader.selectedTickers.map(stockByTicker).filter(Boolean) : [];
  const targetAttribute = target.type === "draft" ? `data-ai-draft-index="${target.index}"` : `data-ai-key="${target.key}"`;
  return `<div class="ai-investment-scope"><div class="ai-investment-scope__heading"><span>투자 대상</span><strong>${fixed ? `직접 선택 · ${targets.length}개 종목` : "AI가 종목 선정"}</strong><button class="button button--small button--secondary" data-action="ai-target-edit" ${targetAttribute}>투자 대상 수정</button></div>${fixed ? `<div class="ai-scope-stocks">${targets.map((stock) => `<span class="ai-scope-stock">${escapeHtml(stock.name)}</span>`).join("")}</div><p>선택한 종목 안에서 매매를 판단합니다.</p>` : `<p>판단할 때마다 국내 주식·ETF에서 투자 후보를 탐색합니다.</p>`}</div>`;
}

function renderAiPage() {
  const mismatch = state.scenario === "ledger-mismatch";
  const selected = aiFixtures[state.selectedAi];
  const selectedDraft = state.selectedAiDraft === null ? null : state.aiDrafts[state.selectedAiDraft];
  const stopping = aiStatus() === "stopping";
  const stopped = aiStatus() === "stopped";
  const selectedEntity = entityData(state.selectedAi);
  const draftEntity = selectedDraft ? { name: selectedDraft.name, asset: selectedDraft.cash ?? selectedDraft.amount, cash: selectedDraft.cash ?? selectedDraft.amount, costBasis: 0, domestic: 0, us: 0, estimated: 0 } : null;
  pageContent.innerHTML = `
    <header class="page-heading"><div class="page-heading__copy ai-page-title"><span class="ai-spark">✦</span><h1>AI 트레이더</h1></div></header>
    <section class="ai-layout">
      <div class="ai-detail">
        ${selectedDraft ? `<article class="surface-card ai-hero"><div class="ai-hero__top"><div class="ai-hero__identity"><span class="ai-avatar" aria-hidden="true">${aiTypeLetters[selectedDraft.style]}</span><div><span class="eyebrow">${selectedDraft.style} 트레이더 · 초안</span><h2>${escapeHtml(selectedDraft.name)}</h2></div></div><div class="ai-actions"><button class="button button--small button--secondary" data-action="ai-rename" data-ai-draft-index="${state.selectedAiDraft}">이름 수정</button><button class="button button--small button--secondary" data-action="ai-funds" data-ai-draft-index="${state.selectedAiDraft}">자금 관리</button><button class="button button--small button--primary" disabled title="전략 기준 확정 후 사용할 수 있습니다">자동매매 시작</button></div></div><div class="notice" style="margin-top:18px"><strong>아직 운영 전인 초안입니다.</strong><span>전략 기준과 운영 흐름은 설계 중입니다.</span></div>${renderAiInvestmentScope(selectedDraft, { type: "draft", index: state.selectedAiDraft })}</article>${renderInvestmentSummary(draftEntity, { draft: true })}${renderAiDetailSections(selectedDraft)}` : `
        <article class="surface-card ai-hero">
          <div class="ai-hero__top"><div class="ai-hero__identity"><span class="ai-avatar" aria-hidden="true">${aiTypeLetters[selected.type]}</span><div><span class="eyebrow">${selected.type} 트레이더</span><h2>${escapeHtml(selected.name)}</h2></div></div><div class="ai-actions"><button class="button button--small button--secondary" data-action="ai-rename">이름 수정</button><button class="button button--small button--secondary" data-action="ai-funds" ${stopped && !mismatch ? "" : "disabled"}>자금 관리</button>${stopped ? `<button class="button button--small button--primary" data-action="ai-resume" ${mismatch ? "disabled" : ""}>자동매매 재개</button>` : `<button class="button button--small button--danger" data-action="ai-pause" ${stopping ? "disabled" : ""}>자동매매 중지</button>`}</div></div>
          ${stopping ? `<div class="notice notice--warning" style="margin-top:18px"><strong>중지 처리 중입니다.</strong><span>접수 확인 중 1건의 접수 여부를 확인한 뒤 미체결 잔여수량을 취소합니다. 수동 매도와 재개는 아직 사용할 수 없습니다.</span></div>` : ""}
          ${mismatch ? `<div class="notice notice--danger" style="margin-top:18px"><strong>장부 대조가 필요합니다.</strong><span>개인과 모든 AI 장부 합계가 실제 계좌와 일치하기 전까지 재개할 수 없습니다.</span></div>` : ""}
          ${renderAiInvestmentScope(selected, { type: "active", key: state.selectedAi })}
        </article>
        ${renderInvestmentSummary(selectedEntity)}
        ${renderAiDetailSections(selected, state.selectedAi)}`}
      </div>
    </section>`;
}

function renderSearchResults(query = "") {
  const normalized = query.trim().toLowerCase();
  document.querySelectorAll("[data-search-scope]").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.searchScope === state.searchScope);
    button.setAttribute("aria-pressed", button.dataset.searchScope === state.searchScope);
  });
  if (normalized === "오류") {
    searchCount.textContent = "검색 실패";
    searchResults.innerHTML = `<div class="empty-state"><div><span class="empty-symbol">!</span><h2>검색하지 못했어요</h2><p>연결 상태를 확인하고 다시 시도해 주세요.</p><button class="button button--secondary" data-action="retry-search">다시 시도</button></div></div>`;
    return;
  }
  const scoped = searchUniverse.filter((stock) => {
    if (state.searchScope === "kr") return !stock.market.includes("NASDAQ");
    if (state.searchScope === "us") return stock.market.includes("NASDAQ");
    return true;
  });
  const results = scoped.filter((stock) => `${stock.name} ${stock.ticker} ${stock.market}`.toLowerCase().includes(normalized));
  searchCount.textContent = normalized ? `${results.length}개 결과` : `추천 ${Math.min(5, results.length)}개`;
  if (!results.length) {
    searchResults.innerHTML = `<div class="empty-state"><div><span class="empty-symbol">⌕</span><h2>검색 결과 없음</h2><p>종목명이나 코드·티커를 다시 확인해 주세요.</p></div></div>`;
    return;
  }
  searchResults.innerHTML = results.slice(0, normalized ? results.length : 5).map((stock) => {
    const registered = state.watchTickers.includes(stock.ticker);
    return `<div class="search-row"><div class="search-row__meta"><span class="stock-logo">${stock.logo}</span><span><strong>${stock.name}</strong><small class="cell-secondary">${stock.ticker} · ${stock.market}</small></span></div><button class="button button--small ${registered ? "button--ghost" : "button--secondary"}" data-add-ticker="${stock.ticker}" ${registered ? "disabled" : ""}>${registered ? "등록됨" : "추가"}</button></div>`;
  }).join("");
}

function renderReorderList() {
  finishPointerReorder(null, { cancelled: true, syncDraft: false, restoreFocus: false });
  reorderList.innerHTML = state.reorderDraft.length ? state.reorderDraft.map((ticker, index) => {
    const stock = stockByTicker(ticker);
    return `<div class="reorder-row" data-reorder-ticker="${stock.ticker}">
      <div class="reorder-row__identity">
        <button class="drag-handle" type="button" aria-label="${stock.name} ${index + 1}번째. 끌거나 위아래 화살표로 순서 변경">⠿</button>
        <div class="stock-identity"><span class="stock-logo">${stock.logo}</span><span><strong>${stock.name}</strong><small>${stock.ticker} · ${stock.market}</small></span></div>
      </div>
      <button class="row-action reorder-remove is-danger" type="button" data-action="remove-stock" data-ticker="${stock.ticker}" aria-label="${stock.name} 관심종목에서 제거" title="${stock.name} 관심종목에서 제거"><svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M10 11v6" /><path d="M14 11v6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" /><path d="M3 6h18" /><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg></button>
    </div>`;
  }).join("") : `<p class="table-note">남은 관심종목이 없습니다. 저장하면 목록이 비워집니다.</p>`;
}

function syncReorderDraftFromDom() {
  state.reorderDraft = [...reorderList.querySelectorAll("[data-reorder-ticker]")]
    .map((row) => row.dataset.reorderTicker);
  reorderList.querySelectorAll("[data-reorder-ticker]").forEach((row, index) => {
    row.querySelector(".drag-handle").setAttribute("aria-label", `${stockByTicker(row.dataset.reorderTicker).name} ${index + 1}번째. 끌거나 위아래 화살표로 순서 변경`);
  });
}

function openConfirm({ eyebrow, title, copy, summary = [], summaryHtml, actionLabel = "확인", danger = false, onConfirm, onCancel }) {
  document.getElementById("confirmEyebrow").textContent = eyebrow;
  document.getElementById("confirmTitle").textContent = title;
  document.getElementById("confirmCopy").textContent = copy;
  document.getElementById("confirmSummary").innerHTML = summaryHtml || summary.map(([label, value]) => `<div class="confirm-row"><span>${escapeHtml(label)}</span><strong>${escapeHtml(value)}</strong></div>`).join("");
  const action = document.getElementById("confirmAction");
  action.textContent = actionLabel;
  action.className = `button ${danger ? "button--danger" : "button--primary"}`;
  document.getElementById("confirmIcon").textContent = danger ? "!" : "?";
  confirmCallback = onConfirm;
  confirmCancelCallback = onCancel;
  confirmDialog.returnValue = "";
  confirmDialog.showModal();
}

function orderPriceInWon(order) {
  return order.krwPrice ?? nativeMoneyInWon(order.price, order.exchangeRate ?? null);
}

function formatOrderPrice(order, value = orderPriceInWon(order)) {
  return formatWon(value);
}

function openAmendOrder(order) {
  if (!Number.isFinite(orderPriceInWon(order))) return;
  amendOrder = order;
  amendReview = null;
  amendForm.reset();
  amendForm.elements.price.value = String(Math.round(orderPriceInWon(order)));
  amendForm.elements.remaining.value = String(order.quantity - order.filled);
  document.getElementById("amendTitle").textContent = `${order.stock} 주문 정정`;
  document.getElementById("amendCurrency").textContent = "원";
  document.getElementById("amendCurrent").innerHTML = [["투자 주체", order.owner], ["주문", `${order.stock} · ${order.side}`], ["현재 주문가격", formatOrderPrice(order)], ["체결", `${order.filled}주`], ["미체결 잔여", `${order.quantity - order.filled}주`]]
    .map(([label, value]) => `<div class="confirm-row"><span>${escapeHtml(label)}</span><strong>${escapeHtml(value)}</strong></div>`).join("");
  document.getElementById("amendError").hidden = true;
  amendDialog.returnValue = "";
  amendDialog.showModal();
  amendForm.elements.price.focus();
}

function amendError(message, field) {
  const error = document.getElementById("amendError");
  error.textContent = message;
  error.hidden = false;
  field?.focus();
}

function openSellFlow(ticker, owner) {
  state.seller = owner;
  state.stockTab = "holdings";
  state.selectedTicker = ticker;
  state.orderSide = "sell";
  state.orderDraft = { price: "", quantity: "" };
  setRoute("stocks");
  state.detailOpen = true;
  render();
  if (window.innerWidth <= 820) pageContent.querySelector('.stock-detail [data-action="close-detail"]')?.focus(); else pageContent.querySelector(`[data-stock-row="${state.selectedTicker}"]`)?.focus({ preventScroll: true });
}

function stopAi(key, afterStop) {
  state.aiStatuses[key] = "stopping";
  render();
  toast(`${aiFixtures[key].name} 중지를 시작했어요`, "미체결 자동 주문 종료를 확인합니다.");
  window.setTimeout(() => {
    if (state.aiStatuses[key] !== "stopping") return;
    state.aiStatuses[key] = "stopped";
    state.aiReserved[key] = 0;
    render();
    toast(`${aiFixtures[key].name} 중지가 완료됐어요`);
    if (afterStop) afterStop();
  }, 2200);
}

function requestAiSell(ticker, key) {
  if (aiStatus(key) === "stopping") return;
  if (aiStatus(key) === "stopped") { openSellFlow(ticker, key); return; }
  openConfirm({ eyebrow: "AI 보유분 매도", title: `${aiFixtures[key].name} 자동매매를 중지하고 매도할까요?`, copy: "미체결 자동 주문의 종료를 확인한 다음 매도 입력 화면을 엽니다. 매도를 닫아도 AI는 중지 상태를 유지합니다.", summary: [["종목", stockByTicker(ticker).name], ["투자 주체", aiFixtures[key].name]], actionLabel: "중지 후 매도", danger: true, onConfirm: () => stopAi(key, () => openSellFlow(ticker, key)) });
}

function toast(title, message = "") {
  const region = document.getElementById("toastRegion");
  const element = document.createElement("div");
  element.className = "toast";
  element.innerHTML = `<span class="toast__icon">✓</span><div><strong>${escapeHtml(title)}</strong>${message ? `<p>${escapeHtml(message)}</p>` : ""}</div>`;
  region.appendChild(element);
  window.setTimeout(() => element.remove(), 3600);
}

function clearAiFormError() {
  aiFormError.hidden = true;
  aiFormError.querySelector(".form-error__message").textContent = "";
  aiForm.querySelectorAll('[aria-invalid="true"]').forEach((input) => {
    input.removeAttribute("aria-invalid");
    if (input === aiForm.elements.amount) input.setAttribute("aria-describedby", "aiAmountAvailable");
    else input.removeAttribute("aria-describedby");
  });
}

function showAiFormError(input, message) {
  clearAiFormError();
  aiFormError.querySelector(".form-error__message").textContent = message;
  aiFormError.hidden = false;
  input.setAttribute("aria-invalid", "true");
  input.setAttribute("aria-describedby", input === aiForm.elements.amount ? "aiAmountAvailable aiFormError" : "aiFormError");
  input.focus();
}

function selectableAiStock(stock) {
  return Boolean(stock) && /^(KOSPI|KOSDAQ)( ETF)?$/.test(stock.market);
}

function validateAiBasics() {
  const name = aiForm.elements.name.value.trim();
  const style = aiForm.querySelector('[name="style"]:checked');
  const rawAmount = aiForm.elements.amount.value.trim();
  const amount = Number(rawAmount.replace(/,/g, ""));
  const available = personalAvailableCash();
  let input;
  let message;
  if (!name) { input = aiForm.elements.name; message = "이름을 입력해 주세요."; }
  else if (aiNameTaken(name)) { input = aiForm.elements.name; message = "이미 사용 중인 이름입니다."; }
  else if (!style) { input = aiForm.querySelector('[name="style"]'); message = "투자 유형을 선택해 주세요."; }
  else if (!/^(?:[0-9]+|[1-9][0-9]{0,2}(?:,[0-9]{3})+)$/.test(rawAmount) || !Number.isInteger(amount) || amount <= 0) { input = aiForm.elements.amount; message = "0보다 큰 배정금을 숫자로 입력해 주세요."; }
  else if (amount > available) { input = aiForm.elements.amount; message = `최대 배정 가능 금액 ${comma(available)}원 이하로 입력해 주세요.`; }
  return input ? { input, message } : null;
}

function renderAiStockPicker() {
  const fixed = aiCreation.selectionMode === "fixed";
  const picker = document.getElementById("aiStockPicker");
  if (!fixed && picker.contains(document.activeElement)) aiForm.querySelector('[name="selectionMode"]:checked')?.focus({ preventScroll: true });
  picker.classList.toggle("is-open", fixed);
  picker.toggleAttribute("inert", !fixed);
  picker.setAttribute("aria-hidden", String(!fixed));
  document.getElementById("aiTargetModeHint").textContent = fixed ? "선택한 종목 안에서 AI가 매수·매도·관망을 판단합니다." : "AI가 국내 주식·ETF에서 투자 후보를 유동적으로 탐색합니다.";
  document.getElementById("aiSelectedStockCount").textContent = `선택한 종목 ${aiCreation.tickers.length}개`;
  document.getElementById("aiSelectedStocks").innerHTML = aiCreation.tickers.map((ticker) => {
    const stock = stockByTicker(ticker);
    return `<button class="ai-stock-chip" type="button" data-ai-stock-remove="${ticker}" aria-label="${escapeHtml(stock.name)} 투자 대상에서 제거"><span>${escapeHtml(stock.name)}</span><span aria-hidden="true">×</span></button>`;
  }).join("");
  aiForm.querySelectorAll("[data-ai-stock-source]").forEach((button) => {
    const active = button.dataset.aiStockSource === aiCreation.source;
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-pressed", String(active));
  });
  document.getElementById("aiStockSearchField").hidden = aiCreation.source !== "search";
  const query = aiStockSearchInput.value.trim().toLocaleLowerCase("ko-KR");
  const candidates = aiCreation.source === "watch" ? state.watchTickers.map(stockByTicker).filter(Boolean) : searchUniverse.filter((stock) => `${stock.name} ${stock.ticker} ${stock.market}`.toLocaleLowerCase("ko-KR").includes(query));
  aiStockResults.innerHTML = candidates.length ? candidates.map((stock) => {
    const selected = aiCreation.tickers.includes(stock.ticker);
    const supported = selectableAiStock(stock);
    return `<button type="button" class="ai-stock-option" data-ai-stock-toggle="${stock.ticker}" aria-pressed="${selected}" aria-label="${escapeHtml(stock.name)} ${supported ? selected ? "투자 대상 선택 해제" : "투자 대상에 추가" : "미국 주식 자동매매 지원 예정"}" ${supported ? "" : "disabled"}><span class="search-row__meta"><span class="stock-logo" aria-hidden="true">${escapeHtml(stock.logo)}</span><span><strong>${escapeHtml(stock.name)}</strong><small class="cell-secondary">${stock.ticker} · ${stock.market}</small></span></span>${supported ? `<span class="ai-stock-option__mark" aria-hidden="true">${selected ? "✓" : "＋"}</span>` : `<span class="ai-stock-option__pending">지원 예정</span>`}</button>`;
  }).join("") : `<div class="ai-stock-empty"><strong>${aiCreation.source === "watch" ? "관심종목이 없습니다" : "검색 결과 없음"}</strong><p>${aiCreation.source === "watch" ? "종목 검색에서 투자 대상을 추가해 주세요." : "종목명이나 코드를 다시 확인해 주세요."}</p></div>`;
}

function setRoute(route) {
  if (route !== "stocks") state.seller = "personal";
  if (route === "stocks" && state.route !== "stocks") state.detailOpen = window.innerWidth > 820;
  if (route !== "ai") state.aiMenuOpen = false;
  if (route !== "ai") state.desktopPanel = null;
  state.route = route;
  render();
  pageContent.focus({ preventScroll: true });
  window.scrollTo({ top: 0, behavior: "auto" });
}

function closeAiMenuPopup() {
  const popup = document.getElementById(window.innerWidth > 820 ? "aiNavSubmenu" : "mobileAiPicker");
  const restoreFocus = popup.contains(document.activeElement);
  state.aiMenuOpen = false;
  renderAiNavigation();
  if (restoreFocus) document.querySelector(window.innerWidth > 820 ? '.sidebar [data-route="ai"]' : '.mobile-nav [data-route="ai"]')?.focus({ preventScroll: true });
}

document.addEventListener("pointerdown", (event) => {
  if (event.target.closest("dialog[open]")) return;
  if (window.innerWidth > 820) {
    if (state.desktopPanel && !event.target.closest('.sidebar-panels, .sidebar [data-route="ai"], .sidebar [data-action="open-notifications"]')) closeDesktopPanel();
    return;
  }
  if (!state.aiMenuOpen || event.target.closest('#mobileAiPicker, .mobile-nav [data-route="ai"]')) return;
  closeAiMenuPopup();
});

document.addEventListener("click", (event) => {
  const closeDialogButton = event.target.closest("[data-dialog-close]");
  if (closeDialogButton) { closeAnimatedDialog(closeDialogButton.closest("dialog"), "cancel"); return; }
  const notificationDismiss = event.target.closest("[data-notification-dismiss]");
  if (notificationDismiss) { dismissNotifications([notificationDismiss.dataset.notificationDismiss], event.detail === 0); return; }
  const notificationOpen = event.target.closest("[data-notification-open]");
  if (notificationOpen) { openNotificationRecord(notificationOpen.dataset.notificationOpen); return; }
  const notificationAction = event.target.closest('[data-action="open-notifications"], [data-action="clear-notifications"]');
  if (notificationAction) {
    if (notificationAction.dataset.action === "open-notifications") openTradeNotifications();
    else dismissNotifications(activeNotifications().map((item) => item.id).reverse());
    return;
  }
  if (event.target.closest('[data-action="close-sidebar-panel"]')) { closeDesktopPanel(true); return; }
  const routeButton = event.target.closest("[data-route]");
  if (routeButton) {
    if (routeButton.dataset.route === "ai" && window.innerWidth > 820) { toggleDesktopPanel("ai"); return; }
    if (routeButton.dataset.route === "ai") state.aiMenuOpen = state.route !== "ai" || !state.aiMenuOpen;
    if (routeButton.dataset.route === "stocks" && state.route !== "stocks") state.seller = "personal";
    setRoute(routeButton.dataset.route);
    if (routeButton.dataset.route === "ai") {
      const selectedItem = document.getElementById(routeButton.getAttribute("aria-controls"))?.querySelector(".ai-nav-item.is-selected");
      (state.aiMenuOpen ? selectedItem : routeButton)?.focus({ preventScroll: true });
    }
    return;
  }

  const tab = event.target.closest("[data-stock-tab]");
  if (tab) {
    clearStockDetailMotion();
    state.stockTab = tab.dataset.stockTab;
    state.seller = "personal";
    const next = visibleStocks()[0];
    state.selectedTicker = next ? next.ticker : null;
    state.detailOpen = false;
    state.orderDraft = { price: "", quantity: "" };
    renderAndFocus(`[data-stock-tab="${state.stockTab}"]`);
    return;
  }

  const stockButton = event.target.closest("[data-stock-row]");
  if (stockButton) {
    cancelStockDetailClose();
    const nextTicker = stockButton.dataset.stockRow;
    if ((state.orderDraft.price || state.orderDraft.quantity) && nextTicker !== state.selectedTicker) {
      const nextStock = stockByTicker(nextTicker);
      openConfirm({ eyebrow: "입력 초기화", title: `${nextStock.name}(으)로 이동할까요?`, copy: "현재 입력한 주문가격과 수량은 저장되지 않고 사라집니다. 이미 제출한 주문에는 영향을 주지 않습니다.", actionLabel: "입력 지우고 이동", danger: true, onConfirm: () => { state.seller = "personal"; state.orderDraft = { price: "", quantity: "" }; state.selectedTicker = nextTicker; state.detailOpen = true; render(); if (window.innerWidth <= 820) pageContent.querySelector('.stock-detail [data-action="close-detail"]')?.focus(); else pageContent.querySelector(`[data-stock-row="${state.selectedTicker}"]`)?.focus({ preventScroll: true }); } });
    } else {
      state.seller = "personal";
      state.selectedTicker = nextTicker;
      state.detailOpen = true;
      render();
      if (window.innerWidth <= 820) pageContent.querySelector('.stock-detail [data-action="close-detail"]')?.focus(); else pageContent.querySelector(`[data-stock-row="${state.selectedTicker}"]`)?.focus({ preventScroll: true });
    }
    return;
  }

  const portfolioTab = event.target.closest("[data-portfolio-tab]");
  if (portfolioTab) { state.portfolioTab = portfolioTab.dataset.portfolioTab; renderAndFocus(`[data-portfolio-tab="${state.portfolioTab}"]`); return; }
  const aiDetailTab = event.target.closest("[data-ai-detail-tab]");
  if (aiDetailTab) { state.aiDetailTab = aiDetailTab.dataset.aiDetailTab; renderAndFocus(`[data-ai-detail-tab="${state.aiDetailTab}"]`); return; }
  const entityButton = event.target.closest("[data-entity]");
  if (entityButton) { state.entity = entityButton.dataset.entity; renderAndFocus(`[data-entity="${state.entity}"]`); return; }
  const aiButton = event.target.closest("[data-ai]");
  if (aiButton) {
    state.selectedAi = aiButton.dataset.ai;
    state.selectedAiDraft = null;
    if (window.innerWidth <= 820) state.aiMenuOpen = false;
    setRoute("ai");
    (window.innerWidth <= 820 ? pageContent : document.querySelector(`#aiNavSubmenu [data-ai="${state.selectedAi}"]`))?.focus({ preventScroll: true });
    window.scrollTo({ top: 0, behavior: "auto" });
    return;
  }
  const aiDraftButton = event.target.closest("[data-ai-draft]");
  if (aiDraftButton) {
    state.selectedAiDraft = Number(aiDraftButton.dataset.aiDraft);
    if (window.innerWidth <= 820) state.aiMenuOpen = false;
    setRoute("ai");
    (window.innerWidth <= 820 ? pageContent : document.querySelector(`#aiNavSubmenu [data-ai-draft="${state.selectedAiDraft}"]`))?.focus({ preventScroll: true });
    window.scrollTo({ top: 0, behavior: "auto" });
    return;
  }

  const searchScopeButton = event.target.closest("[data-search-scope]");
  if (searchScopeButton) {
    state.searchScope = searchScopeButton.dataset.searchScope;
    renderSearchResults(searchInput.value);
    searchScopeButton.focus();
    return;
  }

  const addButton = event.target.closest("[data-add-ticker]");
  if (addButton) {
    const ticker = addButton.dataset.addTicker;
    if (!state.watchTickers.includes(ticker)) state.watchTickers.push(ticker);
    renderSearchResults(searchInput.value);
    toast(`${stockByTicker(ticker).name}을 관심종목에 추가했어요`, "검색 화면을 유지해 다른 종목을 계속 추가할 수 있습니다.");
    return;
  }

  const actionButton = event.target.closest("[data-action]");
  if (!actionButton) return;
  const action = actionButton.dataset.action;
  if (action === "open-search") { state.searchScope = "all"; searchDialog.showModal(); searchInput.value = ""; renderSearchResults(); window.setTimeout(() => searchInput.focus(), 50); }
  if (action === "open-reorder") {
    state.reorderDraft = [...state.watchTickers];
    renderReorderList();
    reorderDialog.returnValue = "";
    reorderDialog.showModal();
  }
  if (action === "remove-stock") {
    const ticker = actionButton.dataset.ticker;
    const next = state.reorderDraft.find((item) => item !== ticker);
    state.reorderDraft = state.reorderDraft.filter((item) => item !== ticker);
    renderReorderList();
    document.getElementById("reorderAnnouncement").textContent = `${stockByTicker(ticker).name} 제거`;
    if (next) reorderList.querySelector(`[data-reorder-ticker="${next}"] .drag-handle`)?.focus();
    else reorderDialog.querySelector('[value="confirm"]')?.focus();
  }
  if (action === "close-detail") closeStockDetail();
  if (action === "order-side") { state.orderSide = actionButton.dataset.side; renderAndFocus(`[data-action="order-side"][data-side="${state.orderSide}"]`); }
  if (action === "submit-order") {
    const stock = stockByTicker(state.selectedTicker);
    const total = Number(state.orderDraft.price) * Number(state.orderDraft.quantity);
    const owner = state.seller === "personal" ? "개인" : aiFixtures[state.seller].name;
    openConfirm({ eyebrow: "모의 주문 확인", title: `${stock.name} ${state.orderSide === "buy" ? "매수" : "매도"} 내용을 확인할까요?`, copy: "실제 주문은 전송되지 않습니다. 세션·종목별 API 지원 확인 전 화면 검토용 단계입니다.", summary: [["투자 주체", owner], ["구분", state.orderSide === "buy" ? "매수" : "매도"], ["주문가격", formatWon(Number(state.orderDraft.price))], ["수량", `${comma(state.orderDraft.quantity)}주`], ["예상 주문금액", formatWon(total)]], actionLabel: "모의 흐름 완료", onConfirm: () => { state.orderDraft = { price: "", quantity: "" }; render(); toast("모의 주문 내용을 확인했어요", "실제 주문은 전송되지 않았습니다."); } });
  }
  if (action === "retry-market") { state.scenario = "normal"; scenarioSelect.value = "normal"; render(); toast("시장 정보를 다시 확인했어요"); }
  if (action === "retry-connection") { state.scenario = "normal"; scenarioSelect.value = "normal"; render(); toast("최신 시세 수신을 확인했어요", "최신 시세 수신을 확인한 후 정상 상태로 전환했습니다."); }
  if (action === "retry-search") { state.searchScope = "all"; searchInput.value = "삼성"; renderSearchResults("삼성"); }
  if (action === "view-pending-order") { state.entity = "personal"; state.portfolioTab = "orders"; setRoute("portfolio"); }
  if (action === "refresh-orders") { state.orderMessage = "09.22 10:32 기준 모의 주문 상태입니다. 외부 조회는 실행하지 않았습니다."; state.orderMessageOwner = null; renderAndFocus('[data-action="refresh-orders"]'); }
  if (action === "apply-trade-filter") { if (state.tradeFilter.start > state.tradeFilter.end) { toast("기간을 다시 확인해 주세요", "시작일은 종료일보다 늦을 수 없습니다."); return; } state.tradeFilterApplied = { ...state.tradeFilter }; resetTradeHistory(); renderAndFocus('[data-action="apply-trade-filter"]'); }
  if (action === "amend-order" || action === "cancel-order") {
    const order = previewOrders.find((item) => item.id === actionButton.dataset.orderId);
    if (!order) return;
    const remaining = order.quantity - order.filled;
    if (action === "amend-order") { openAmendOrder(order); return; }
    openConfirm({ eyebrow: "취소 흐름 검토", title: `${order.stock} ${remaining}주 취소 내용을 확인할까요?`, copy: "이미 체결된 수량은 유지됩니다. 실제 취소 요청은 전송되지 않습니다.", summary: [["투자 주체", order.owner], ["주문", `${order.stock} · ${order.side} ${formatOrderPrice(order)}`], ["미체결 잔여", `${remaining}주`]], actionLabel: "모의 흐름 확인", danger: true, onConfirm: () => { state.orderMessage = `${order.stock} ${remaining}주 취소 대상만 확인했습니다. 실제 요청은 전송되지 않았습니다.`; state.orderMessageOwner = order.owner; render(); } });
  }
  if (action === "choose-seller") {
    const ticker = actionButton.dataset.ticker;
    const owners = ticker === "005930" ? { personal: 18, swing: 12, long: 8 } : ticker === "000660" ? { personal: 5, swing: 6 } : ticker === "005380" ? { personal: 7, swing: 3 } : { personal: 4 };
    const owner = actionButton.dataset.owner ?? state.entity;
    if (owner !== "all") { owner === "personal" ? openSellFlow(ticker, "personal") : requestAiSell(ticker, owner); return; }
    openConfirm({ eyebrow: "투자 주체 선택", title: `${stockByTicker(ticker).name}을 누구의 보유분에서 매도할까요?`, copy: "선택한 투자 주체의 보유수량만 매도 대상으로 사용합니다.", summaryHtml: Object.entries(owners).map(([key, count], index) => `<label class="seller-choice"><input type="radio" name="sellerChoice" value="${key}" ${index === 0 ? "checked" : ""}><span>${key === "personal" ? "개인" : escapeHtml(aiFixtures[key].name)}</span><strong>${count}주</strong></label>`).join(""), actionLabel: "선택", onConfirm: () => { const key = document.querySelector('input[name="sellerChoice"]:checked')?.value || "personal"; key === "personal" ? openSellFlow(ticker, key) : requestAiSell(ticker, key); } });
  }
  if (action === "ai-create") openAiForm();
  if (action === "ai-target-edit") {
    const index = actionButton.dataset.aiDraftIndex;
    openAiForm(index === undefined ? { type: "active", key: actionButton.dataset.aiKey } : { type: "draft", index: Number(index) });
  }
  if (action === "ai-rename") {
    const index = actionButton.dataset.aiDraftIndex;
    openAiRename(index === undefined ? { type: "active", key: state.selectedAi } : { type: "draft", index: Number(index) });
  }
  if (action === "ai-pause") { const key = state.selectedAi; openConfirm({ eyebrow: "자동매매 중지", title: `${aiFixtures[key].name}의 자동매매를 중지할까요?`, copy: "새로운 판단과 주문 제출을 중단하고 미체결 자동 주문의 종료를 확인합니다. 보유종목은 유지됩니다.", summary: [["투자 주체", aiFixtures[key].name], ["보유종목", `${aiFixtures[key].holdings.length}개 · 유지`]], actionLabel: "중지 진행", danger: true, onConfirm: () => stopAi(key) }); }
  if (action === "ai-resume") { const key = state.selectedAi; openConfirm({ eyebrow: "자동매매 재개", title: `${aiFixtures[key].name}을 재개할까요?`, copy: "시세·보유·미체결 주문·사용 가능 현금과 전체 장부를 대조한 뒤 새 판단을 실행합니다. 이 화면은 검토용 모의 흐름입니다.", summary: [["이전 판단", "재사용 안 함"], ["중지 중 놓친 판단", "몰아서 실행 안 함"]], actionLabel: "모의 재개", onConfirm: () => { state.aiStatuses[key] = "running"; if (state.scenario === "reconciled") { state.scenario = "normal"; scenarioSelect.value = "normal"; } render(); toast(`${aiFixtures[key].name}을 모의 재개했어요`); } }); }
  if (action === "ai-funds") {
    state.fundTarget = actionButton.dataset.aiDraftIndex === undefined
      ? { type: "active", key: state.selectedAi }
      : { type: "draft", index: Number(actionButton.dataset.aiDraftIndex) };
    fundForm.reset();
    document.getElementById("fundTitle").textContent = `${fundTargetName()} 자금 관리`;
    const reserved = state.fundTarget.type === "draft" ? 0 : state.aiReserved[state.fundTarget.key];
    document.getElementById("fundAvailable").textContent = `개인 사용 가능 ${comma(personalAvailableCash())}원 · AI 사용 가능 ${comma(fundTargetCash())}원 · AI 주문에 묶인 현금 ${comma(reserved)}원`;
    fundDialog.returnValue = "";
    fundDialog.showModal();
  }
  if (action === "ai-manual-sell") requestAiSell(actionButton.dataset.ticker, state.selectedAi);
  if (action === "reconcile") { state.scenario = "reconciled"; state.aiStatuses = { swing: "stopped", long: "stopped" }; state.aiReserved = { swing: 0, long: 0 }; scenarioSelect.value = "reconciled"; render(); toast("모의 장부 대조를 완료했어요", "자동매매는 직접 재개하기 전까지 중지 상태입니다."); }
});

document.addEventListener("input", (event) => {
  const filter = event.target.closest("[data-filter]");
  if (filter) state.tradeFilter[filter.dataset.filter] = filter.value;
  const orderInput = event.target.closest("[data-order-input]");
  if (orderInput) {
    const field = orderInput.dataset.orderInput;
    state.orderDraft[field] = field === "quantity" ? orderInput.value.replace(/\D/g, "") : orderInput.value.replace(/[^0-9.]/g, "");
    if (orderInput.value !== state.orderDraft[field]) orderInput.value = state.orderDraft[field];
    const estimate = document.querySelector(".order-estimate strong");
    const submit = document.querySelector('[data-action="submit-order"]');
    const selected = stockByTicker(state.selectedTicker);
    const total = Number(state.orderDraft.price || 0) * Number(state.orderDraft.quantity || 0);
    const held = state.seller === "personal" ? selected?.held || 0 : aiFixtures[state.seller].holdings.find((holding) => holding.ticker === state.selectedTicker)?.quantity || 0;
    const valid = validOrderDraft(held, state.orderSide === "buy");
    if (estimate && selected) estimate.textContent = formatWon(valid ? total : 0);
    if (submit) submit.disabled = !valid;
  }
});

searchDialog.querySelector("form").addEventListener("submit", (event) => {
  if (event.submitter?.value !== "cancel") event.preventDefault();
});

for (const formId of ["aiForm", "fundForm"]) {
  document.getElementById(formId).addEventListener("keydown", (event) => {
    if (event.isComposing || event.key !== "Enter" || !event.target.matches('input:not([type="radio"])')) return;
    event.preventDefault();
    if (event.target === aiStockSearchInput) return;
    event.currentTarget.requestSubmit(event.currentTarget.querySelector('[value="confirm"]'));
  });
}

searchInput.addEventListener("input", () => {
  window.clearTimeout(searchTimer);
  searchCount.textContent = "검색 중…";
  searchResults.innerHTML = `<div class="empty-state"><div><span class="empty-symbol">…</span><h2>종목을 찾고 있어요</h2><p>입력한 이름과 코드에 맞는 종목을 검색합니다.</p></div></div>`;
  searchTimer = window.setTimeout(() => renderSearchResults(searchInput.value), 280);
});
searchInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") event.preventDefault();
});

let reorderDrag = null;

function moveDraggedRow(event) {
  if (!reorderDrag) return;
  reorderDrag.point = { clientX: event.clientX, clientY: event.clientY };
  const { row, preview, startY, startTop, height } = reorderDrag;
  const listBounds = reorderList.getBoundingClientRect();
  const top = Math.max(listBounds.top, Math.min(startTop + event.clientY - startY, listBounds.bottom - height));
  preview.style.transform = `translate3d(0, ${top - startTop}px, 0)`;
  const targetY = Math.max(listBounds.top + 1, Math.min(event.clientY, listBounds.bottom - 1));
  const target = document.elementFromPoint(listBounds.left + listBounds.width / 2, targetY)?.closest(".reorder-row");
  if (!target || target === row || target.parentElement !== reorderList) return;
  const bounds = target.getBoundingClientRect();
  const placeAfter = targetY > bounds.top + bounds.height / 2;
  reorderList.insertBefore(row, placeAfter ? target.nextSibling : target);
}

reorderList.addEventListener("pointerdown", (event) => {
  const handle = event.target.closest(".drag-handle");
  if (!handle || reorderDrag || !event.isPrimary || event.button !== 0) return;
  const row = handle.closest(".reorder-row");
  const bounds = row.getBoundingClientRect();
  const preview = row.cloneNode(true);
  preview.classList.add("reorder-drag-preview");
  preview.removeAttribute("data-reorder-ticker");
  preview.setAttribute("aria-hidden", "true");
  preview.inert = true;
  preview.querySelectorAll("[id], [data-action], [data-ticker]").forEach((element) => {
    ["id", "data-action", "data-ticker"].forEach((attribute) => element.removeAttribute(attribute));
  });
  Object.assign(preview.style, { left: `${bounds.left}px`, top: `${bounds.top}px`, width: `${bounds.width}px`, height: `${bounds.height}px` });
  reorderDrag = { row, handle, preview, pointerId: event.pointerId, startY: event.clientY, startTop: bounds.top, height: bounds.height, point: event, originalRows: [...reorderList.children] };
  // Keep the preview in the modal's top layer, outside its scrolling form.
  reorderDialog.append(preview);
  row.classList.add("is-dragging");
  // Capture on the stable list, since the row changes position in the DOM.
  reorderList.setPointerCapture(event.pointerId);
  moveDraggedRow(event);
  event.preventDefault();
});

reorderList.addEventListener("pointermove", (event) => {
  if (!reorderDrag || event.pointerId !== reorderDrag.pointerId) return;
  moveDraggedRow(event);
  event.preventDefault();
});

function finishPointerReorder(event, { cancelled = false, syncDraft = true, restoreFocus = true } = {}) {
  if (!reorderDrag || (event && event.pointerId !== reorderDrag.pointerId)) return;
  const { row, handle, preview, pointerId, originalRows } = reorderDrag;
  reorderDrag = null;
  if (cancelled || event?.type === "pointercancel" || event?.type === "lostpointercapture") {
    originalRows.forEach((originalRow) => reorderList.append(originalRow));
    cancelled = true;
  }
  preview.remove();
  row.classList.remove("is-dragging");
  if (reorderList.hasPointerCapture(pointerId)) reorderList.releasePointerCapture(pointerId);
  if (syncDraft) {
    syncReorderDraftFromDom();
    const name = stockByTicker(row.dataset.reorderTicker).name;
    document.getElementById("reorderAnnouncement").textContent = cancelled ? `${name} 이동 취소` : `${name} ${state.reorderDraft.indexOf(row.dataset.reorderTicker) + 1}번째로 이동`;
  }
  if (restoreFocus && reorderDialog.open && handle.isConnected) handle.focus({ preventScroll: true });
}

reorderList.addEventListener("pointerup", finishPointerReorder);
reorderList.addEventListener("pointercancel", finishPointerReorder);
reorderList.addEventListener("lostpointercapture", finishPointerReorder);
reorderList.addEventListener("scroll", () => {
  if (reorderDrag) moveDraggedRow(reorderDrag.point);
});

reorderList.addEventListener("keydown", (event) => {
  const handle = event.target.closest(".drag-handle");
  if (!handle || (event.key !== "ArrowUp" && event.key !== "ArrowDown")) return;
  finishPointerReorder();
  const row = handle.closest(".reorder-row");
  const from = state.reorderDraft.indexOf(row.dataset.reorderTicker);
  const to = event.key === "ArrowUp" ? Math.max(0, from - 1) : Math.min(state.reorderDraft.length - 1, from + 1);
  if (from === to) return;
  const [ticker] = state.reorderDraft.splice(from, 1);
  state.reorderDraft.splice(to, 0, ticker);
  renderReorderList();
  document.getElementById("reorderAnnouncement").textContent = `${stockByTicker(ticker).name} ${to + 1}번째로 이동`;
  reorderList.querySelector(`[data-reorder-ticker="${ticker}"] .drag-handle`)?.focus();
  event.preventDefault();
});

confirmDialog.addEventListener("close", () => {
  const callback = confirmDialog.returnValue === "confirm" ? confirmCallback : confirmCancelCallback;
  confirmCallback = null;
  confirmCancelCallback = null;
  callback?.();
});

amendForm.addEventListener("input", () => { document.getElementById("amendError").hidden = true; });

amendForm.addEventListener("submit", (event) => {
  if (event.submitter?.value !== "review") return;
  event.preventDefault();
  const order = amendOrder;
  if (!order) return;
  const priceField = amendForm.elements.price;
  const remainingField = amendForm.elements.remaining;
  const priceText = priceField.value.trim();
  const remainingText = remainingField.value.trim();
  const price = Number(priceText);
  const remaining = Number(remainingText);
  if (!isPositiveInteger(priceText)) {
    amendError("주문가격을 0보다 큰 원 단위 정수로 입력하세요.", priceField);
    return;
  }
  if (!/^\d+$/.test(remainingText) || !Number.isSafeInteger(remaining) || remaining <= 0) {
    amendError("미체결 잔여수량을 1주 이상의 정수로 입력하세요.", remainingField);
    return;
  }
  if (!Number.isSafeInteger(price * remaining) || !Number.isSafeInteger(order.filled + remaining)) {
    amendError("주문금액이나 수량이 너무 큽니다. 가격과 수량을 줄여 주세요.", remainingField);
    return;
  }
  const priceChanged = price !== Math.round(orderPriceInWon(order));
  if (!priceChanged && remaining === order.quantity - order.filled) {
    amendError("가격이나 미체결 잔여수량을 변경해 주세요.", priceField);
    return;
  }
  amendReview = { price, remaining, priceChanged };
  closeAnimatedDialog(amendDialog, "review");
});

amendDialog.addEventListener("close", () => {
  if (amendDialog.returnValue !== "review" || !amendOrder || !amendReview) {
    amendOrder = null;
    amendReview = null;
    return;
  }
  const order = amendOrder;
  const { price, remaining, priceChanged } = amendReview;
  openConfirm({
    eyebrow: "모의 정정 확인",
    title: `${order.stock} 주문을 정정할까요?`,
    copy: "체결된 수량은 유지됩니다. 이 화면에서는 실제 정정 요청을 보내지 않습니다.",
    summary: [["투자 주체", order.owner], ["구분", order.side], ["주문가격", `${formatOrderPrice(order)} → ${formatOrderPrice(order, price)}`], ["미체결 잔여", `${order.quantity - order.filled}주 → ${remaining}주`], ["이미 체결", `${order.filled}주 · 유지`]],
    actionLabel: "모의 정정 반영",
    onCancel: () => { amendDialog.returnValue = ""; amendDialog.showModal(); amendForm.elements.price.focus(); },
    onConfirm: () => {
      if (priceChanged) {
        // Mock KRW request only: preserve native USD until API conversion is defined.
        if (stockCurrency(stockByTicker(order.ticker)) === "USD") order.krwPrice = price;
        else order.price = formatWon(price);
      }
      order.quantity = order.filled + remaining;
      state.orderMessage = `${order.stock}의 모의 정정 내용을 목록에 반영했습니다. 실제 요청은 전송되지 않았습니다.`;
      state.orderMessageOwner = order.owner;
      amendOrder = null;
      amendReview = null;
      renderAndFocus(`[data-action="amend-order"][data-order-id="${order.id}"]`);
    }
  });
});

reorderDialog.addEventListener("close", () => {
  finishPointerReorder(null, { cancelled: reorderDialog.returnValue !== "confirm", restoreFocus: false });
  if (reorderDialog.returnValue !== "confirm") return;
  state.watchTickers = [...state.reorderDraft];
  if (!state.watchTickers.includes(state.selectedTicker)) {
    state.selectedTicker = state.watchTickers[0] || null;
    state.detailOpen = Boolean(state.selectedTicker) && window.innerWidth > 820;
  }
  render();
  toast("관심종목 변경을 저장했어요");
});

searchDialog.addEventListener("close", () => { if (state.route === "stocks") render(); });

aiForm.addEventListener("submit", (event) => {
  if (event.submitter?.value !== "confirm") return;
  const error = aiTargetEditTarget ? null : validateAiBasics();
  if (error) {
    event.preventDefault();
    showAiFormError(error.input, error.message);
    return;
  }
  if (aiCreation.selectionMode === "fixed" && (!aiCreation.tickers.length || !aiCreation.tickers.every((ticker) => selectableAiStock(stockByTicker(ticker))))) {
    event.preventDefault();
    if (aiCreation.source !== "search") {
      aiCreation.source = "search";
      renderAiStockPicker();
    }
    showAiFormError(aiStockSearchInput, "투자할 국내 주식·ETF를 1개 이상 선택해 주세요.");
    return;
  }
  clearAiFormError();
});
function updateAiFormInputState() {
  clearAiFormError();
  if (aiTargetEditTarget) {
    aiForm.querySelector('[value="confirm"]').disabled = false;
    return;
  }
  const rawAmount = aiForm.elements.amount.value.trim();
  const available = personalAvailableCash();
  const overLimit = /^(?:[0-9]+|[1-9][0-9]{0,2}(?:,[0-9]{3})+)$/.test(rawAmount) && Number(rawAmount.replace(/,/g, "")) > available;
  aiForm.querySelector('[value="confirm"]').disabled = available === 0 || overLimit;
  if (!overLimit) return;
  aiFormError.querySelector(".form-error__message").textContent = `최대 배정 가능 금액 ${comma(available)}원 이하로 입력해 주세요.`;
  aiFormError.hidden = false;
  aiForm.elements.amount.setAttribute("aria-invalid", "true");
  aiForm.elements.amount.setAttribute("aria-describedby", "aiAmountAvailable aiFormError");
}
aiForm.addEventListener("input", updateAiFormInputState);
aiForm.addEventListener("change", (event) => {
  if (event.target.name === "selectionMode") {
    aiCreation.selectionMode = event.target.value;
    renderAiStockPicker();
  }
  updateAiFormInputState();
});
aiStockSearchInput.addEventListener("input", () => {
  renderAiStockPicker();
  aiStockResults.scrollTop = 0;
});
aiForm.addEventListener("click", (event) => {
  const source = event.target.closest("[data-ai-stock-source]");
  if (source) {
    aiCreation.source = source.dataset.aiStockSource;
    renderAiStockPicker();
    aiStockResults.scrollTop = 0;
    return;
  }
  const toggle = event.target.closest("[data-ai-stock-toggle]");
  const remove = event.target.closest("[data-ai-stock-remove]");
  if (!toggle && !remove) return;
  const ticker = toggle?.dataset.aiStockToggle ?? remove.dataset.aiStockRemove;
  const stock = stockByTicker(ticker);
  if (!selectableAiStock(stock) || aiCreation.selectionMode !== "fixed") return;
  const index = aiCreation.tickers.indexOf(ticker);
  const removed = Boolean(remove) || index !== -1;
  if (removed) aiCreation.tickers = aiCreation.tickers.filter((item) => item !== ticker);
  else aiCreation.tickers.push(ticker);
  clearAiFormError();
  renderAiStockPicker();
  document.getElementById("aiStockSelectionStatus").textContent = `${stock.name}을 투자 대상${removed ? "에서 제거" : "에 추가"}했어요.`;
  if (toggle) aiStockResults.querySelector(`[data-ai-stock-toggle="${ticker}"]`)?.focus({ preventScroll: true });
  else {
    const remaining = document.querySelectorAll("#aiSelectedStocks [data-ai-stock-remove]");
    const next = remaining[Math.min(index, remaining.length - 1)] || (aiCreation.source === "search" ? aiStockSearchInput : aiForm.querySelector('[data-ai-stock-source="watch"]'));
    next.focus({ preventScroll: true });
  }
});

aiRenameForm.elements.name.addEventListener("input", (event) => event.target.setCustomValidity(""));
aiRenameForm.addEventListener("submit", (event) => {
  if (event.submitter?.value !== "confirm") return;
  const input = aiRenameForm.elements.name;
  const name = input.value.trim();
  const target = aiRenameTarget;
  const currentName = target?.type === "active" ? aiFixtures[target.key]?.name : state.aiDrafts[target?.index]?.name;
  if (!name || !target || !currentName || aiNameTaken(name, target) || name === currentName) {
    event.preventDefault();
    input.setCustomValidity(!name ? "이름을 입력해 주세요." : name === currentName ? "현재 이름과 같습니다." : "이미 사용 중인 이름입니다.");
    input.reportValidity();
  } else input.setCustomValidity("");
});

aiRenameDialog.addEventListener("close", () => {
  const target = aiRenameTarget;
  aiRenameTarget = null;
  if (aiRenameDialog.returnValue !== "confirm" || !target) return;
  const name = aiRenameForm.elements.name.value.trim();
  if (target.type === "active") {
    const previous = aiFixtures[target.key].name;
    aiFixtures[target.key].name = name;
    if (state.orderMessageOwner === previous) state.orderMessageOwner = name;
    previewOrders.forEach((order) => { if (order.owner === previous) order.owner = name; });
    previewTrades.forEach((trade) => { if (trade.owner === previous) trade.owner = name; });
    renderAndFocus('[data-action="ai-rename"]:not([data-ai-draft-index])');
  } else {
    state.aiDrafts[target.index].name = name;
    renderAndFocus(`[data-action="ai-rename"][data-ai-draft-index="${target.index}"]`);
  }
  toast(`${name} 이름을 저장했어요`);
});

aiFormDialog.addEventListener("close", () => {
  const target = aiTargetEditTarget;
  aiTargetEditTarget = null;
  if (aiFormDialog.returnValue !== "confirm") {
    aiCreation = { selectionMode: "auto", tickers: [], source: "search" };
    return;
  }
  if (target) {
    const trader = aiTraderForTarget(target);
    if (trader) {
      trader.selectionMode = aiCreation.selectionMode;
      trader.selectedTickers = aiCreation.selectionMode === "fixed" ? [...aiCreation.tickers] : [];
      const selector = target.type === "draft" ? `[data-ai-draft-index="${target.index}"]` : `[data-ai-key="${target.key}"]`;
      renderAndFocus(`[data-action="ai-target-edit"]${selector}`);
      toast(`${trader.name} 투자 대상을 저장했어요`);
    }
    aiCreation = { selectionMode: "auto", tickers: [], source: "search" };
    return;
  }
  const amount = Number(aiForm.elements.amount.value.replace(/,/g, ""));
  state.aiDrafts.push({ name: aiForm.elements.name.value.trim(), style: aiForm.elements.style.value, amount, cash: amount, selectionMode: aiCreation.selectionMode, selectedTickers: aiCreation.selectionMode === "fixed" ? [...aiCreation.tickers] : [] });
  aiCreation = { selectionMode: "auto", tickers: [], source: "search" };
  state.selectedAiDraft = state.aiDrafts.length - 1;
  state.aiMenuOpen = false;
  state.desktopPanel = window.innerWidth > 820 ? "ai" : null;
  setRoute("ai");
  (window.innerWidth <= 820 ? pageContent : document.querySelector(`#aiNavSubmenu [data-ai-draft="${state.selectedAiDraft}"]`))?.focus({ preventScroll: true });
  toast("AI 트레이더 초안을 목록에 추가했어요", "전략 기준 확정 전에는 자동매매를 시작할 수 없습니다.");
});

const fundDialog = document.getElementById("fundDialog");
const fundForm = document.getElementById("fundForm");
fundForm.addEventListener("submit", (event) => {
  if (event.submitter?.value !== "confirm") return;
  const amount = Number(fundForm.elements.amount.value.replace(/,/g, ""));
  const direction = fundForm.elements.direction.value;
  const available = direction === "add" ? personalAvailableCash() : fundTargetCash();
  if (!Number.isInteger(amount) || amount <= 0 || amount > available) {
    event.preventDefault();
    fundForm.elements.amount.setCustomValidity(`1원 이상 ${comma(available)}원 이하로 입력해 주세요.`);
    fundForm.elements.amount.reportValidity();
  } else fundForm.elements.amount.setCustomValidity("");
});
fundForm.elements.amount.addEventListener("input", (event) => event.target.setCustomValidity(""));
fundDialog.addEventListener("close", () => {
  if (fundDialog.returnValue !== "confirm") return;
  const amount = Number(fundForm.elements.amount.value.replace(/,/g, ""));
  const direction = fundForm.elements.direction.value;
  const target = state.fundTarget;
  if (target.type === "draft") state.aiDrafts[target.index].cash = fundTargetCash() + (direction === "add" ? amount : -amount);
  else state.fundTransfers[target.key] += direction === "add" ? amount : -amount;
  render();
  toast(`${fundTargetName()} ${direction === "add" ? "추가 배정" : "회수"} 모의 반영`, "개인과 AI 현금만 이동하며 전체 자산과 손익은 그대로입니다.");
});

scenarioSelect.addEventListener("change", () => {
  if (scenarioSelect.value === "new-fill") {
    scenarioSelect.value = state.scenario;
    addMockFillNotification();
    return;
  }
  state.scenario = scenarioSelect.value;
  render();
});

mobileNotificationDialog.addEventListener("close", () => {
  const opener = document.querySelector('.mobile-nav [data-action="open-notifications"]');
  opener.setAttribute("aria-expanded", "false");
  if (!notificationCloseToRecord && window.innerWidth <= 820) opener.focus({ preventScroll: true });
  notificationCloseToRecord = false;
});
mobileNotificationDialog.addEventListener("click", (event) => {
  if (event.target !== mobileNotificationDialog) return;
  const bounds = mobileNotificationDialog.getBoundingClientRect();
  if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) closeAnimatedDialog(mobileNotificationDialog);
});
notificationMotion.addEventListener("change", (event) => {
  if (!event.matches) return;
  [...dialogClosures.values()].forEach((pending) => pending.finish());
  [...panelClosures.values()].forEach((pending) => pending.finish());
  const completeDetailClose = stockDetailMotion?.onComplete;
  clearStockDetailMotion();
  completeDetailClose?.();
  tabIndicatorAnimations.forEach((animation) => animation.cancel());
  tabIndicatorAnimations.clear();
  notificationEntrances.forEach((animation) => animation.cancel());
  [...notificationDeletions.values()].forEach((pending) => { pending.animation?.cancel(); pending.finish(); });
  performanceEntranceObserver?.disconnect();
  document.querySelectorAll(".chart-wrap").forEach((chart) => chart.classList.remove("is-entering", "is-entering-pending"));
});
document.addEventListener("keydown", (event) => {
  if (event.target.closest("dialog[open]")) return;
  const row = event.target.closest("[data-stock-row]");
  if (row && (event.key === "Enter" || event.key === " ")) { event.preventDefault(); row.click(); return; }
  if (event.key === "Escape" && window.innerWidth > 820 && state.desktopPanel) { closeDesktopPanel(true); event.preventDefault(); return; }
  if (event.key === "Escape" && state.aiMenuOpen && window.innerWidth <= 820) { closeAiMenuPopup(); event.preventDefault(); return; }
  const detail = pageContent.querySelector('.stock-detail[aria-modal="true"]');
  if (!detail) return;
  if (event.key === "Escape") { detail.querySelector('[data-action="close-detail"]')?.click(); event.preventDefault(); }
  if (event.key === "Tab") {
    const focusable = [...detail.querySelectorAll('button:not(:disabled), input:not(:disabled)')];
    if (!focusable.length) return;
    const first = focusable[0], last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) { last.focus(); event.preventDefault(); }
    else if (!event.shiftKey && document.activeElement === last) { first.focus(); event.preventDefault(); }
  }
});
const mobileNavigationQuery = window.matchMedia("(max-width: 820px)");
mobileNavigationQuery.addEventListener("change", () => {
  const focusInMenu = document.querySelector(".sidebar").contains(document.activeElement) || document.getElementById("mobileAiPicker").contains(document.activeElement) || mobileNotificationDialog.contains(document.activeElement);
  state.desktopPanel = null;
  state.aiMenuOpen = false;
  renderSidebar();
  renderAiNavigation();
  if (focusInMenu && !mobileNotificationDialog.open) pageContent.focus({ preventScroll: true });
});
window.addEventListener("resize", () => {
  const completeDetailClose = stockDetailMotion?.onComplete;
  clearStockDetailMotion();
  completeDetailClose?.();
  syncMobileDetail();
  syncNotificationPlacement();
  const detail = pageContent.querySelector('.stock-detail[aria-modal="true"]');
  if (detail && !detail.contains(document.activeElement)) detail.querySelector('[data-action="close-detail"]')?.focus();
});

render();
