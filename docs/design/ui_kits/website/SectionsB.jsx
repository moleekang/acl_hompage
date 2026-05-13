/* global React */

function Audience() {
  const segs = [
    { pct:'50%', t:'입문자 직장인', d:'ChatGPT 정도만 써봤어요. 첫 시작점이랑 따라할 수 있는 사례가 필요해요.', c:'mint' },
    { pct:'30%', t:'콘텐츠 시도 경험자', d:'블로그/유튜브 시도해봤는데 중단. 자동화 워크플로우가 필요해요.', c:'electric' },
    { pct:'20%', t:'1인 사업가/프리랜서', d:'본업에 AI 적용 중. 깊이 있는 사례가 필요해요.', c:'hot' },
  ];
  return (
    <section className="section" id="audience">
      <div className="container">
        <div className="eyebrow" style={{marginBottom:16}}>누구를 위한</div>
        <h2 className="h-gaegu" style={{fontSize:64,margin:'0 0 12px'}}>
          이 채널은 이런 분들을 위해서.
        </h2>
        <p style={{fontSize:18,color:'var(--fg-2)',marginBottom:48,maxWidth:600}}>
          20대 후반~40대 초반. 직장인 60%, 프리랜서/사업가 30%, 학생 10%. 세 가지 모습이 가장 많아요.
        </p>
        <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:18}}>
          {segs.map((s,i) => (
            <div key={i} className="card-white" style={{position:'relative',overflow:'hidden'}}>
              <div className="h-gaegu" style={{fontSize:64,lineHeight:1,color:'var(--text-'+s.c+')',marginBottom:14}}>{s.pct}</div>
              <h3 style={{fontSize:22,fontWeight:700,margin:'0 0 10px'}}>{s.t}</h3>
              <p style={{fontSize:15,color:'var(--fg-2)',lineHeight:1.65,margin:0}}>"{s.d}"</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function PainPoints() {
  const pains = [
    { n:'01', t:'인사이트의 부재', q:'AI 막 써봤는데 뭘 얻은지 모르겠어요' },
    { n:'02', t:'시작점의 막막함', q:'콘텐츠 만들고 싶은데 시작이 안 돼요' },
    { n:'03', t:'지속의 어려움', q:'혼자라서 자꾸 미루게 돼요' },
  ];
  return (
    <section className="section" style={{background:'var(--surface-2)'}}>
      <div className="container">
        <div className="eyebrow" style={{marginBottom:16,color:'var(--text-hot)'}}>TOP 3 페인 포인트</div>
        <h2 className="h-gaegu" style={{fontSize:64,margin:'0 0 56px',maxWidth:900}}>
          이런 고민, 익숙하시죠?
        </h2>
        <div style={{display:'flex',flexDirection:'column',gap:14}}>
          {pains.map(p => (
            <div key={p.n} className="card-white" style={{display:'flex',alignItems:'center',gap:32,padding:'28px 36px'}}>
              <div className="h-gaegu" style={{fontSize:72,color:'var(--text-hot)',lineHeight:1,minWidth:80}}>{p.n}</div>
              <div style={{flex:1}}>
                <h3 style={{fontSize:24,fontWeight:700,margin:'0 0 8px'}}>{p.t}</h3>
                <p className="hand" style={{fontSize:24,color:'var(--fg-2)',margin:0}}>"{p.q}"</p>
              </div>
              <i data-lucide="message-circle" style={{color:'var(--text-hot)',width:32,height:32,opacity:.5}}></i>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Promise() {
  const items = [
    { k:'WATCH', t:'무엇을 보게 되나요', list:['AICONLAB 자동화 시스템 구축 과정','AI로 1인 기업을 만드는 라이브','실패와 학습 모두'], c:'mint', icon:'eye' },
    { k:'FEEL', t:'무엇을 느끼게 되나요', list:['"이런 라이프스타일이 가능하구나"','"이 사람은 진짜로 만들고 있구나"','"혼자가 아니라 함께 가는 느낌"'], c:'sun', icon:'heart' },
    { k:'GET', t:'무엇을 얻게 되나요', list:['AI 시대 1인 기업 자동화 사고방식','자동화 도구·프레임워크','코어 그룹 합류 기회 (점진적)'], c:'hot', icon:'gift' },
  ];
  return (
    <section className="section">
      <div className="container">
        <div className="eyebrow" style={{marginBottom:16}}>약속</div>
        <h2 className="h-gaegu" style={{fontSize:64,margin:'0 0 56px'}}>
          이 채널을 보면<br/>이걸 가져가실 수 있어요.
        </h2>
        <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:18}}>
          {items.map(it => (
            <div key={it.k} className="card-white" style={{borderTop:'4px solid var(--text-'+it.c+')',paddingTop:24}}>
              <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:14}}>
                <i data-lucide={it.icon} style={{color:'var(--text-'+it.c+')',width:24,height:24}}></i>
                <span className="mono" style={{fontSize:13,fontWeight:700,letterSpacing:'.12em',color:'var(--text-'+it.c+')'}}>{it.k}</span>
              </div>
              <h3 style={{fontSize:20,fontWeight:700,margin:'0 0 18px'}}>{it.t}</h3>
              <ul style={{listStyle:'none',padding:0,margin:0,display:'flex',flexDirection:'column',gap:10}}>
                {it.list.map((l,i) => (<li key={i} style={{fontSize:16,color:'var(--fg-2)',display:'flex',gap:10,lineHeight:1.6}}><span style={{color:'var(--text-'+it.c+')'}}>✓</span>{l}</li>))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Framework() {
  const steps = [
    { n:1, t:'정체성', d:'무엇을 만들고 싶은지부터 정의합니다. 도구가 아니라 정체성이 먼저입니다.', c:'hot' },
    { n:2, t:'결과물', d:'정체성에 맞는 결과물을 직접 만들어봅니다. 작동하는 것이 우선입니다.', c:'electric' },
    { n:3, t:'자동화', d:'반복되는 결과물 제작 과정을 자동화합니다. 자동화는 마지막입니다.', c:'mint' },
  ];
  return (
    <section className="section" id="framework" style={{background:'var(--surface-2)'}}>
      <div className="container">
        <div className="eyebrow" style={{marginBottom:16}}>방법론</div>
        <h2 className="h-gaegu" style={{fontSize:64,margin:'0 0 16px',maxWidth:1000}}>
          정체성 → 결과물 → 자동화.<br/>
          <span style={{color:'var(--text-hot)'}}>이 순서를 절대 바꾸지 않습니다.</span>
        </h2>
        <p style={{fontSize:18,color:'var(--fg-2)',marginBottom:56,maxWidth:760}}>
          도구가 먼저 오면 도구에 끌려갑니다. 결과물이 먼저 오면 노이즈만 만듭니다. 정체성을 먼저 정의해야 무엇을 만들지, 무엇을 자동화할지 압니다.
        </p>
        <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:24,position:'relative'}}>
          {steps.map((s,i) => (
            <div key={s.n} className="card-white" style={{position:'relative',padding:32}}>
              <div style={{position:'absolute',top:-24,left:24,width:48,height:48,borderRadius:999,background:'var(--text-'+s.c+')',color:'#fff',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:700,fontSize:20,border:'3px solid var(--paper)'}}>{s.n}</div>
              <h3 className="h-gaegu" style={{fontSize:48,margin:'14px 0 14px'}}>{s.t}</h3>
              <p style={{fontSize:15,color:'var(--fg-2)',lineHeight:1.65,margin:0}}>{s.d}</p>
              {i<2 && <i data-lucide="arrow-right" style={{position:'absolute',right:-26,top:'50%',transform:'translateY(-50%)',color:'var(--fg-3)',width:20,height:20,zIndex:2}}></i>}
            </div>
          ))}
        </div>
        <div style={{marginTop:48,textAlign:'center',position:'relative',display:'inline-block',width:'100%'}}>
          <div style={{display:'inline-block',position:'relative'}}>
            <div className="card-paper" style={{padding:'24px 36px',transform:'rotate(-1deg)',display:'inline-block'}}>
              <div className="hand" style={{fontSize:30,color:'var(--paper-ink)'}}>정체성에 어긋나는 자동화는 하지 않는다.</div>
              <div className="mono" style={{fontSize:12,color:'var(--fg-3)',marginTop:8,letterSpacing:'.1em'}}>— AICONLAB WAY</div>
            </div>
            <img src="../../assets/sticker-circle.svg" style={{position:'absolute',inset:'-15%',width:'130%',pointerEvents:'none',opacity:.85}}/>
          </div>
        </div>
      </div>
    </section>
  );
}

function AutomationMap() {
  const areas = [
    { n:'01', t:'콘텐츠 기획', s:'강함' },
    { n:'02', t:'스크립트 작성', s:'강함' },
    { n:'03', t:'영상 편집', s:'진행 중' },
    { n:'04', t:'썸네일 생성', s:'진행 중' },
    { n:'05', t:'업로드 자동화', s:'진행 중' },
    { n:'06', t:'댓글 응대', s:'미시작' },
    { n:'07', t:'위키 운영', s:'강함' },
    { n:'08', t:'데이터 분석', s:'진행 중' },
    { n:'09', t:'커뮤니티', s:'미시작' },
    { n:'10', t:'수익 모델', s:'미시작' },
  ];
  const sColor = (s) => s==='강함'?'mint':s==='진행 중'?'sun':'fg';
  return (
    <section className="section">
      <div className="container">
        <div className="eyebrow" style={{marginBottom:16}}>자동화 지도</div>
        <h2 className="h-gaegu" style={{fontSize:64,margin:'0 0 16px'}}>
          지금 어디까지 왔을까요?
        </h2>
        <p style={{fontSize:18,color:'var(--fg-2)',marginBottom:48,maxWidth:700}}>
          숨기지 않습니다. 강한 영역, 진행 중인 영역, 아직 시작도 못 한 영역까지 그대로 보여드려요.
        </p>
        <div style={{display:'grid',gridTemplateColumns:'repeat(5,1fr)',gap:14}}>
          {areas.map(a => {
            const c = sColor(a.s);
            return (
              <div key={a.n} className="card-white" style={{padding:18,display:'flex',flexDirection:'column',gap:8,minHeight:120}}>
                <div className="mono" style={{fontSize:11,color:'var(--fg-3)',fontWeight:700}}>{a.n}</div>
                <div style={{fontSize:15,fontWeight:700,flex:1}}>{a.t}</div>
                <span className={c==='fg'?'pill':'pill pill-'+c} style={{alignSelf:'flex-start',fontSize:11,padding:'3px 10px'}}>{a.s}</span>
              </div>
            );
          })}
        </div>
        <div style={{marginTop:32,display:'flex',gap:24,justifyContent:'center',fontSize:13,color:'var(--fg-3)'}}>
          <span><span className="pill pill-mint" style={{fontSize:11,padding:'2px 8px',marginRight:6}}>강함</span> 4개 영역</span>
          <span><span className="pill pill-sun" style={{fontSize:11,padding:'2px 8px',marginRight:6}}>진행 중</span> 3개 영역</span>
          <span><span className="pill" style={{fontSize:11,padding:'2px 8px',marginRight:6}}>미시작</span> 3개 영역</span>
        </div>
      </div>
    </section>
  );
}

window.Audience = Audience;
window.PainPoints = PainPoints;
window.Promise = Promise;
window.Framework = Framework;
window.AutomationMap = AutomationMap;
