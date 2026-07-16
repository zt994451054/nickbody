import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

// 导入拷贝好的三组宠物精灵动作原画
import sproutImg from './pet_sprout.jpg';
import bearImg from './pet_bear.jpg';
import foxImg from './pet_fox.jpg';

export default function PetWidget() {
  const navigate = useNavigate();

  // 1. 核心状态控制
  const [activePet, setActivePet] = useState('sprout'); // 'sprout' | 'bear' | 'fox'
  const [currentState, setCurrentState] = useState('idle'); // 'idle' | 'stretch' | 'yawn' | 'celebrate'
  const [fatigueLevel, setFatigueLevel] = useState(0); // 0 到 100
  const [trailActive, setTrailActive] = useState(true); // 动作轨迹流光

  // 2. 挠痒痒判定变量
  const [tickleScore, setTickleScore] = useState(0);
  const [isTickling, setIsTickling] = useState(false);
  const lastXRef = useRef(0);
  const tickleTimeoutRef = useRef(null);

  // 3. 拖拽拉伸变量
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartY, setDragStartY] = useState(0);
  const [stretchScale, setStretchScale] = useState(1);
  const [translateY, setTranslateY] = useState(0);

  // 4. 领操轨迹粒子
  const [particles, setParticles] = useState([]);
  const stageRef = useRef(null);

  // 宠物原画资源映射
  const petImages = {
    sprout: sproutImg,
    bear: bearImg,
    fox: foxImg
  };

  // 根据当前宠物和状态，得出精灵图的背景偏移
  // 原画横向是 4 张图等宽并排展示，每帧宽度 240px，高 200px
  const getSpritePosition = () => {
    const frameWidth = 240;
    const states = {
      idle: 0,
      stretch: -frameWidth,
      yawn: -frameWidth * 2,
      celebrate: -frameWidth * 3
    };
    return `${states[currentState] || 0}px 0px`;
  };

  // 疲劳值改变时，驱动状态机触发打哈欠
  useEffect(() => {
    if (fatigueLevel >= 70 && currentState !== 'yawn') {
      setCurrentState('yawn');
    } else if (fatigueLevel < 70 && currentState === 'yawn') {
      setCurrentState('idle');
    }
  }, [fatigueLevel]);

  // 自动模拟挠痒痒数值衰减
  useEffect(() => {
    if (tickleScore > 0 && !isTickling) {
      const interval = setInterval(() => {
        setTickleScore(prev => {
          const next = prev - 8;
          return next < 0 ? 0 : next;
        });
      }, 100);
      return () => clearInterval(interval);
    }
  }, [tickleScore, isTickling]);

  // 鼠标在交互板上划过触发挠痒痒判定
  const handleTickleMouseMove = (e) => {
    setIsTickling(true);
    const currentX = e.clientX;
    const delta = Math.abs(currentX - lastXRef.current);

    if (delta > 5) {
      setTickleScore(prev => {
        const next = prev + 3;
        if (next >= 100) {
          // 挠爽了：触发庆祝跳舞动画
          setCurrentState('celebrate');
          return 0;
        }
        return next;
      });

      // 挠痒痒中：在 Idle 下触发微幅摇晃
      if (currentState === 'idle') {
        setCurrentState('idle');
      }
    }
    lastXRef.current = currentX;

    clearTimeout(tickleTimeoutRef.current);
    tickleTimeoutRef.current = setTimeout(() => {
      setIsTickling(false);
    }, 150);
  };

  // 鼠标拖拽拉伸开始
  const handleDragStart = (e) => {
    setIsDragging(true);
    setDragStartY(e.clientY);
  };

  // 鼠标拖拽进行中
  const handleDragMove = (e) => {
    if (!isDragging) return;
    const deltaY = dragStartY - e.clientY; // 往上拉是正位移

    if (deltaY > 0) {
      // 弹性拉长限制：最大拉伸比 1.45，带对数减速阻尼
      const limit = 150;
      const stretchAmount = Math.min(deltaY, limit);
      const scale = 1 + (stretchAmount / limit) * 0.45;
      const squash = 1 - (stretchAmount / limit) * 0.12;

      setStretchScale(scale);
      setTranslateY(-deltaY * 0.18);
    }
  };

  // 鼠标松开回弹
  const handleDragEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);
    // 缓动回弹由 inline style transition 控制
  };

  // 模拟领操划过粒子流光
  const handleStageMouseMove = (e) => {
    if (!trailActive || !stageRef.current) return;
    if (Math.random() > 0.4) {
      const rect = stageRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const newParticle = {
        id: Date.now() + Math.random(),
        x,
        y
      };
      setParticles(prev => [...prev.slice(-15), newParticle]); // 保留最后15个粒子
    }
  };

  return (
    <div style={styles.page}>
      {/* 顶部标题与路由导航 */}
      <div style={styles.navBar}>
        <button style={styles.backBtn} onClick={() => navigate('/desktop/home')}>
          ← 返回控制中心
        </button>
        <div style={styles.navTitle}>🌱 nick 桌面端原型 - /desktop/pet</div>
      </div>

      <div style={styles.wrapper}>
        {/* 左侧：物理模拟器容器 */}
        <div 
          ref={stageRef}
          style={{
            ...styles.stage,
            boxShadow: isDragging ? 'inset 0 -40px 60px rgba(47, 191, 152, 0.15), 0 20px 60px rgba(47,42,51,0.08)' : styles.stage.boxShadow
          }}
          onMouseMove={handleStageMouseMove}
          onMouseUp={handleDragEnd}
        >
          {/* 隐私状态标签 */}
          <div style={styles.privacyBadge}>
            <span style={{ fontSize: 13 }}>🔒</span>
            LOCAL INFERENCE — VIDEO NEVER LEAVES MAC
          </div>

          {/* 模拟的桌面悬浮透明窗 */}
          <div style={styles.floatingPanel}>
            <div style={styles.panelHeader}>
              <span style={styles.fatiguePill}>⏱️ Continuous: {fatigueLevel}m</span>
              <span style={styles.rankChip}>🌱 GOLD V</span>
            </div>

            {/* 宠物拉伸交互容器 */}
            <div 
              style={styles.petBox}
              onMouseDown={handleDragStart}
              onMouseMove={handleDragMove}
              onMouseLeave={handleDragEnd}
            >
              {/* 精灵图渲染层 */}
              <div 
                style={{
                  ...styles.sprite,
                  backgroundImage: `url(${petImages[activePet]})`,
                  backgroundPosition: getSpritePosition(),
                  transform: isDragging 
                    ? `scale(${2 - stretchScale}, ${stretchScale}) translateY(${translateY}px)`
                    : 'scale(1) translateY(0)',
                  transition: isDragging ? 'none' : 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
                  animation: !isDragging ? `anim-${currentState} 2.5s ease-in-out infinite` : 'none'
                }}
              />
              
              {/* 呼吸、伸展、打哈欠、跳舞庆祝的 CSS 样式注入 */}
              <style>{`
                @keyframes anim-idle {
                  0%, 100% { transform: scale(1) translateY(0); }
                  50% { transform: scale(1.02, 0.98) translateY(2px); }
                }
                @keyframes anim-stretch {
                  0%, 100% { transform: scale(1) translateY(0); }
                  50% { transform: scale(0.96, 1.08) translateY(-6px); }
                }
                @keyframes anim-yawn {
                  0%, 100% { transform: rotate(0deg) scale(1); }
                  30% { transform: rotate(-3deg) scale(0.97); }
                  70% { transform: rotate(3deg) scale(1.02); }
                }
                @keyframes anim-celebrate {
                  0%, 100% { transform: translateY(0) scale(1) rotate(0); }
                  50% { transform: translateY(-30px) scale(1.04) rotate(6deg); }
                }
              `}</style>
            </div>

            {/* 桌面边缘停靠锚线 */}
            <div style={styles.shelf} />
          </div>

          {/* 渲染领操轨迹流光粒子 */}
          {particles.map(p => (
            <div 
              key={p.id} 
              style={{
                ...styles.particle,
                left: p.x - 4,
                top: p.y - 4
              }}
            />
          ))}
        </div>

        {/* 右侧：高保真 Stitch 控制面板 */}
        <div style={styles.console}>
          {/* 形象切换 */}
          <div style={styles.card}>
            <div style={styles.cardHeader}>MASCOT SELECTION (角色切换)</div>
            <div style={styles.tabGroup}>
              <button 
                style={{...styles.tab, ...(activePet === 'sprout' ? styles.activeTab : {})}}
                onClick={() => setActivePet('sprout')}
              >
                🌱 小草人
              </button>
              <button 
                style={{...styles.tab, ...(activePet === 'bear' ? styles.activeTab : {})}}
                onClick={() => setActivePet('bear')}
              >
                🐻 萌宠熊
              </button>
              <button 
                style={{...styles.tab, ...(activePet === 'fox' ? styles.activeTab : {})}}
                onClick={() => setActivePet('fox')}
              >
                🦊 狐兔
              </button>
            </div>
          </div>

          {/* 动作状态机输入 */}
          <div style={styles.card}>
            <div style={styles.cardHeader}>
              RIVE STATE MACHINE INPUTS (动效输入)
              <span style={styles.badge}>{currentState}</span>
            </div>
            <div style={styles.btnGrid}>
              <button 
                style={{...styles.btn, ...(currentState === 'idle' ? styles.btnActive : {})}}
                onClick={() => setCurrentState('idle')}
              >
                Idle (待机)
              </button>
              <button 
                style={{...styles.btn, ...(currentState === 'stretch' ? styles.btnActive : {})}}
                onClick={() => setCurrentState('stretch')}
              >
                Stretch (伸展)
              </button>
              <button 
                style={{...styles.btn, ...(currentState === 'yawn' ? styles.btnActive : {})}}
                onClick={() => setCurrentState('yawn')}
              >
                Yawn (打哈欠)
              </button>
              <button 
                style={{...styles.btn, ...(currentState === 'celebrate' ? styles.btnActive : {})}}
                onClick={() => setCurrentState('celebrate')}
              >
                Celebrate (庆祝)
              </button>
            </div>
          </div>

          {/* 疲劳值改变控制 */}
          <div style={styles.card}>
            <div style={styles.cardHeader}>
              FATIGUE SIMULATOR (模拟设备工作时长)
            </div>
            <div style={styles.sliderBox}>
              <div style={styles.sliderInfo}>
                <span>fatigue_level</span>
                <span style={{ fontWeight: 700, color: 'var(--sys-color-primary)' }}>{fatigueLevel}%</span>
              </div>
              <input 
                type="range" 
                min="0" 
                max="100" 
                value={fatigueLevel}
                onChange={(e) => setFatigueLevel(Number(e.target.value))}
                style={styles.rangeInput}
              />
            </div>
            <div style={styles.stateNotice}>
              当数值达到 70% 时，宠物状态机将自动跳转至打哈欠（Yawn）动作，进入犯困待机状态。
            </div>
          </div>

          {/* 挠痒痒互动板 */}
          <div style={styles.card}>
            <div style={styles.cardHeader}>TICKLE DETECTOR (挠痒痒测试)</div>
            <div 
              style={styles.ticklePad}
              onMouseMove={handleTickleMouseMove}
            >
              <span style={styles.tickleText}>在这块板里高频移动鼠标！</span>
              <div style={{...styles.tickleProgress, width: `${tickleScore}%`}} />
            </div>
          </div>

          {/* 高阶动效开关 */}
          <div style={styles.card}>
            <div style={styles.toggleRow}>
              <span style={{ fontWeight: 600, fontSize: 13 }}>Platinum+ 动效流光线轨迹 (Glow Trail)</span>
              <input 
                type="checkbox" 
                checked={trailActive} 
                onChange={(e) => setTrailActive(e.target.checked)}
                style={styles.checkbox}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Stitch 风格的内联样式表
const styles = {
  page: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    width: '100%',
    backgroundColor: 'var(--sys-color-background)',
    padding: '24px',
    alignItems: 'center'
  },
  navBar: {
    width: '100%',
    maxWidth: '900px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '24px'
  },
  backBtn: {
    background: 'none',
    border: 'none',
    color: 'var(--sys-color-text-secondary)',
    fontWeight: 700,
    fontSize: 14,
    cursor: 'pointer'
  },
  navTitle: {
    fontSize: 14,
    fontWeight: 700,
    color: 'var(--sys-color-text-primary)'
  },
  wrapper: {
    display: 'grid',
    gridTemplateColumns: '450px 380px',
    gap: '24px',
    maxWidth: '900px',
    width: '100%'
  },
  stage: {
    background: '#FFFFFF',
    borderRadius: 'var(--radius-xl)',
    border: '1px solid rgba(47, 42, 51, 0.03)',
    boxShadow: 'var(--shadow-xl)',
    height: '480px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '28px',
    position: 'relative',
    overflow: 'hidden'
  },
  privacyBadge: {
    background: 'var(--sys-color-background)',
    border: '1px solid var(--sys-color-surface-border)',
    borderRadius: 'var(--radius-full)',
    padding: '8px 16px',
    fontSize: 10,
    fontWeight: 700,
    color: 'var(--sys-color-success)',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    zIndex: 10
  },
  floatingPanel: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: '280px',
    position: 'relative',
    width: '100%',
    zIndex: 5
  },
  panelHeader: {
    display: 'flex',
    gap: '8px'
  },
  fatiguePill: {
    background: 'rgba(47, 42, 51, 0.04)',
    padding: '5px 10px',
    borderRadius: 'var(--radius-full)',
    fontSize: 10,
    fontWeight: 700,
    color: 'var(--sys-color-text-secondary)'
  },
  rankChip: {
    background: 'var(--sys-color-warning)',
    padding: '5px 10px',
    borderRadius: 'var(--radius-full)',
    fontSize: 10,
    fontWeight: 800,
    color: 'var(--sys-color-text-primary)',
    boxShadow: '0 2px 8px rgba(255, 201, 72, 0.3)'
  },
  petBox: {
    width: '240px',
    height: '200px',
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'center',
    cursor: 'grab'
  },
  sprite: {
    width: '240px',
    height: '200px',
    backgroundSize: '960px 200px',
    backgroundRepeat: 'no-repeat',
    transformOrigin: 'bottom center'
  },
  shelf: {
    width: '100%',
    height: '4px',
    background: 'var(--sys-color-surface-border)',
    borderRadius: 'var(--radius-full)'
  },
  console: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  },
  card: {
    background: '#FFFFFF',
    border: '1px solid rgba(47, 42, 51, 0.02)',
    borderRadius: '20px',
    padding: '20px',
    boxShadow: 'var(--shadow-sm)'
  },
  cardHeader: {
    fontSize: 11,
    fontWeight: 700,
    color: 'var(--sys-color-text-secondary)',
    marginBottom: '12px',
    letterSpacing: '0.5px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  badge: {
    background: 'var(--sys-color-primary-hover)',
    color: '#FFFFFF',
    padding: '2px 8px',
    borderRadius: 'var(--radius-full)',
    fontSize: 9,
    fontWeight: 700,
    textTransform: 'uppercase'
  },
  tabGroup: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr',
    gap: '8px',
    background: 'var(--sys-color-surface)',
    padding: '4px',
    borderRadius: '12px'
  },
  tab: {
    background: 'none',
    border: 'none',
    padding: '8px 12px',
    borderRadius: '8px',
    fontSize: 12,
    fontWeight: 700,
    color: 'var(--sys-color-text-secondary)',
    cursor: 'pointer',
    transition: 'all 0.2s'
  },
  activeTab: {
    background: '#FFFFFF',
    color: 'var(--sys-color-text-primary)',
    boxShadow: 'var(--shadow-sm)'
  },
  btnGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '8px'
  },
  btn: {
    background: 'var(--sys-color-surface)',
    border: '1px solid var(--sys-color-surface-border)',
    color: 'var(--sys-color-text-primary)',
    padding: '10px',
    borderRadius: '10px',
    fontSize: 12,
    fontWeight: 700,
    cursor: 'pointer',
    transition: 'all 0.15s'
  },
  btnActive: {
    background: 'var(--sys-color-primary)',
    borderColor: 'var(--sys-color-primary)',
    color: '#FFFFFF'
  },
  sliderBox: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  sliderInfo: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: 11,
    fontWeight: 600,
    color: 'var(--sys-color-text-secondary)'
  },
  rangeInput: {
    width: '100%',
    cursor: 'pointer'
  },
  stateNotice: {
    fontSize: 10,
    color: 'var(--sys-color-text-secondary)',
    marginTop: '8px',
    background: 'var(--sys-color-background)',
    padding: '8px',
    borderRadius: '6px',
    borderLeft: '2px solid var(--sys-color-primary)'
  },
  ticklePad: {
    height: '60px',
    background: 'var(--sys-color-background)',
    border: '2px dashed var(--sys-color-surface-border)',
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
    cursor: 'pointer'
  },
  tickleText: {
    fontSize: 11,
    fontWeight: 600,
    color: 'var(--sys-color-text-secondary)',
    zIndex: 2,
    pointerEvents: 'none'
  },
  tickleProgress: {
    position: 'absolute',
    left: 0,
    bottom: 0,
    height: '4px',
    backgroundColor: 'var(--sys-color-accent)',
    transition: 'width 0.1s ease',
    zIndex: 1
  },
  toggleRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  checkbox: {
    width: '16px',
    height: '16px',
    cursor: 'pointer'
  },
  particle: {
    position: 'absolute',
    width: '6px',
    height: '6px',
    background: 'var(--sys-color-primary)',
    borderRadius: '50%',
    pointerEvents: 'none',
    boxShadow: '0 0 6px var(--sys-color-primary)',
    animation: 'fade-out 0.8s forwards'
  }
};
