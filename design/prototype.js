const stocks = [
  { ticker: "005930", name: "삼성전자", market: "KOSPI", logo: "삼성", price: 72600, priceText: "72,600원", change: 1200, changeText: "+1,200원", rate: "+1.68%", direction: "rise", feed: "실시간", feedType: "live", received: "10:32:16", held: 18, avg: "68,420원", pnl: "+73,980원", returnRate: "+6.01%" },
  { ticker: "000660", name: "SK하이닉스", market: "KOSPI", logo: "SK", price: 184500, priceText: "184,500원", change: -2500, changeText: "−2,500원", rate: "−1.34%", direction: "fall", feed: "실시간", feedType: "live", received: "10:32:15", held: 5, avg: "178,200원", pnl: "+30,120원", returnRate: "+3.38%" },
  { ticker: "TSLA", name: "Tesla", market: "NASDAQ", logo: "T", price: 430.17, priceText: "$430.17", change: 7.42, changeText: "+$7.42", rate: "+1.76%", direction: "rise", feed: "지연 15분", feedType: "poll", received: "10:17", held: 0, avg: "—", pnl: "—", returnRate: "—" },
  { ticker: "069500", name: "KODEX 200", market: "KOSPI ETF", logo: "KDX", price: 36175, priceText: "36,175원", change: 0, changeText: "0원", rate: "0.00%", direction: "flat", feed: "주기 조회 · 30초", feedType: "poll", received: "10:32:00", held: 22, avg: "34,910원", pnl: "+26,870원", returnRate: "+3.49%" },
  { ticker: "AAPL", name: "Apple", market: "NASDAQ", logo: "A", price: 245.18, priceText: "$245.18", change: -1.2, changeText: "−$1.20", rate: "−0.49%", direction: "fall", feed: "실시간", feedType: "live", received: "10:32:14", held: 4, avg: "$231.22", pnl: "+$54.08", returnRate: "+5.85%" },
  { ticker: "005380", name: "현대차", market: "KOSPI", logo: "현대", price: 247500, priceText: "247,500원", change: 3500, changeText: "+3,500원", rate: "+1.43%", direction: "rise", feed: "실시간", feedType: "live", received: "10:32:17", held: 7, avg: "238,000원", pnl: "+63,900원", returnRate: "+3.84%" },
  { ticker: "QQQ", name: "Invesco QQQ", market: "NASDAQ ETF", logo: "QQQ", price: 512.4, priceText: "$512.40", change: 2.18, changeText: "+$2.18", rate: "+0.43%", direction: "rise", feed: "주기 조회 · 미정", feedType: "poll", received: "10:31", held: 0, avg: "—", pnl: "—", returnRate: "—" }
];

const searchUniverse = [stocks[0], stocks[1], stocks[5], stocks[2], stocks[4], stocks[3], stocks[6]];

const state = {
  route: "stocks",
  scenario: "normal",
  stockTab: "watch",
  watchTickers: ["005930", "000660", "TSLA", "069500", "AAPL"],
  selectedTicker: "005930",
  detailOpen: false,
  reorder: false,
  orderSide: "buy",
  orderDraft: { price: "", quantity: "" },
  ordersTab: "orders",
  entity: "all",
  portfolioTab: "holdings",
  selectedAi: "swing",
  aiStatus: "running"
};

const pageContent = document.getElementById("pageContent");
const scenarioSelect = document.getElementById("scenarioSelect");
const searchDialog = document.getElementById("searchDialog");
const searchInput = document.getElementById("searchInput");
const searchResults = document.getElementById("searchResults");
const searchCount = document.getElementById("searchCount");
const confirmDialog = document.getElementById("confirmDialog");
const aiFormDialog = document.getElementById("aiFormDialog");
const notificationPanel = document.getElementById("notificationPanel");
let confirmCallback = null;
let searchTimer = null;

function stockByTicker(ticker) {
  return stocks.find((stock) => stock.ticker === ticker);
}

function directionClass(direction) {
  return direction === "rise" ? "is-rise" : direction === "fall" ? "is-fall" : "is-flat";
}

function comma(value) {
  return Number(value || 0).toLocaleString("ko-KR");
}

function renderShell() {
  document.querySelectorAll("[data-route]").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.route === state.route);
  });
  renderTopbarMarkets();
  renderGlobalBanner();
}

function renderTopbarMarkets() {
  const marketError = state.scenario === "market-error";
  document.getElementById("topbarMarkets").innerHTML = marketError
    ? `<span class="market-chip"><span class="status-dot is-error"></span><strong>시장 상태 확인 실패</strong><span>재시도 필요</span></span>`
    : `<span class="market-chip"><span class="status-dot"></span><strong>한국 정규장</strong><span>15:30까지</span></span>
       <span class="market-chip"><span class="status-dot is-closed"></span><strong>미국 거래시간 외</strong><span>22:00 프리마켓</span></span>`;
}

function renderGlobalBanner() {
  const banner = document.getElementById("globalBanner");
  if (state.scenario === "ledger-mismatch") {
    banner.innerHTML = `<div class="global-banner"><div class="global-banner__copy"><span aria-hidden="true">!</span><div><strong>장부와 실제 계좌가 일치하지 않습니다</strong><p>모든 AI 투자자의 신규 자동 주문을 차단했습니다. 기존 주문 상태 확인은 계속됩니다.</p></div></div><button class="button button--small button--danger" data-action="reconcile">다시 대조</button></div>`;
  } else if (state.scenario === "disconnected") {
    banner.innerHTML = `<div class="global-banner"><div class="global-banner__copy"><span aria-hidden="true">↻</span><div><strong>실시간 시세 연결이 끊겼습니다</strong><p>마지막 수신 가격을 유지하며 자동 재연결 중입니다.</p></div></div><button class="button button--small button--secondary" data-action="retry-connection">지금 재시도</button></div>`;
  } else if (state.scenario === "order-uncertain") {
    banner.innerHTML = `<div class="global-banner"><div class="global-banner__copy"><span aria-hidden="true">…</span><div><strong>삼성전자 주문 접수 여부를 확인하고 있습니다</strong><p>같은 주문을 다시 보내지 않고 주문 조회 결과를 기다립니다.</p></div></div><button class="button button--small button--secondary" data-route="orders">주문 보기</button></div>`;
  } else {
    banner.innerHTML = "";
  }
}

function render() {
  renderShell();
  if (state.route === "stocks") renderStocksPage();
  if (state.route === "orders") renderOrdersPage();
  if (state.route === "portfolio") renderPortfolioPage();
  if (state.route === "ai") renderAiPage();
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
  if (state.stockTab === "holdings") return stocks.filter((stock) => stock.held > 0);
  return state.watchTickers.map(stockByTicker).filter(Boolean);
}

function stockRow(stock, index) {
  const disconnected = state.scenario === "disconnected";
  const feedType = disconnected ? "disconnected" : stock.feedType;
  const feedLabel = disconnected ? "연결 끊김" : stock.feed;
  const received = disconnected ? `마지막 수신 ${stock.received}` : `수신 ${stock.received}`;
  const isSelected = stock.ticker === state.selectedTicker && state.detailOpen;
  const holdingDetail = state.stockTab === "holdings" ? `<span class="status-detail">${stock.held}주 · 평균 ${stock.avg}</span>` : `<span class="status-detail">${received}</span>`;
  const controls = state.reorder && state.stockTab === "watch"
    ? `<div class="row-actions"><button class="row-action" data-action="reorder-up" data-index="${index}" aria-label="${stock.name} 위로 이동">↑</button><button class="row-action" data-action="reorder-down" data-index="${index}" aria-label="${stock.name} 아래로 이동">↓</button><button class="row-action is-danger" data-action="remove-stock" data-ticker="${stock.ticker}">제거</button></div>`
    : `<div class="row-actions"><button class="row-action" data-stock="${stock.ticker}">상세</button></div>`;
  return `<tr class="${isSelected ? "is-selected" : ""}" data-stock-row="${stock.ticker}">
    <td><div class="stock-identity"><span class="stock-logo">${stock.logo}</span><span><strong>${stock.name}</strong><small>${stock.ticker} · ${stock.market}</small></span></div></td>
    <td class="is-number price-cell"><strong>${stock.priceText}</strong>${holdingDetail}</td>
    <td class="is-number change-cell ${directionClass(stock.direction)}"><strong>${stock.changeText}</strong><span>${stock.rate}</span></td>
    <td><span class="status-badge is-${feedType}">${feedLabel}</span></td>
    <td>${controls}</td>
  </tr>`;
}

function renderStocksPage() {
  const list = visibleStocks();
  const selected = stockByTicker(state.selectedTicker);
  const showDetail = Boolean(selected) && !state.reorder && state.detailOpen;
  pageContent.innerHTML = `
    <header class="page-heading">
      <div class="page-heading__copy"><span class="eyebrow">Market</span><h1>종목</h1><p>관심종목과 보유종목의 시세를 확인하고 직접 주문합니다.</p></div>
      <button class="button button--primary" data-action="open-search"><span aria-hidden="true">＋</span> 종목 추가</button>
    </header>
    <section class="market-grid" aria-label="시장 운영 상태">${marketCards()}</section>
    <section class="stocks-layout ${showDetail ? "has-detail" : ""}">
      <article class="surface-card">
        <header class="surface-card__header">
          <div class="segmented-control" role="tablist" aria-label="종목 목록">
            <button type="button" class="${state.stockTab === "watch" ? "is-active" : ""}" data-stock-tab="watch">관심 <span>${state.watchTickers.length}</span></button>
            <button type="button" class="${state.stockTab === "holdings" ? "is-active" : ""}" data-stock-tab="holdings">보유 <span>${stocks.filter((stock) => stock.held > 0).length}</span></button>
          </div>
          <div class="table-actions">
            <button class="button button--small button--secondary" data-action="toggle-reorder">${state.reorder ? "순서 저장" : "순서 변경"}</button>
            <button class="button button--small button--secondary" data-action="open-search">＋ 추가</button>
          </div>
        </header>
        ${list.length ? `<table class="stock-table"><thead><tr><th>종목</th><th class="is-number">현재가</th><th class="is-number">전일 대비</th><th>수신 상태</th><th></th></tr></thead><tbody>${list.map(stockRow).join("")}</tbody></table>` : `<div class="empty-state"><div><span class="empty-symbol">◎</span><h2>등록한 관심종목이 없어요</h2><p>종목을 추가하면 실시간 가격과 장 상태를 한곳에서 볼 수 있습니다.</p><button class="button button--primary" data-action="open-search">첫 종목 추가</button></div></div>`}
        <footer class="table-footer"><span>${state.stockTab === "watch" ? "목록과 순서는 서버에 저장되며 새로 열 때 다른 기기의 변경이 반영됩니다." : "토스 실계좌의 실제 보유종목입니다."}</span><span>${list.length}개 종목</span></footer>
      </article>
      ${showDetail ? renderStockDetail(selected) : ""}
    </section>`;
}

function renderStockDetail(stock) {
  const disconnected = state.scenario === "disconnected";
  const estimated = Number(state.orderDraft.price || 0) * Number(state.orderDraft.quantity || 0);
  const isBuy = state.orderSide === "buy";
  return `<aside class="stock-detail" aria-label="${stock.name} 상세">
    <header class="stock-detail__header">
      <div class="stock-detail__title">
        <div><span class="stock-logo">${stock.logo}</span><span><h2>${stock.name}</h2><small class="cell-secondary">${stock.ticker} · ${stock.market}</small></span></div>
        <button class="icon-button mobile-only" data-action="close-detail" aria-label="상세 닫기">×</button>
      </div>
      <div class="detail-price-row"><div><div class="detail-price">${stock.priceText}</div><div class="detail-change ${directionClass(stock.direction)}">${stock.changeText} (${stock.rate}) · 전일 정규장 종가 대비</div></div><span class="status-badge is-${disconnected ? "disconnected" : stock.feedType}">${disconnected ? "연결 끊김" : stock.feed}</span></div>
      <div class="detail-meta-row"><span>토스증권 · ${disconnected ? `마지막 수신 ${stock.received}` : `최신 수신 ${stock.received}`}</span><span>KST</span></div>
    </header>
    <section class="detail-section">
      <div class="section-label">내 보유</div>
      ${stock.held ? `<div class="holding-summary"><div class="holding-main"><strong>${stock.held}주</strong><small>평균매입가 ${stock.avg}</small></div><div class="holding-pnl"><strong class="is-rise">${stock.pnl}</strong><small>순평가손익 ${stock.returnRate}</small></div></div>
      <div class="cost-grid"><div class="cost-item"><span>비용 전 평가손익</span><strong>+78,400원</strong></div><div class="cost-item"><span>예상 세금</span><strong>1,360원</strong></div><div class="cost-item"><span>수수료</span><strong>3,060원</strong></div><div class="cost-item"><span>예상 비용 합계</span><strong>4,420원</strong></div></div>` : `<div class="notice"><strong>보유하지 않은 종목입니다.</strong><span>관심 등록 여부와 실제 보유 여부는 서로 독립적입니다.</span></div>`}
    </section>
    <section class="detail-section">
      <div class="section-label">지정가 주문 · 개인</div>
      <div class="order-side"><button type="button" data-action="order-side" data-side="buy" class="${isBuy ? "is-active" : ""}">매수</button><button type="button" data-action="order-side" data-side="sell" class="${!isBuy ? "is-active" : ""}" ${stock.held ? "" : "disabled"}>매도</button></div>
      <div class="order-form">
        <label class="field"><span>주문가격</span><div class="input-affix"><input data-order-input="price" inputmode="decimal" value="${state.orderDraft.price}" placeholder="${stock.price}" /><span>${stock.market.includes("NASDAQ") ? "USD" : "KRW"}</span></div></label>
        <label class="field"><span>수량</span><div class="input-affix"><input data-order-input="quantity" inputmode="numeric" value="${state.orderDraft.quantity}" placeholder="0" /><span>주</span></div></label>
        <div class="order-estimate"><span>예상 주문금액</span><strong>${stock.market.includes("NASDAQ") ? `$${comma(estimated)}` : `${comma(estimated)}원`}</strong></div>
        <div class="order-support"><span aria-hidden="true">ⓘ</span><span>정규장 지정가 주문 지원 확인됨 · 시간외 주문은 API 지원 확인 전입니다.</span></div>
        <button class="button ${isBuy ? "button--primary" : "button--secondary"}" data-action="submit-order" ${estimated > 0 ? "" : "disabled"}>${isBuy ? "매수" : "매도"} 주문 확인</button>
      </div>
    </section>
  </aside>`;
}

function renderOrdersPage() {
  const uncertain = state.scenario === "order-uncertain";
  const orderRows = [
    { stock: "삼성전자", ticker: "005930", side: "매수", price: "72,600원", quantity: "10주", filled: uncertain ? "—" : "0주", remains: uncertain ? "—" : "10주", status: uncertain ? "접수 확인 중" : "접수", badge: uncertain ? "is-warning" : "is-accent", time: "10:28:42" },
    { stock: "현대차", ticker: "005380", side: "매수", price: "247,000원", quantity: "5주", filled: "3주", remains: "2주", status: "부분체결", badge: "is-warning", time: "10:14:08" },
    { stock: "Apple", ticker: "AAPL", side: "매도", price: "$246.00", quantity: "2주", filled: "0주", remains: "2주", status: "접수", badge: "is-accent", time: "09:58:31" }
  ];
  const tradeRows = [
    { stock: "Invesco QQQ", side: "매도", price: "$512.40", quantity: "2주", status: "전체체결", time: "09.52:12" },
    { stock: "삼성전자", side: "매수", price: "71,900원", quantity: "8주", status: "전체체결", time: "09.18 14:22" },
    { stock: "현대차", side: "매수", price: "245,500원", quantity: "2주", status: "부분체결 후 취소", time: "09.16 10:04" }
  ];
  pageContent.innerHTML = `
    <header class="page-heading"><div class="page-heading__copy"><span class="eyebrow">Orders</span><h1>주문·거래</h1><p>주문 접수와 실제 체결 결과를 구분해 확인합니다.</p></div><span class="pill is-muted">최근 동기화 10:32:21</span></header>
    <article class="surface-card">
      <header class="surface-card__header"><div class="subtabs"><button class="${state.ordersTab === "orders" ? "is-active" : ""}" data-orders-tab="orders">주문 3</button><button class="${state.ordersTab === "trades" ? "is-active" : ""}" data-orders-tab="trades">거래내역</button></div><button class="button button--small button--secondary" data-action="refresh-orders">새로고침</button></header>
      ${state.ordersTab === "orders" ? `
        ${uncertain ? `<div class="notice notice--warning" style="margin:14px 18px 0"><strong>접수 결과를 확인하는 주문이 있습니다.</strong><span>조회 결과가 확인되기 전에는 같은 주문을 다시 제출하지 않습니다.</span></div>` : ""}
        <div class="table-scroll"><table class="data-table"><thead><tr><th>종목</th><th>구분</th><th class="is-number">주문가격</th><th class="is-number">주문수량</th><th class="is-number">체결</th><th class="is-number">잔여</th><th>상태</th><th>주문시각</th><th></th></tr></thead><tbody>${orderRows.map((order, index) => `<tr><td><strong>${order.stock}</strong><span class="cell-secondary">${order.ticker}</span></td><td class="${order.side === "매수" ? "is-rise" : "is-fall"}">${order.side}</td><td class="is-number">${order.price}</td><td class="is-number">${order.quantity}</td><td class="is-number">${order.filled}</td><td class="is-number">${order.remains}</td><td><span class="micro-badge ${order.badge}">${order.status}</span></td><td>${order.time}</td><td><div class="row-actions"><button class="row-action" data-action="amend-order" ${index === 0 && uncertain ? "disabled" : ""}>정정</button><button class="row-action is-danger" data-action="cancel-order" ${index === 0 && uncertain ? "disabled" : ""}>취소</button></div></td></tr>`).join("")}</tbody></table></div>` : `
        <div class="filter-bar"><label class="filter-field"><span>시작일</span><input type="date" value="2026-08-22" /></label><label class="filter-field"><span>종료일</span><input type="date" value="2026-09-22" /></label><label class="filter-field"><span>시장</span><select><option>전체 시장</option><option>국내</option><option>미국</option></select></label><button class="button button--small button--secondary">조회</button></div>
        <div class="table-scroll"><table class="data-table"><thead><tr><th>종목</th><th>구분</th><th class="is-number">평균 체결가격</th><th class="is-number">총 체결수량</th><th>결과</th><th>마지막 체결시각</th></tr></thead><tbody>${tradeRows.map((trade) => `<tr><td><strong>${trade.stock}</strong></td><td class="${trade.side === "매수" ? "is-rise" : "is-fall"}">${trade.side}</td><td class="is-number">${trade.price}</td><td class="is-number">${trade.quantity}</td><td><span class="micro-badge is-accent">${trade.status}</span></td><td>${trade.time}</td></tr>`).join("")}</tbody></table></div><footer class="table-footer"><span>주문 1건은 여러 번 체결되어도 거래내역 1행으로 표시됩니다.</span><button class="button button--small button--secondary" data-action="load-more">더 보기</button></footer>`}
    </article>`;
}

function entityData() {
  const map = {
    all: { eyebrow: "Consolidated", name: "전체", description: "개인과 모든 AI 투자자를 합산한 실제 계좌 현황", asset: "54,382,410원", twr: "+8.42%", cash: "17,940,000원", pnl: "+4,168,520원", drawdown: "−2.14%" },
    personal: { eyebrow: "Owner", name: "개인", description: "AI에 배정한 자금을 제외한 개인 귀속 자산", asset: "31,208,400원", twr: "+6.14%", cash: "11,500,000원", pnl: "+1,804,320원", drawdown: "−1.26%" },
    swing: { eyebrow: "AI · 중기", name: "밸런스 중기", description: "최초 배정 이후의 현금·보유·성과", asset: "15,632,010원", twr: "+12.68%", cash: "4,340,000원", pnl: "+1,952,600원", drawdown: "−2.88%" },
    long: { eyebrow: "AI · 장기", name: "컴파운드 장기", description: "최초 배정 이후의 현금·보유·성과", asset: "7,542,000원", twr: "+5.72%", cash: "2,100,000원", pnl: "+411,600원", drawdown: "−1.03%" }
  };
  return map[state.entity];
}

function performanceChart() {
  return `<div class="chart-wrap"><svg viewBox="0 0 720 190" role="img" aria-label="최근 30일 시간가중수익률 추이"><defs><linearGradient id="areaFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#62e0b1" stop-opacity=".45"/><stop offset="1" stop-color="#62e0b1" stop-opacity="0"/></linearGradient></defs><line class="chart-grid-line" x1="34" y1="26" x2="704" y2="26"/><line class="chart-grid-line" x1="34" y1="86" x2="704" y2="86"/><line class="chart-grid-line" x1="34" y1="146" x2="704" y2="146"/><text class="chart-label" x="0" y="30">+12%</text><text class="chart-label" x="8" y="90">+6%</text><text class="chart-label" x="20" y="150">0%</text><path class="chart-area" d="M34 144 C88 136 104 116 150 124 S224 109 270 112 S348 76 398 89 S462 50 510 65 S596 34 642 48 S681 31 704 38 L704 166 L34 166 Z"/><path class="chart-line" d="M34 144 C88 136 104 116 150 124 S224 109 270 112 S348 76 398 89 S462 50 510 65 S596 34 642 48 S681 31 704 38"/><line class="chart-missing" x1="520" y1="166" x2="545" y2="166"/><text class="chart-label" x="486" y="183">09.14 기록 없음</text><text class="chart-label" x="34" y="183">08.22</text><text class="chart-label" x="674" y="183">09.22</text></svg></div>`;
}

function renderPortfolioPage() {
  const entity = entityData();
  pageContent.innerHTML = `
    <header class="page-heading entity-heading"><div class="page-heading__copy"><span class="eyebrow">Portfolio</span><h1>투자 현황</h1><p>실계좌 하나를 개인과 AI 투자자별 장부로 구분합니다.</p></div><div class="entity-tabs" role="tablist"><button class="${state.entity === "all" ? "is-active" : ""}" data-entity="all">전체</button><button class="${state.entity === "personal" ? "is-active" : ""}" data-entity="personal">개인</button><button class="${state.entity === "swing" ? "is-active" : ""}" data-entity="swing">밸런스 중기</button><button class="${state.entity === "long" ? "is-active" : ""}" data-entity="long">컴파운드 장기</button></div></header>
    <div class="entity-heading" style="margin-bottom:14px"><div><span class="eyebrow">${entity.eyebrow}</span><h2>${entity.name}</h2><p class="cell-secondary">${entity.description}</p></div>${state.entity === "swing" || state.entity === "long" ? `<button class="button button--small button--secondary" data-route="ai">AI 운영 보기</button>` : ""}</div>
    <section class="metrics-grid">
      <article class="metric-card"><div><span class="metric-card__label"><span>대표 자산</span><span>KRW 환산</span></span><strong class="metric-card__value">${entity.asset}</strong></div><span class="metric-card__footer">평가 09.22 10:32 · 환율 기준 10:30</span></article>
      <article class="metric-card"><div><span class="metric-card__label"><span>시간가중수익률</span><span>현재 운용기간</span></span><strong class="metric-card__value is-rise">${entity.twr}</strong></div><span class="metric-card__footer">자금 이동을 성과에서 제외</span></article>
      <article class="metric-card"><div><span class="metric-card__label"><span>현금</span><span>사용 가능</span></span><strong class="metric-card__value">${entity.cash}</strong></div><span class="metric-card__footer">KRW 15,240,000 · USD $1,984</span></article>
      <article class="metric-card"><div><span class="metric-card__label"><span>총 순손익</span><span>실현 + 평가</span></span><strong class="metric-card__value is-rise">${entity.pnl}</strong></div><span class="metric-card__footer">현재 낙폭 ${entity.drawdown}</span></article>
    </section>
    <section class="overview-grid">
      <article class="surface-card chart-card"><div class="card-heading" style="padding:0;border:0;min-height:auto"><div class="card-heading__copy"><h3>시간가중수익률</h3><p>매일 00:00 및 자금 이동 직전·직후 평가</p></div><span class="pill is-muted">최근 30일</span></div>${performanceChart()}</article>
      <article class="surface-card allocation-card"><div class="card-heading" style="padding:0;border:0;min-height:auto"><div class="card-heading__copy"><h3>자산 구성</h3><p>현금과 현재가 평가금액</p></div></div><div class="allocation-list"><div class="allocation-row"><span>국내 주식·ETF</span><strong>52.4%</strong><div class="allocation-track"><i style="width:52.4%"></i></div><small>28,495,100원</small></div><div class="allocation-row"><span>미국 주식</span><strong>14.6%</strong><div class="allocation-track"><i style="width:14.6%;background:var(--purple)"></i></div><small>7,947,310원</small></div><div class="allocation-row"><span>현금</span><strong>33.0%</strong><div class="allocation-track"><i style="width:33%;background:var(--text-tertiary)"></i></div><small>17,940,000원</small></div></div></article>
    </section>
    <article class="surface-card">
      <header class="card-heading"><div class="subtabs"><button class="${state.portfolioTab === "holdings" ? "is-active" : ""}" data-portfolio-tab="holdings">보유종목</button><button class="${state.portfolioTab === "pnl" ? "is-active" : ""}" data-portfolio-tab="pnl">손익</button><button class="${state.portfolioTab === "orders" ? "is-active" : ""}" data-portfolio-tab="orders">주문·거래</button></div><span class="cell-secondary">금액은 종목의 원래 통화로 표시</span></header>
      ${renderPortfolioTable()}
    </article>`;
}

function renderPortfolioTable() {
  if (state.portfolioTab === "pnl") {
    return `<div class="table-scroll"><table class="data-table"><thead><tr><th>구분</th><th class="is-number">비용 전 손익</th><th class="is-number">세금</th><th class="is-number">수수료</th><th class="is-number">비용 합계</th><th class="is-number">순손익</th></tr></thead><tbody><tr><td><strong>실현손익</strong><span class="cell-secondary">실제 매도 체결</span></td><td class="is-number is-rise">+1,840,200원</td><td class="is-number">182,300원</td><td class="is-number">42,800원</td><td class="is-number">225,100원</td><td class="is-number is-rise">+1,615,100원</td></tr><tr><td><strong>평가손익</strong><span class="cell-secondary">현재 보유분</span></td><td class="is-number is-rise">+2,678,420원</td><td class="is-number">예상 48,200원</td><td class="is-number">예상 76,800원</td><td class="is-number">예상 125,000원</td><td class="is-number is-rise">+2,553,420원</td></tr><tr><td><strong>총손익</strong></td><td class="is-number is-rise">+4,518,620원</td><td class="is-number">230,500원</td><td class="is-number">119,600원</td><td class="is-number">350,100원</td><td class="is-number is-rise">+4,168,520원</td></tr></tbody></table></div>`;
  }
  if (state.portfolioTab === "orders") {
    return `<div class="table-scroll"><table class="data-table"><thead><tr><th>투자 주체</th><th>종목</th><th>구분</th><th class="is-number">가격</th><th class="is-number">수량</th><th>상태</th></tr></thead><tbody><tr><td><span class="micro-badge">개인</span></td><td><strong>삼성전자</strong></td><td class="is-rise">매수</td><td class="is-number">72,600원</td><td class="is-number">10주</td><td><span class="micro-badge is-accent">접수</span></td></tr><tr><td><span class="micro-badge is-purple">밸런스 중기</span></td><td><strong>현대차</strong></td><td class="is-rise">매수</td><td class="is-number">247,000원</td><td class="is-number">5주</td><td><span class="micro-badge is-warning">부분체결</span></td></tr></tbody></table></div>`;
  }
  return `<div class="table-scroll"><table class="data-table"><thead><tr><th>종목</th><th class="is-number">총 수량</th><th>투자 주체별 수량</th><th class="is-number">평가금액</th><th class="is-number">순평가손익</th><th></th></tr></thead><tbody><tr><td><strong>삼성전자</strong><span class="cell-secondary">005930 · KRW</span></td><td class="is-number">38주</td><td>개인 18 · 밸런스 중기 12 · 컴파운드 장기 8</td><td class="is-number">2,758,800원</td><td class="is-number is-rise">+183,200원</td><td><button class="row-action" data-action="choose-seller">매도</button></td></tr><tr><td><strong>SK하이닉스</strong><span class="cell-secondary">000660 · KRW</span></td><td class="is-number">11주</td><td>개인 5 · 밸런스 중기 6</td><td class="is-number">2,029,500원</td><td class="is-number is-rise">+122,840원</td><td><button class="row-action" data-action="choose-seller">매도</button></td></tr><tr><td><strong>Apple</strong><span class="cell-secondary">AAPL · USD</span></td><td class="is-number">4주</td><td>개인 4</td><td class="is-number">$980.72</td><td class="is-number is-rise">+$54.08</td><td><button class="row-action" data-action="choose-seller">매도</button></td></tr></tbody></table></div>`;
}

function renderAiPage() {
  const mismatch = state.scenario === "ledger-mismatch";
  const stopping = state.aiStatus === "stopping";
  const stopped = state.aiStatus === "stopped";
  pageContent.innerHTML = `
    <header class="page-heading"><div class="page-heading__copy"><span class="eyebrow">AI investors</span><h1>AI 투자자</h1><p>각 투자자의 자금·판단·주문·성과를 독립적으로 관리합니다.</p></div><button class="button button--primary" data-action="ai-create">＋ AI 투자자</button></header>
    <section class="ai-layout">
      <div class="ai-list" aria-label="AI 투자자 목록">
        <button class="ai-card ${state.selectedAi === "swing" ? "is-selected" : ""}" data-ai="swing"><div class="ai-card__top"><div class="ai-card__identity"><span class="ai-avatar">B</span><span><strong>밸런스 중기</strong><small>중기 · 국내 주식·ETF</small></span></div><span class="pill ${stopped ? "is-muted" : stopping ? "is-warning" : ""}">${stopped ? "중지 완료" : stopping ? "중지 처리 중" : "실행 중"}</span></div><div class="ai-card__metrics"><span><small>현재 자산</small><strong>15,632,010원</strong></span><span><small>TWR</small><strong class="is-rise">+12.68%</strong></span></div></button>
        <button class="ai-card ${state.selectedAi === "long" ? "is-selected" : ""}" data-ai="long"><div class="ai-card__top"><div class="ai-card__identity"><span class="ai-avatar">C</span><span><strong>컴파운드 장기</strong><small>장기 · 국내 주식·ETF</small></span></div><span class="pill is-muted">중지 완료</span></div><div class="ai-card__metrics"><span><small>현재 자산</small><strong>7,542,000원</strong></span><span><small>TWR</small><strong class="is-rise">+5.72%</strong></span></div></button>
      </div>
      <div class="ai-detail">
        <article class="surface-card ai-hero">
          <div class="ai-hero__top"><div class="ai-hero__identity"><span class="ai-avatar">${state.selectedAi === "swing" ? "B" : "C"}</span><div><span class="eyebrow">${state.selectedAi === "swing" ? "중기" : "장기"} 투자자</span><h2>${state.selectedAi === "swing" ? "밸런스 중기" : "컴파운드 장기"}</h2><p>${mismatch ? "장부 불일치로 신규 자동 주문 차단" : stopped ? "자동매매 중지 완료 · 보유종목 유지" : stopping ? "자동 주문 종료 여부 확인 중" : "다음 정기 판단을 기다리는 중"}</p></div></div><div class="ai-actions"><button class="button button--small button--secondary" data-action="ai-funds" ${stopping ? "disabled" : ""}>자금 관리</button>${stopped ? `<button class="button button--small button--primary" data-action="ai-resume" ${mismatch ? "disabled" : ""}>자동매매 재개</button>` : `<button class="button button--small button--danger" data-action="ai-pause" ${stopping ? "disabled" : ""}>자동매매 중지</button>`}</div></div>
          ${stopping ? `<div class="notice notice--warning" style="margin-top:18px"><strong>중지 처리 중입니다.</strong><span>접수 확인 중 1건의 접수 여부를 확인한 뒤 미체결 잔여수량을 취소합니다. 수동 매도와 재개는 아직 사용할 수 없습니다.</span></div>` : ""}
          ${mismatch ? `<div class="notice notice--danger" style="margin-top:18px"><strong>장부 대조가 필요합니다.</strong><span>개인과 모든 AI 장부 합계가 실제 계좌와 일치하기 전까지 재개할 수 없습니다.</span></div>` : ""}
          <div class="ai-info-grid"><div class="ai-info-item"><small>최초 배정금</small><strong>12,000,000원</strong></div><div class="ai-info-item"><small>현재 현금</small><strong>4,340,000원</strong></div><div class="ai-info-item"><small>사용 가능 현금</small><strong>3,140,000원</strong></div><div class="ai-info-item"><small>예약 현금</small><strong>1,200,000원</strong></div></div>
        </article>
        <article class="surface-card">
          <header class="card-heading"><div class="card-heading__copy"><h3>최근 판단 기록</h3><p>탐색·판단·주문 결과를 연결해 기록</p></div><span class="pill is-purple">전략 기준 보류</span></header>
          <div class="timeline"><div class="timeline-item"><time>오늘 10:20</time><span class="timeline-rail"><i class="timeline-dot"></i></span><div class="timeline-content"><strong>현대차 매수 판단</strong><p>후보 탐색 24종목 → 현재가·최근 일봉·거래량과 사용 가능 현금 확인 → 지정가 247,000원 5주</p><span class="micro-badge is-warning">3주 체결 · 2주 미체결</span></div></div><div class="timeline-item"><time>오늘 09:30</time><span class="timeline-rail"><i class="timeline-dot"></i></span><div class="timeline-content"><strong>삼성전자 관망</strong><p>보유 12주와 미체결 주문 없음 확인. 판단 근거는 전략 기준 확정 후 구체화합니다.</p><span class="micro-badge">주문 없음</span></div></div><div class="timeline-item"><time>어제 14:40</time><span class="timeline-rail"><i class="timeline-dot"></i></span><div class="timeline-content"><strong>SK하이닉스 매수 완료</strong><p>지정가 181,500원 6주 · 전체체결 · 비용과 보유 장부 반영 완료</p><span class="micro-badge is-accent">장부 대조 완료</span></div></div></div>
        </article>
        <article class="surface-card"><header class="card-heading"><div class="card-heading__copy"><h3>보유종목</h3><p>이 AI 투자자에게 귀속된 보유분만 표시</p></div></header><div class="table-scroll"><table class="data-table"><thead><tr><th>종목</th><th class="is-number">수량</th><th class="is-number">평균매입가</th><th class="is-number">순평가손익</th><th></th></tr></thead><tbody><tr><td><strong>삼성전자</strong></td><td class="is-number">12주</td><td class="is-number">69,100원</td><td class="is-number is-rise">+38,200원</td><td><button class="row-action" data-action="ai-manual-sell" ${stopped ? "" : "disabled"}>수동 매도</button></td></tr><tr><td><strong>SK하이닉스</strong></td><td class="is-number">6주</td><td class="is-number">181,500원</td><td class="is-number is-rise">+15,840원</td><td><button class="row-action" data-action="ai-manual-sell" ${stopped ? "" : "disabled"}>수동 매도</button></td></tr></tbody></table></div></article>
      </div>
    </section>`;
}

function renderSearchResults(query = "") {
  const normalized = query.trim().toLowerCase();
  if (normalized === "오류") {
    searchCount.textContent = "검색 실패";
    searchResults.innerHTML = `<div class="empty-state"><div><span class="empty-symbol">!</span><h2>검색하지 못했어요</h2><p>연결 상태를 확인하고 다시 시도해 주세요.</p><button class="button button--secondary" data-action="retry-search">다시 시도</button></div></div>`;
    return;
  }
  const results = searchUniverse.filter((stock) => `${stock.name} ${stock.ticker} ${stock.market}`.toLowerCase().includes(normalized));
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

function openConfirm({ eyebrow, title, copy, summary = [], actionLabel = "확인", danger = false, onConfirm }) {
  document.getElementById("confirmEyebrow").textContent = eyebrow;
  document.getElementById("confirmTitle").textContent = title;
  document.getElementById("confirmCopy").textContent = copy;
  document.getElementById("confirmSummary").innerHTML = summary.map(([label, value]) => `<div class="confirm-row"><span>${label}</span><strong>${value}</strong></div>`).join("");
  const action = document.getElementById("confirmAction");
  action.textContent = actionLabel;
  action.className = `button ${danger ? "button--danger" : "button--primary"}`;
  document.getElementById("confirmIcon").textContent = danger ? "!" : "✓";
  confirmCallback = onConfirm;
  confirmDialog.showModal();
}

function toast(title, message = "") {
  const region = document.getElementById("toastRegion");
  const element = document.createElement("div");
  element.className = "toast";
  element.innerHTML = `<span class="toast__icon">✓</span><div><strong>${title}</strong>${message ? `<p>${message}</p>` : ""}</div>`;
  region.appendChild(element);
  window.setTimeout(() => element.remove(), 3600);
}

function setRoute(route) {
  if (route === "stocks" && state.route !== "stocks") state.detailOpen = window.innerWidth > 820;
  state.route = route;
  render();
  pageContent.focus({ preventScroll: true });
  window.scrollTo({ top: 0, behavior: "smooth" });
}

document.addEventListener("click", (event) => {
  const routeButton = event.target.closest("[data-route]");
  if (routeButton) {
    setRoute(routeButton.dataset.route);
    return;
  }

  const tab = event.target.closest("[data-stock-tab]");
  if (tab) {
    state.stockTab = tab.dataset.stockTab;
    state.reorder = false;
    const next = visibleStocks()[0];
    state.selectedTicker = next ? next.ticker : null;
    state.detailOpen = window.innerWidth > 820;
    state.orderDraft = { price: "", quantity: "" };
    render();
    return;
  }

  const stockButton = event.target.closest("[data-stock]");
  if (stockButton) {
    const nextTicker = stockButton.dataset.stock;
    if ((state.orderDraft.price || state.orderDraft.quantity) && nextTicker !== state.selectedTicker) {
      const nextStock = stockByTicker(nextTicker);
      openConfirm({ eyebrow: "입력 초기화", title: `${nextStock.name}(으)로 이동할까요?`, copy: "현재 입력한 주문가격과 수량은 저장되지 않고 사라집니다. 이미 제출한 주문에는 영향을 주지 않습니다.", actionLabel: "입력 지우고 이동", danger: true, onConfirm: () => { state.orderDraft = { price: "", quantity: "" }; state.selectedTicker = nextTicker; state.detailOpen = true; render(); } });
    } else {
      state.selectedTicker = nextTicker;
      state.detailOpen = true;
      render();
    }
    return;
  }

  const ordersTab = event.target.closest("[data-orders-tab]");
  if (ordersTab) { state.ordersTab = ordersTab.dataset.ordersTab; render(); return; }
  const portfolioTab = event.target.closest("[data-portfolio-tab]");
  if (portfolioTab) { state.portfolioTab = portfolioTab.dataset.portfolioTab; render(); return; }
  const entityButton = event.target.closest("[data-entity]");
  if (entityButton) { state.entity = entityButton.dataset.entity; render(); return; }
  const aiButton = event.target.closest("[data-ai]");
  if (aiButton) { state.selectedAi = aiButton.dataset.ai; state.aiStatus = aiButton.dataset.ai === "long" ? "stopped" : "running"; render(); return; }

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
  if (action === "open-search") { searchDialog.showModal(); searchInput.value = ""; renderSearchResults(); window.setTimeout(() => searchInput.focus(), 50); }
  if (action === "toggle-reorder") { state.reorder = !state.reorder; render(); if (!state.reorder) toast("관심종목 순서를 저장했어요"); }
  if (action === "reorder-up" || action === "reorder-down") {
    const from = Number(actionButton.dataset.index);
    const to = action === "reorder-up" ? Math.max(0, from - 1) : Math.min(state.watchTickers.length - 1, from + 1);
    [state.watchTickers[from], state.watchTickers[to]] = [state.watchTickers[to], state.watchTickers[from]];
    render();
  }
  if (action === "remove-stock") {
    const ticker = actionButton.dataset.ticker;
    state.watchTickers = state.watchTickers.filter((item) => item !== ticker);
    if (state.selectedTicker === ticker) state.selectedTicker = state.watchTickers[0] || null;
    render();
    toast(`${stockByTicker(ticker).name}을 관심종목에서 제거했어요`, "실제 보유수량에는 영향을 주지 않습니다.");
  }
  if (action === "close-detail") { state.detailOpen = false; state.orderDraft = { price: "", quantity: "" }; render(); }
  if (action === "order-side") { state.orderSide = actionButton.dataset.side; render(); }
  if (action === "submit-order") {
    const stock = stockByTicker(state.selectedTicker);
    const total = Number(state.orderDraft.price) * Number(state.orderDraft.quantity);
    openConfirm({ eyebrow: "지정가 주문", title: `${stock.name} ${state.orderSide === "buy" ? "매수" : "매도"} 주문을 제출할까요?`, copy: "접수는 체결을 의미하지 않습니다. 주문 내용을 다시 확인해 주세요.", summary: [["투자 주체", "개인"], ["구분", state.orderSide === "buy" ? "매수" : "매도"], ["주문가격", `${comma(state.orderDraft.price)}${stock.market.includes("NASDAQ") ? " USD" : "원"}`], ["수량", `${comma(state.orderDraft.quantity)}주`], ["예상 주문금액", `${comma(total)}${stock.market.includes("NASDAQ") ? " USD" : "원"}`]], actionLabel: "주문 제출", onConfirm: () => { state.orderDraft = { price: "", quantity: "" }; toast("주문을 전송했어요", "접수 결과를 확인하고 있습니다."); render(); } });
  }
  if (action === "retry-market") { state.scenario = "normal"; scenarioSelect.value = "normal"; render(); toast("시장 정보를 다시 확인했어요"); }
  if (action === "retry-connection") { state.scenario = "normal"; scenarioSelect.value = "normal"; render(); toast("최신 시세 수신을 확인했어요", "연결만 복구된 시점이 아니라 최신 시세 수신 후 정상 상태로 전환했습니다."); }
  if (action === "retry-search") { searchInput.value = "삼성"; renderSearchResults("삼성"); }
  if (action === "refresh-orders") toast("최신 주문 상태를 확인했어요");
  if (action === "load-more") toast("이전 거래내역을 이어서 불러왔어요");
  if (action === "amend-order") openConfirm({ eyebrow: "주문 정정", title: "미체결 주문을 정정할까요?", copy: "이미 체결된 수량은 정정되지 않습니다. 토스 API가 허용하는 가격과 잔여수량만 변경됩니다.", summary: [["변경 가격", "247,500원"], ["정정 대상", "미체결 2주"]], actionLabel: "정정 요청", onConfirm: () => toast("정정 요청을 전송했어요") });
  if (action === "cancel-order") openConfirm({ eyebrow: "주문 취소", title: "미체결 잔여수량을 취소할까요?", copy: "이미 체결된 수량과 거래내역은 유지됩니다.", summary: [["취소 대상", "미체결 2주"]], actionLabel: "취소 요청", danger: true, onConfirm: () => toast("취소 요청을 전송했어요", "종료 상태를 계속 확인합니다.") });
  if (action === "choose-seller") openConfirm({ eyebrow: "투자 주체 선택", title: "누구의 보유분을 매도할까요?", copy: "선택한 투자 주체의 보유수량만 주문 대상으로 사용합니다.", summary: [["개인", "18주"], ["밸런스 중기", "12주 · 실행 중"], ["컴파운드 장기", "8주 · 중지 완료"]], actionLabel: "개인 선택", onConfirm: () => { setRoute("stocks"); state.stockTab = "holdings"; state.selectedTicker = "005930"; state.detailOpen = true; render(); } });
  if (action === "ai-create") aiFormDialog.showModal();
  if (action === "ai-pause") openConfirm({ eyebrow: "자동매매 중지", title: "밸런스 중기의 자동매매를 중지할까요?", copy: "새로운 판단과 주문 제출을 즉시 중단하고, 이 AI의 미체결 자동 주문은 취소합니다. 보유종목은 그대로 유지됩니다.", summary: [["미체결 자동 주문", "1건"], ["보유종목", "2개 · 유지"]], actionLabel: "중지 및 주문 취소", danger: true, onConfirm: () => { state.aiStatus = "stopping"; render(); toast("자동매매 중지를 시작했어요", "모든 자동 주문의 종료를 확인하고 있습니다."); window.setTimeout(() => { if (state.aiStatus === "stopping") { state.aiStatus = "stopped"; render(); toast("자동매매 중지가 완료됐어요"); } }, 2200); } });
  if (action === "ai-resume") openConfirm({ eyebrow: "자동매매 재개", title: "최신 상태를 확인하고 재개할까요?", copy: "시세·보유·미체결 주문·사용 가능한 현금을 확인하고 전체 장부를 실제 계좌와 대조한 뒤 새 판단을 실행합니다.", summary: [["이전 판단", "재사용 안 함"], ["중지 중 놓친 판단", "몰아서 실행 안 함"]], actionLabel: "확인 후 재개", onConfirm: () => { state.aiStatus = "running"; render(); toast("대조를 완료하고 새 판단을 시작했어요"); } });
  if (action === "ai-funds") openConfirm({ eyebrow: "자금 관리", title: "추가 자금을 배정할까요?", copy: "중지 완료 후 사용 가능한 개인 현금에서 해당 AI로 이동합니다. 최초 배정금과 투자손익은 바뀌지 않습니다.", summary: [["개인 사용 가능 현금", "11,500,000원"], ["추가 배정", "1,000,000원"]], actionLabel: "추가 배정", onConfirm: () => toast("자금을 추가 배정했어요", "전체에는 내부 이동으로 기록했습니다.") });
  if (action === "ai-manual-sell") { setRoute("stocks"); state.stockTab = "holdings"; state.selectedTicker = "005930"; state.detailOpen = true; state.orderSide = "sell"; render(); }
  if (action === "reconcile") { state.scenario = "normal"; scenarioSelect.value = "normal"; render(); toast("장부와 실제 계좌가 일치해요", "자동매매는 사용자가 재개하기 전까지 중지 상태를 유지합니다."); }
});

document.addEventListener("input", (event) => {
  const orderInput = event.target.closest("[data-order-input]");
  if (orderInput) {
    state.orderDraft[orderInput.dataset.orderInput] = orderInput.value.replace(/[^0-9.]/g, "");
    const estimate = document.querySelector(".order-estimate strong");
    const submit = document.querySelector('[data-action="submit-order"]');
    const selected = stockByTicker(state.selectedTicker);
    const total = Number(state.orderDraft.price || 0) * Number(state.orderDraft.quantity || 0);
    if (estimate && selected) estimate.textContent = selected.market.includes("NASDAQ") ? `$${comma(total)}` : `${comma(total)}원`;
    if (submit) submit.disabled = total <= 0;
  }
});

searchInput.addEventListener("input", () => {
  window.clearTimeout(searchTimer);
  searchCount.textContent = "검색 중…";
  searchResults.innerHTML = `<div class="empty-state"><div><span class="empty-symbol">…</span><h2>종목을 찾고 있어요</h2><p>입력한 이름과 코드에 맞는 종목을 검색합니다.</p></div></div>`;
  searchTimer = window.setTimeout(() => renderSearchResults(searchInput.value), 280);
});

confirmDialog.addEventListener("close", () => {
  if (confirmDialog.returnValue === "confirm" && confirmCallback) confirmCallback();
  confirmCallback = null;
});

aiFormDialog.addEventListener("close", () => {
  if (aiFormDialog.returnValue === "confirm") toast("AI 투자자 초안을 만들었어요", "전략 기준이 확정되기 전에는 자동매매를 시작할 수 없습니다.");
});

scenarioSelect.addEventListener("change", () => {
  state.scenario = scenarioSelect.value;
  render();
});

document.getElementById("notificationButton").addEventListener("click", () => {
  notificationPanel.classList.toggle("is-open");
  notificationPanel.setAttribute("aria-hidden", notificationPanel.classList.contains("is-open") ? "false" : "true");
});

document.getElementById("notificationClose").addEventListener("click", () => {
  notificationPanel.classList.remove("is-open");
  notificationPanel.setAttribute("aria-hidden", "true");
});

function updateTime() {
  const formatter = new Intl.DateTimeFormat("en-GB", { timeZone: "Asia/Seoul", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false });
  const parts = Object.fromEntries(formatter.formatToParts(new Date()).map((part) => [part.type, part.value]));
  document.getElementById("currentTime").textContent = `${parts.month}.${parts.day} ${parts.hour}:${parts.minute}:${parts.second} KST`;
}

updateTime();
window.setInterval(updateTime, 1000);
render();
