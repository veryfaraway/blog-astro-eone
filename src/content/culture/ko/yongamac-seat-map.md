---
title: 용아맥 예매 전쟁 생존 가이드 — 좌석 명당 지도
description: 용산 CGV IMAX 좌석 배치도를 명당 순으로 시각화했습니다. 예매 오픈 전에 미리 봐두면 0.1초도 안 낭비할 수 있어요.
date: 2026-03-31
category: 아는 척하기 딱 좋은
tags:
  - "용아맥"
  - "IMAX"
  - "좌석 배치도"
  - "예매팁"
draft: false
lang: ko
thumbnail: "https://res.cloudinary.com/doal3ofyr/image/upload/v1774927357/media/references/theater/imax_theater_s1nmv5.jpg"
---

> 용아맥 예매는 오픈 5분이면 끝난다. 그 5분 안에 머뭇거리지 않으려면 좌석 지도를 머릿속에 넣어둬야 한다.

## 이 글에서 다루는 내용

- 용산 CGV IMAX 좌석 등급 시각화 (마우스 오버로 설명 확인)
- 절대 피해야 할 자리와 그 이유
- 등급별 빠른 선택 전략
- 취켓팅 노하우

---

## 용아맥이 특별한 이유

용산 CGV IMAX, 일명 **용아맥**은 국내 유일의 **IMAX GT(레이저)** 상영관입니다. 화면 크기 31m × 22m, 화면비 1.43:1 — 일반 IMAX보다 세로가 훨씬 넓어서 영화 위아래가 잘리지 않습니다. 놀란 영화처럼 IMAX 카메라로 촬영한 장면은 여기서만 온전히 볼 수 있어요.

그래서 블록버스터 개봉일마다 예매 전쟁이 벌어집니다. 오픈 동시에 접속해도 좋은 자리는 10분 안에 사라지는 경우가 허다하죠.

---

## 좌석 명당 지도

아래 지도에서 각 좌석에 마우스를 올리면 등급과 설명을 확인할 수 있습니다.

<div class="yongamac-map-wrap">
<style>
.yongamac-map-wrap {
  --grade-s: #e53935;
  --grade-a: #f4692a;
  --grade-b: #f59f00;
  --grade-c: #4caf50;
  --grade-d: #2196f3;
  --grade-e: #5a6070;
  background: #0d0f14;
  border-radius: 12px;
  padding: 1.5rem 1rem 1.25rem;
  margin: 1.5rem 0;
  color: #e8eaf0;
  font-family: inherit;
}
.ym-title {
  text-align: center;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.12em;
  color: #8a90a0;
  text-transform: uppercase;
  margin-bottom: 1rem;
}
.ym-screen-box {
  width: 68%;
  background: linear-gradient(180deg, #1e3a5f 0%, #0d2040 100%);
  border: 1px solid rgba(100,160,255,0.35);
  border-radius: 3px 3px 40% 40% / 3px 3px 18px 18px;
  padding: 6px 0 13px;
  text-align: center;
  font-size: 9px;
  font-weight: 600;
  letter-spacing: 0.14em;
  color: #90b8e8;
  text-transform: uppercase;
  margin: 0 auto 0;
}
.ym-proj-line {
  width: 1px;
  height: 20px;
  border-left: 1px dashed rgba(100,160,255,0.2);
  margin: 0 auto 6px;
}
.ym-legend {
  display: flex;
  flex-wrap: wrap;
  gap: 5px 12px;
  margin: 0 0 10px;
  font-size: 10px;
  color: #8a90a0;
}
.ym-li { display: flex; align-items: center; gap: 4px; }
.ym-dot { width: 10px; height: 10px; border-radius: 2px; flex-shrink: 0; }
.ym-map-container { display: flex; gap: 4px; }
.ym-row-labels { display: flex; flex-direction: column; gap: 2px; padding-top: 14px; }
.ym-row-label {
  height: 11px; width: 14px; font-size: 9px; font-weight: 600;
  color: #4a5060; display: flex; align-items: center; justify-content: center;
}
.ym-grid-wrap { flex: 1; overflow-x: auto; }
.ym-col-nums { display: flex; gap: 2px; margin-bottom: 2px; }
.ym-col-num { width: 11px; font-size: 7px; text-align: center; color: #4a5060; flex-shrink: 0; }
.ym-col-num-gap { width: 6px; flex-shrink: 0; }
.ym-seat-grid { display: flex; flex-direction: column; gap: 2px; }
.ym-seat-row { display: flex; gap: 2px; align-items: center; }
.ym-gap-block { width: 6px; flex-shrink: 0; }
.ym-seat {
  width: 11px; height: 11px; border-radius: 2px;
  cursor: pointer; transition: transform 0.1s; flex-shrink: 0;
}
.ym-seat:hover { transform: scale(1.5); z-index: 10; }
.ym-blocked { background: #1e2028; border: 0.5px solid rgba(255,255,255,0.04); cursor: default; }
.ym-blocked:hover { transform: none !important; }
.ym-s { background: var(--grade-s); }
.ym-a { background: var(--grade-a); }
.ym-b { background: var(--grade-b); }
.ym-c { background: var(--grade-c); }
.ym-d { background: var(--grade-d); }
.ym-e { background: var(--grade-e); }
.ym-tooltip {
  margin-top: 10px;
  background: #161920;
  border: 0.5px solid rgba(255,255,255,0.08);
  border-radius: 7px;
  padding: 9px 12px;
  font-size: 11px;
  line-height: 1.6;
  color: #8a90a0;
  min-height: 44px;
}
.ym-tooltip strong { color: #e8eaf0; }
</style>

<div class="ym-title">Yongsan CGV IMAX — Seat Quality Map</div>

<div class="ym-screen-box">SCREEN · 31m × 22m · IMAX GT 1.43:1</div>
<div class="ym-proj-line"></div>

<div class="ym-legend">
  <div class="ym-li"><div class="ym-dot" style="background:var(--grade-s)"></div>S — 최고 명당</div>
  <div class="ym-li"><div class="ym-dot" style="background:var(--grade-a)"></div>A — 강력 추천</div>
  <div class="ym-li"><div class="ym-dot" style="background:var(--grade-b)"></div>B — 추천</div>
  <div class="ym-li"><div class="ym-dot" style="background:var(--grade-c)"></div>C — 양호</div>
  <div class="ym-li"><div class="ym-dot" style="background:var(--grade-d)"></div>D — 무난</div>
  <div class="ym-li"><div class="ym-dot" style="background:var(--grade-e)"></div>E — 비추천</div>
  <div class="ym-li"><div class="ym-dot" style="background:#1e2028;border:0.5px solid rgba(255,255,255,0.12)"></div>기피</div>
</div>

<div class="ym-map-container">
  <div class="ym-row-labels" id="ym-row-labels"></div>
  <div class="ym-grid-wrap">
    <div class="ym-col-nums" id="ym-col-nums"></div>
    <div class="ym-seat-grid" id="ym-seat-grid"></div>
  </div>
</div>

<div class="ym-tooltip" id="ym-tooltip">좌석에 마우스를 올려보세요.</div>

<script>
(function(){
  var ROWS=['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P'];
  var SIDE_L=Array.from({length:11},(_,i)=>i+1);
  var CTR=Array.from({length:22},(_,i)=>i+12);
  var SIDE_R=Array.from({length:11},(_,i)=>i+34);
  function grade(row,col){
    var isSL=col<=11, isSR=col>=34;
    var offset=Math.abs(col-22.5);
    if(['A','B','C'].includes(row)) return 'blocked';
    if(isSL||isSR){
      if(['D','E','F'].includes(row)) return 'blocked';
      if(['G','H'].includes(row)) return 'e';
      if(['I','J','K'].includes(row)) return 'd';
      return 'e';
    }
    var cs=offset<=3?5:offset<=6?4:offset<=9?3:1.5;
    var t=cs>=4?1:cs>=2.5?2:3;
    var m={D:[,'c','d','e'],E:[,'c','d','e'],F:[,'b','c','d'],G:[,'a','b','c'],
           H:[,'s','a','b'],I:[,'s','a','b'],J:[,'a','a','b'],K:[,'a','b','c'],
           L:[,'b','b','c'],M:[,'b','c','d'],N:[,'c','c','d'],O:[,'c','d','e'],P:[,'d','d','e']};
    return (m[row]&&m[row][t])||'e';
  }
  var info={
    s:{l:'S등급 — 최고 명당',d:'화면 중심 정면, 시선이 스크린 중앙에 자연스럽게 고정. 사운드 최적. 예매 오픈 후 수분 내 소진됩니다.'},
    a:{l:'A등급 — 강력 추천',d:'몰입감과 시야각 균형이 매우 좋음. S가 없다면 즉시 선택하세요.'},
    b:{l:'B등급 — 추천',d:'충분히 좋은 자리. 명당이 이미 찼다면 이 등급에서 중앙 가까운 번호를 노리세요.'},
    c:{l:'C등급 — 양호',d:'일반 상영관 대비 여전히 좋은 경험. 단 IMAX GT 압도감은 다소 감소합니다.'},
    d:{l:'D등급 — 무난',d:'뒷열이거나 사이드 중간. 부담 없이 볼 수 있지만 아이맥스 느낌은 희석됩니다.'},
    e:{l:'E등급 — 비추천',d:'맨 뒷줄(P열)이나 사이드 끝. 화면 위화감 또는 스크린 거리 문제가 있습니다.'},
    blocked:{l:'기피석 — 관람에 지장',d:'A~C열: 화면이 머리 위로 치솟아 정상 관람 불가. D~F열 사이드: 극심한 각도 왜곡 + 사운드 편중.'}
  };
  var tooltip=document.getElementById('ym-tooltip');
  var rowLabels=document.getElementById('ym-row-labels');
  var colNums=document.getElementById('ym-col-nums');
  var grid=document.getElementById('ym-seat-grid');
  function addColNum(n,step){ var d=document.createElement('div'); d.className='ym-col-num'; d.textContent=(n%step===0)?n:''; colNums.appendChild(d); }
  function addGap(cls){ var d=document.createElement('div'); d.className=cls; colNums.appendChild(d); }
  SIDE_L.forEach(n=>addColNum(n,2));
  addGap('ym-col-num-gap');
  CTR.forEach(n=>addColNum(n,4));
  addGap('ym-col-num-gap');
  SIDE_R.forEach(n=>addColNum(n,2));
  ROWS.forEach(function(row){
    var lbl=document.createElement('div'); lbl.className='ym-row-label'; lbl.textContent=row; rowLabels.appendChild(lbl);
    var rowDiv=document.createElement('div'); rowDiv.className='ym-seat-row';
    function addSeat(col){
      var g=grade(row,col);
      var el=document.createElement('div');
      el.className='ym-seat '+(g==='blocked'?'ym-blocked':'ym-'+g);
      el.addEventListener('mouseenter',function(){ var i=info[g]; tooltip.innerHTML='<strong>'+row+'열 '+col+'번</strong> &nbsp;·&nbsp; <strong>'+i.l+'</strong><br>'+i.d; });
      el.addEventListener('mouseleave',function(){ tooltip.textContent='좌석에 마우스를 올려보세요.'; });
      rowDiv.appendChild(el);
    }
    SIDE_L.forEach(addSeat);
    var g1=document.createElement('div'); g1.className='ym-gap-block'; rowDiv.appendChild(g1);
    CTR.forEach(addSeat);
    var g2=document.createElement('div'); g2.className='ym-gap-block'; rowDiv.appendChild(g2);
    SIDE_R.forEach(addSeat);
    grid.appendChild(rowDiv);
  });
})();
</script>
</div>

---

## 등급별 선택 전략

**S등급 (H·I열 중앙 14~31번)** — 무조건 여기부터 시작. 화면 정중앙이 눈 높이에 맞고, 사운드도 가장 균형 잡혀 있습니다. 예매 오픈과 동시에 이미 S석을 점찍어 두고 클릭하는 사람들이 있어서 자리가 정말 빠르게 빠집니다.

**A등급 (G·J·K열 중앙, H·I열 중앙 사이드)** — S가 다 찼다면 바로 여기로. 충분히 훌륭한 자리입니다.

**절대 피할 자리** — A·B·C열 전체, 그리고 D~F열 양쪽 사이드. 전자는 화면이 머리 위로 치솟아 고개를 꺾어야 하고, 후자는 스크린이 크게 왜곡되어 보입니다.

**사이드는 I열 이상부터** — 어쩔 수 없이 사이드를 골라야 한다면, 최소 I열은 돼야 합니다. G·H열 사이드는 목이 완전히 돌아가는 각도입니다.

---

## 티켓팅 노하우

명당을 놓쳤더라도 방법이 있습니다. **K열 중앙 좌측 일부는 홀딩석**으로 운영됩니다. 상영 당일 1시간 전 전후로 풀리는 경우가 많아서, 당일 오전에 CGV 앱을 한 번 더 확인해보는 게 좋습니다. A등급 자리가 당일에 갑자기 뜨는 경우도 종종 있거든요.

<div class="alert alert-info">
<p class="alert-title">💡 예매 팁</p>

예매 오픈 시간 10분 전에 미리 상영 페이지를 열어두고, 원하는 자리 좌표(열·번호)를 머릿속에 외워두면 10초 안에 결제까지 끝낼 수 있습니다.

</div>

---

## 마치며

용아맥은 분명 그 값어치를 하는 상영관입니다. 특히 《오디세이》나 《듄: 파트 3》처럼 IMAX 카메라로 찍은 작품은 여기서 보는 게 사실상 유일한 선택지에 가깝고요. 좌석 지도 북마크 해두고, 다음 예매 전쟁에서 꼭 명당 사수하세요!
