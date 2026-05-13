/* global React */
const { useState } = React;

function Nav() {
  return (
    <nav style={{position:'sticky',top:0,zIndex:50,backdropFilter:'blur(16px) saturate(140%)',background:'rgba(245,241,232,0.78)',borderBottom:'1px solid var(--border-1)'}}>
      <div className="container" style={{display:'flex',alignItems:'center',justifyContent:'space-between',height:72}}>
        <a href="#" style={{display:'flex',alignItems:'center',gap:10,background:'none'}}>
          <img src="../../assets/logo-mark.svg" style={{height:32}}/>
          <span className="h-gaegu" style={{fontSize:26}}>AICONLAB</span>
        </a>
        <div style={{display:'flex',gap:32,alignItems:'center'}}>
          <a href="#values" style={{fontSize:15,color:'var(--fg-2)'}}>가치</a>
          <a href="#audience" style={{fontSize:15,color:'var(--fg-2)'}}>누구를 위한</a>
          <a href="#framework" style={{fontSize:15,color:'var(--fg-2)'}}>방법론</a>
          <a href="#status" style={{fontSize:15,color:'var(--fg-2)'}}>현황</a>
          <a className="btn btn-mint" style={{padding:'10px 18px',fontSize:14}} href="https://youtube.com/@A-ConLab-b1m">유튜브 →</a>
        </div>
      </div>
    </nav>
  );
}

function Hero() {
  return (
    <section className="section" style={{paddingTop:96,paddingBottom:120,position:'relative',overflow:'hidden'}}>
      <div style={{position:'absolute',top:-100,right:-100,width:600,height:600,background:'radial-gradient(circle,var(--mint-glow),transparent 60%)',pointerEvents:'none'}}></div>
      <div className="container" style={{position:'relative',display:'grid',gridTemplateColumns:'1.15fr 0.85fr',gap:64,alignItems:'center'}}>
        <div>
          <div className="eyebrow" style={{marginBottom:24}}>AI 1인 기업 라이브 다큐멘터리</div>
          <h1 className="h-gaegu" style={{fontSize:96,margin:'0 0 28px'}}>
            AI로 기업 하나를<br/>
            만들어가는,<br/>
            <span className="marker">진짜의</span> 실험실.
          </h1>
          <p style={{fontSize:20,lineHeight:1.7,color:'var(--fg-2)',maxWidth:560,margin:'0 0 36px'}}>
            프롬프트 너머의 컨텍스트로, 1인 기업을 통째로 자동화해 가는<br/>
            <span className="hand" style={{color:'var(--text-hot)',fontSize:24}}>한 사람의 과정을 통째로 나눕니다.</span>
          </p>
          <div style={{display:'flex',gap:14}}>
            <a className="btn btn-primary btn-lg" href="https://youtube.com/@A-ConLab-b1m">유튜브 구독 →</a>
            <a className="btn btn-secondary btn-lg" href="#values">먼저 둘러보기</a>
          </div>
        </div>
        <div style={{position:'relative'}}>
          <div className="card-paper tape" style={{transform:'rotate(-2deg)',padding:18,paddingTop:22}}>
            <div style={{aspectRatio:'16/9',background:'#0E1116',borderRadius:4,display:'flex',alignItems:'center',justifyContent:'center',position:'relative',overflow:'hidden'}}>
              <div style={{position:'absolute',inset:0,background:'linear-gradient(135deg,#1a2a40 0%,#0E1116 100%)'}}></div>
              <div style={{position:'absolute',top:14,left:14,padding:'4px 10px',background:'#FF6B47',color:'#fff',fontSize:11,fontWeight:700,letterSpacing:'.06em',borderRadius:3}}>● 인기</div>
              <div style={{width:64,height:64,borderRadius:999,background:'var(--mint-400)',display:'flex',alignItems:'center',justifyContent:'center',position:'relative',zIndex:2}}>
                <i data-lucide="play" style={{color:'var(--ink-900)',width:28,height:28}}></i>
              </div>
              <div style={{position:'absolute',bottom:12,right:12,padding:'4px 8px',background:'rgba(0,0,0,.7)',borderRadius:3,fontSize:11,color:'#fff',fontFamily:'var(--font-mono)'}}>15:42</div>
            </div>
            <div style={{marginTop:14,fontSize:16,fontWeight:700,color:'var(--paper-ink)'}}>Premium Automation App for Free!</div>
            <div style={{fontSize:13,color:'var(--fg-2)',marginTop:6,fontFamily:'var(--font-mono)'}}>57K · @A-ConLab-b1m · 9,490 구독</div>
          </div>
          <img src="../../assets/sticker-callout.svg" style={{position:'absolute',top:-30,right:-20,width:130}}/>
        </div>
      </div>
    </section>
  );
}

function Marquee() {
  const items = ['정체성', '결과물', '자동화', '시간 자유', 'Build in Public', '1인 기업', '컨텍스트', '실험실', 'AI Native', '운영자 + 코어'];
  return (
    <section style={{padding:'28px 0',borderTop:'1px solid var(--border-1)',borderBottom:'1px solid var(--border-1)',background:'var(--surface-2)',overflow:'hidden'}}>
      <div style={{display:'flex',gap:48,animation:'marquee 50s linear infinite',whiteSpace:'nowrap'}}>
        {[...items, ...items, ...items].map((t,i) => (
          <span key={i} className="h-gaegu" style={{fontSize:32,color:i%3===0?'var(--text-hot)':'var(--fg-2)'}}>★ {t}</span>
        ))}
      </div>
      <style>{`@keyframes marquee{from{transform:translateX(0)}to{transform:translateX(-33.33%)}}`}</style>
    </section>
  );
}

function Essence() {
  return (
    <section className="section" id="essence">
      <div className="container">
        <div className="eyebrow" style={{marginBottom:16}}>본질</div>
        <h2 className="h-gaegu" style={{fontSize:64,margin:'0 0 56px',maxWidth:900}}>
          저희는 도구가 아니라<br/><span className="underline-hand">문화를 팝니다.</span>
        </h2>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:32}}>
          <div className="card-white">
            <div className="micro" style={{marginBottom:14,color:'var(--text-hot)'}}>SURFACE — 사람들이 보는 것</div>
            <ul style={{listStyle:'none',padding:0,margin:0,fontSize:18,lineHeight:2}}>
              <li>· AI 자동화 영상 콘텐츠</li>
              <li>· n8n / ChatGPT 워크플로우</li>
              <li>· 실패와 학습의 logs/</li>
              <li>· 30+ 문서의 공개 위키</li>
            </ul>
          </div>
          <div className="card-white" style={{background:'var(--ink-900)',color:'var(--paper)',borderColor:'var(--ink-900)'}}>
            <div className="micro" style={{marginBottom:14,color:'var(--mint-400)'}}>ESSENCE — 우리가 진짜 파는 것</div>
            <ul style={{listStyle:'none',padding:0,margin:0,fontSize:18,lineHeight:2,color:'rgba(245,241,232,0.85)'}}>
              <li>· "이런 라이프스타일이 가능하구나"</li>
              <li>· "혼자가 아니라 함께 가는 느낌"</li>
              <li>· AI 시대 1인 기업의 컨텍스트</li>
              <li>· 시간을 돌려받는 사고방식</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

function Values() {
  const values = [
    { n:'01', t:'기여 우선', s:'1을 주고, N을 받는다', d:'무료 자료·도구·노하우를 먼저 내놓습니다. 받는 것은 그 다음 일입니다.', c:'mint' },
    { n:'02', t:'솔직한 공유', s:'노하우를 숨기지 않는다', d:'성공만 자랑하지 않습니다. 실패담·시행착오까지 같이 공개합니다.', c:'sun' },
    { n:'03', t:'상호 존중', s:'개인이 존중받을 때 진짜 공유', d:'권위적·무시 톤은 절대 쓰지 않습니다. 친구처럼 이야기합니다.', c:'electric' },
    { n:'04', t:'실행력', s:'말이 아닌 결과로 증명', d:'카피보다 결과물·증거·돌아가는 스크린이 무겁다고 생각합니다.', c:'hot' },
    { n:'05', t:'시간 자유', s:'시간을 돌려준다', d:'모든 의사결정의 북극성. "돈을 번다"가 아니라 "시간을 판다".', c:'mint' },
  ];
  return (
    <section className="section" id="values" style={{background:'var(--surface-2)'}}>
      <div className="container">
        <div className="eyebrow" style={{marginBottom:16}}>5대 핵심 가치</div>
        <h2 className="h-gaegu" style={{fontSize:64,margin:'0 0 56px'}}>
          이 다섯 가지는<br/>흔들리지 않습니다.
        </h2>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(260px,1fr))',gap:18}}>
          {values.map(v => (
            <div key={v.n} className="card-white">
              <div style={{display:'flex',alignItems:'baseline',gap:10,marginBottom:10}}>
                <span className="mono" style={{fontSize:13,color:'var(--text-'+v.c+')',fontWeight:700}}>{v.n}</span>
                <span className={'pill pill-'+v.c} style={{fontSize:11}}>가치</span>
              </div>
              <h3 className="h-gaegu" style={{fontSize:36,margin:'0 0 4px'}}>{v.t}</h3>
              <div style={{fontSize:14,color:'var(--fg-3)',marginBottom:14,fontStyle:'italic'}}>"{v.s}"</div>
              <p style={{fontSize:15,color:'var(--fg-2)',lineHeight:1.65,margin:0}}>{v.d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Definition() {
  return (
    <section className="section">
      <div className="container" style={{maxWidth:900}}>
        <div className="eyebrow" style={{marginBottom:16,textAlign:'center',justifyContent:'center',display:'flex'}}>핵심 정의</div>
        <div className="card-paper" style={{padding:'56px 48px',transform:'rotate(-0.5deg)',position:'relative'}}>
          <div style={{fontSize:64,lineHeight:.5,color:'var(--text-hot)',marginBottom:24}}>"</div>
          <p className="h-gaegu" style={{fontSize:42,lineHeight:1.35,margin:'0 0 24px'}}>
            프롬프트 너머의 컨텍스트로,<br/>
            1인 기업을 통째로 자동화해 가는<br/>
            한 사람의 과정을 통째로 나누며<br/>
            시청자와 함께 쌓아가는 <span className="marker">AI 실험실</span>.
          </p>
          <div className="mono" style={{fontSize:13,color:'var(--fg-3)'}}>— AICONLAB의 정체성, 2026</div>
          <img src="../../assets/sticker-arrow.svg" style={{position:'absolute',bottom:-30,right:-20,width:90,transform:'rotate(-15deg)'}}/>
        </div>
      </div>
    </section>
  );
}

window.Nav = Nav;
window.Hero = Hero;
window.Marquee = Marquee;
window.Essence = Essence;
window.Values = Values;
window.Definition = Definition;
