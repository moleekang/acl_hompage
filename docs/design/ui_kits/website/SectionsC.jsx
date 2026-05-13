/* global React */

function BuildInPublic() {
  const items = [
    { icon:'file-text', t:'주간 logs/', d:'매주 한 편. What·Why·How·Next 4섹션 표준으로 모든 결정과 시행착오를 공개합니다.' },
    { icon:'book-open', t:'공개 위키', d:'30+ 문서. 회사 정체성, 페르소나, 시스템까지 — 보통 비공개로 두는 것 모두 공개.' },
    { icon:'message-square', t:'댓글 응대', d:'완벽한 답이 아니라 시행착오를 공유. 운영자 육성을 우선합니다.' },
  ];
  return (
    <section className="section" style={{background:'var(--surface-2)'}}>
      <div className="container">
        <div className="eyebrow" style={{marginBottom:16}}>BUILD IN PUBLIC</div>
        <h2 className="h-gaegu" style={{fontSize:64,margin:'0 0 16px',maxWidth:900}}>
          전부 공개합니다.
        </h2>
        <p style={{fontSize:18,color:'var(--fg-2)',marginBottom:56,maxWidth:760}}>
          숨기는 게 더 어렵습니다. 어차피 만들 거 같이 보고, 같이 배우는 게 훨씬 빠르거든요.
        </p>
        <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:18}}>
          {items.map((it,i) => (
            <div key={i} className="card-white" style={{padding:32}}>
              <div style={{width:48,height:48,borderRadius:12,background:'var(--surface-2)',display:'flex',alignItems:'center',justifyContent:'center',marginBottom:18,border:'1px solid var(--border-1)'}}>
                <i data-lucide={it.icon} style={{color:'var(--fg-1)',width:22,height:22}}></i>
              </div>
              <h3 style={{fontSize:22,fontWeight:700,margin:'0 0 10px'}}>{it.t}</h3>
              <p style={{fontSize:15,color:'var(--fg-2)',lineHeight:1.65,margin:0}}>{it.d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Status() {
  const stats = [
    { n:'9,490', l:'유튜브 구독자', s:'@A-ConLab-b1m' },
    { n:'57K', l:'인기 영상 조회', s:'Premium Automation App for Free!' },
    { n:'11~21', l:'분 평균 영상 길이', s:'분(min) 단위' },
    { n:'30+', l:'위키 문서', s:'정체성 + 시스템 + 페르소나 모두 공개' },
  ];
  return (
    <section className="section" id="status">
      <div className="container">
        <div className="eyebrow" style={{marginBottom:16}}>현재 채널 지표</div>
        <h2 className="h-gaegu" style={{fontSize:64,margin:'0 0 56px'}}>
          숫자로 보는 지금.
        </h2>
        <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:16}}>
          {stats.map((s,i) => (
            <div key={i} className="card-white" style={{textAlign:'left',padding:28}}>
              <div className="mono" style={{fontSize:48,fontWeight:700,lineHeight:1,color:'var(--ink-900)',letterSpacing:'-0.02em'}}>{s.n}</div>
              <div style={{fontSize:15,fontWeight:700,marginTop:14}}>{s.l}</div>
              <div style={{fontSize:12,color:'var(--fg-3)',marginTop:4,fontFamily:'var(--font-mono)'}}>{s.s}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Positioning() {
  const rows = [
    ['끝까지 안 가본 사람의 말', '끝까지 가본 사람의 노하우'],
    ['도구 카탈로그', '실제 작동하는 결과물 + 컨텍스트'],
    ['표면 정보 (프롬프트 팁)', '프롬프트 너머의 컨텍스트'],
    ['"돈을 번다"', '"시간을 판다"'],
    ['권위적 / 친목 위주', '캐주얼 + 상호 존중'],
  ];
  return (
    <section className="section" style={{background:'var(--ink-900)',color:'var(--paper)'}}>
      <div className="container">
        <div className="eyebrow" style={{marginBottom:16,color:'var(--mint-400)'}}>시장 포지셔닝</div>
        <h2 className="h-gaegu" style={{fontSize:64,margin:'0 0 56px',color:'var(--paper)'}}>
          시장의 가짜 vs <span style={{color:'var(--mint-400)'}}>AICONLAB의 진짜</span>.
        </h2>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:0,border:'1px solid rgba(255,255,255,0.12)',borderRadius:14,overflow:'hidden'}}>
          <div style={{padding:'18px 24px',background:'rgba(255,255,255,0.03)',borderBottom:'1px solid rgba(255,255,255,0.08)',borderRight:'1px solid rgba(255,255,255,0.08)'}}>
            <div style={{fontSize:13,fontWeight:700,color:'#FF8E72',letterSpacing:'.1em',textTransform:'uppercase',fontFamily:'var(--font-mono)'}}>✕ 시장의 가짜</div>
          </div>
          <div style={{padding:'18px 24px',background:'rgba(124,245,196,0.08)',borderBottom:'1px solid rgba(255,255,255,0.08)'}}>
            <div style={{fontSize:13,fontWeight:700,color:'var(--mint-400)',letterSpacing:'.1em',textTransform:'uppercase',fontFamily:'var(--font-mono)'}}>✓ AICONLAB의 진짜</div>
          </div>
          {rows.map(([a,b],i) => (
            <React.Fragment key={i}>
              <div style={{padding:'24px',borderBottom:i<rows.length-1?'1px solid rgba(255,255,255,0.06)':'none',borderRight:'1px solid rgba(255,255,255,0.08)',color:'rgba(245,241,232,0.6)',fontSize:17,textDecoration:'line-through',textDecorationColor:'rgba(255,107,71,0.5)'}}>{a}</div>
              <div style={{padding:'24px',borderBottom:i<rows.length-1?'1px solid rgba(255,255,255,0.06)':'none',fontSize:17,fontWeight:700}}>{b}</div>
            </React.Fragment>
          ))}
        </div>
      </div>
    </section>
  );
}

function NorthStar() {
  return (
    <section className="section">
      <div className="container" style={{maxWidth:900,textAlign:'center'}}>
        <div className="eyebrow" style={{marginBottom:16,justifyContent:'center'}}>북극성 — 1년 후</div>
        <h2 className="h-gaegu" style={{fontSize:72,margin:'0 0 36px',lineHeight:1.15}}>
          AICONLAB을 본다 =<br/>
          <span className="marker">AI 시대 1인 기업의 컨텍스트</span>를<br/>
          학습한다.
        </h2>
        <div style={{display:'flex',gap:24,alignItems:'center',justifyContent:'center',flexWrap:'wrap',marginTop:48}}>
          <div className="card-paper" style={{padding:'18px 24px',textAlign:'left',transform:'rotate(-2deg)'}}>
            <div className="mono" style={{fontSize:11,color:'var(--fg-3)',marginBottom:6}}>2026.05 NOW</div>
            <div style={{fontSize:18,fontWeight:700}}>운영자 1인 + 시청자</div>
          </div>
          <i data-lucide="arrow-right" style={{color:'var(--text-hot)',width:36,height:36}}></i>
          <div className="card-paper" style={{padding:'18px 24px',textAlign:'left',transform:'rotate(2deg)',background:'var(--mint-400)',border:'2px solid var(--ink-900)',boxShadow:'4px 4px 0 var(--ink-900)'}}>
            <div className="mono" style={{fontSize:11,color:'rgba(0,0,0,.6)',marginBottom:6}}>2027.05 GOAL</div>
            <div style={{fontSize:18,fontWeight:700,color:'var(--ink-900)'}}>운영자 + 코어 + 시청자</div>
            <div style={{fontSize:13,color:'rgba(0,0,0,.7)',marginTop:4}}>3계층 문화로 진화</div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Join() {
  const steps = [
    { n:'01', t:'구독', d:'유튜브 채널을 구독하고 새 영상을 받아봐요.', c:'mint' },
    { n:'02', t:'위키 둘러보기', d:'30+ 문서를 자유롭게 읽어보세요. 비공개 자료 따로 없어요.', c:'electric' },
    { n:'03', t:'댓글로 대화', d:'궁금한 거, 시도해본 거 댓글로 나눠주세요. 같이 배워요.', c:'sun' },
    { n:'04', t:'코어 합류', d:'점진적으로 운영자 + 코어 그룹을 만들어갑니다.', c:'hot' },
  ];
  return (
    <section className="section" id="join" style={{background:'var(--surface-2)'}}>
      <div className="container">
        <div className="eyebrow" style={{marginBottom:16}}>합류 경로</div>
        <h2 className="h-gaegu" style={{fontSize:64,margin:'0 0 56px',maxWidth:900}}>
          이렇게 함께해주세요.
        </h2>
        <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:14}}>
          {steps.map((s,i) => (
            <div key={s.n} style={{position:'relative'}}>
              <div className="card-white" style={{padding:24,height:'100%'}}>
                <div className="mono" style={{fontSize:12,color:'var(--text-'+s.c+')',fontWeight:700,marginBottom:14}}>STEP {s.n}</div>
                <h3 className="h-gaegu" style={{fontSize:36,margin:'0 0 10px'}}>{s.t}</h3>
                <p style={{fontSize:14,color:'var(--fg-2)',lineHeight:1.6,margin:0}}>{s.d}</p>
              </div>
              {i<3 && <div style={{position:'absolute',right:-12,top:'50%',transform:'translateY(-50%)',color:'var(--fg-3)',fontSize:24,zIndex:2}}>→</div>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTAFooter() {
  return (
    <>
      <section className="section" style={{paddingTop:120,paddingBottom:120,position:'relative',overflow:'hidden'}}>
        <div style={{position:'absolute',top:'50%',left:'50%',transform:'translate(-50%,-50%)',width:1000,height:600,background:'radial-gradient(ellipse,var(--mint-glow),transparent 60%)',pointerEvents:'none'}}></div>
        <div className="container" style={{textAlign:'center',position:'relative'}}>
          <h2 className="h-gaegu" style={{fontSize:96,margin:'0 0 24px'}}>
            함께 실험해요.
          </h2>
          <p style={{fontSize:22,color:'var(--fg-2)',marginBottom:40,maxWidth:600,marginLeft:'auto',marginRight:'auto'}}>
            <span className="hand" style={{color:'var(--text-hot)',fontSize:26}}>혼자 하면 미루게 되더라고요</span> — 같이 가요.
          </p>
          <div style={{display:'flex',gap:14,justifyContent:'center',flexWrap:'wrap'}}>
            <a className="btn btn-mint btn-lg" href="https://youtube.com/@A-ConLab-b1m" style={{padding:'18px 36px',fontSize:18}}>유튜브 구독 →</a>
            <a className="btn btn-secondary btn-lg" href="#" style={{padding:'18px 36px',fontSize:18}}>위키 둘러보기</a>
          </div>
        </div>
      </section>
      <footer style={{borderTop:'1px solid var(--border-1)',padding:'48px 0 32px',background:'var(--surface-2)'}}>
        <div className="container" style={{display:'grid',gridTemplateColumns:'2fr 1fr 1fr 1fr',gap:32,alignItems:'flex-start'}}>
          <div>
            <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:14}}>
              <img src="../../assets/logo-mark.svg" style={{height:28}}/>
              <span className="h-gaegu" style={{fontSize:24}}>AICONLAB</span>
            </div>
            <p className="small" style={{maxWidth:340,margin:0}}>AI로 기업 하나를 만들어가는, 진짜의 실험실. 운영자 한 사람이 1인 기업을 통째로 자동화해 가는 라이브 다큐멘터리.</p>
          </div>
          <div>
            <div className="micro" style={{marginBottom:12}}>채널</div>
            <div style={{display:'flex',flexDirection:'column',gap:8}}>
              <a className="small" href="https://youtube.com/@A-ConLab-b1m" style={{background:'none'}}>유튜브</a>
              <a className="small" href="#" style={{background:'none'}}>위키</a>
              <a className="small" href="#" style={{background:'none'}}>주간 logs/</a>
            </div>
          </div>
          <div>
            <div className="micro" style={{marginBottom:12}}>탐색</div>
            <div style={{display:'flex',flexDirection:'column',gap:8}}>
              <a className="small" href="#values" style={{background:'none'}}>5대 가치</a>
              <a className="small" href="#framework" style={{background:'none'}}>방법론</a>
              <a className="small" href="#join" style={{background:'none'}}>합류</a>
            </div>
          </div>
          <div>
            <div className="micro" style={{marginBottom:12}}>문의</div>
            <div className="small" style={{lineHeight:1.7}}>
              YouTube 댓글<br/>
              혹은 위키 토론<br/>
              <span className="hand" style={{color:'var(--text-hot)',fontSize:18}}>편하게 남겨주세요~</span>
            </div>
          </div>
        </div>
        <div className="container" style={{marginTop:48,paddingTop:24,borderTop:'1px solid var(--border-1)',display:'flex',justifyContent:'space-between',fontFamily:'var(--font-mono)',fontSize:11,color:'var(--fg-3)'}}>
          <div>© 2026 AICONLAB. Build in Public.</div>
          <div>v 2.0.0 · 정체성 → 결과물 → 자동화</div>
        </div>
      </footer>
    </>
  );
}

window.BuildInPublic = BuildInPublic;
window.Status = Status;
window.Positioning = Positioning;
window.NorthStar = NorthStar;
window.Join = Join;
window.CTAFooter = CTAFooter;
