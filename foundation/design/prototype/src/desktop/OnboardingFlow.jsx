import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// 导入三只宠物的精灵动作原画
import sproutImg from './pet_sprout.jpg';
import bearImg from './pet_bear.jpg';
import foxImg from './pet_fox.jpg';

export default function OnboardingFlow() {
  const navigate = useNavigate();

  // Onboarding 进度控制 (Step 0, 1, 2)
  const [step, setStep] = useState(0);

  // 用户偏好
  const [petType, setPetType] = useState('sprout');
  const [petName, setPetName] = useState('Minty');
  const [fatiguePreset, setFatiguePreset] = useState('standard'); // 'chill' | 'standard' | 'strict'
  const [demoAlignment, setDemoAlignment] = useState(0); // 首次跟练姿态对齐度

  const petImages = {
    sprout: sproutImg,
    bear: bearImg,
    fox: foxImg
  };

  const handleNext = () => {
    if (step < 2) setStep(prev => prev + 1);
    else {
      alert(`🎉 恭喜完成首次引导！\n${petName} 已成功入驻您的桌面悬浮窗。`);
      navigate('/desktop/pet');
    }
  };

  const handleBack = () => {
    if (step > 0) setStep(prev => prev - 1);
  };

  return (
    <div style={styles.page}>
      <div style={styles.navBar}>
        <button style={styles.backBtn} onClick={() => navigate('/desktop/home')}>
          ✕ 退出引导
        </button>
        <div style={styles.navTitle}>🚀 启动引导 Onboarding - Step {step + 1}/3</div>
      </div>

      <div style={styles.card}>
        {/* Step 1: 选宠物与命名 */}
        {step === 0 && (
          <div style={styles.stepContainer}>
            <h2 style={styles.stepTitle}>Hi! 认识你的桌面健康宠物</h2>
            <p style={styles.stepDesc}>它将住在你的桌面边缘，用它的健康状态提醒你按时休息并带领你做操。</p>

            <div style={styles.tabGroup}>
              <button 
                style={{...styles.tab, ...(petType === 'sprout' ? styles.activeTab : {})}}
                onClick={() => setPetType('sprout')}
              >
                🌱 小草人
              </button>
              <button 
                style={{...styles.tab, ...(petType === 'bear' ? styles.activeTab : {})}}
                onClick={() => setPetType('bear')}
              >
                🐻 萌宠熊
              </button>
              <button 
                style={{...styles.tab, ...(petType === 'fox' ? styles.activeTab : {})}}
                onClick={() => setPetType('fox')}
              >
                🦊 狐兔
              </button>
            </div>

            {/* 宠物预览 */}
            <div style={styles.animBox}>
              <div 
                style={{
                  ...styles.sprite,
                  backgroundImage: `url(${petImages[petType]})`,
                  backgroundPosition: '0px 0px', // IDLE 帧
                  animation: 'anim-bounce 1.5s ease-in-out infinite'
                }}
              />
              <style>{`
                @keyframes anim-bounce {
                  0%, 100% { transform: scale(1) translateY(0); }
                  50% { transform: scale(1.02, 0.98) translateY(3px); }
                }
              `}</style>
            </div>

            {/* 宠物起名 */}
            <div style={styles.inputBox}>
              <label style={styles.inputLabel}>给它取个名字吧：</label>
              <input 
                type="text" 
                value={petName} 
                onChange={(e) => setPetName(e.target.value)} 
                style={styles.inputText}
              />
            </div>
          </div>
        )}

        {/* Step 2: 选疲劳监测档位 */}
        {step === 1 && (
          <div style={styles.stepContainer}>
            <h2 style={styles.stepTitle}>设定你的疲劳监测监测档位</h2>
            <p style={styles.stepDesc}>我们只检测你的键盘与鼠标持续无活动时长，绝不采集你的隐私内容。</p>

            <div style={styles.presetGroup}>
              <div 
                style={{...styles.presetCard, ...(fatiguePreset === 'strict' ? styles.activePreset : {})}}
                onClick={() => setFatiguePreset('strict')}
              >
                <div style={styles.presetTitle}>Strict (严格档)</div>
                <div style={styles.presetDetail}>每连续工作 <strong>30分钟</strong> 触发提醒。适合已有颈椎酸痛的办公族。</div>
              </div>

              <div 
                style={{...styles.presetCard, ...(fatiguePreset === 'standard' ? styles.activePreset : {})}}
                onClick={() => setFatiguePreset('standard')}
              >
                <div style={styles.presetTitle}>Standard (标准档)</div>
                <div style={styles.presetDetail}>每连续工作 <strong>60分钟</strong> 触发提醒。大多数知识工作者的推荐档位。</div>
              </div>

              <div 
                style={{...styles.presetCard, ...(fatiguePreset === 'chill' ? styles.activePreset : {})}}
                onClick={() => setFatiguePreset('chill')}
              >
                <div style={styles.presetTitle}>Chill (轻松档)</div>
                <div style={styles.presetDetail}>每连续工作 <strong>90分钟</strong> 触发提醒。适合偏向沉浸式创作的人群。</div>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: 首次拉伸操对齐练习 */}
        {step === 2 && (
          <div style={styles.stepContainer}>
            <h2 style={styles.stepTitle}>试一试！你的首次跟练姿态对齐</h2>
            <p style={styles.stepDesc}>我们仅在后台提取你的面部角度，不传输任何真实摄像头画面（支持离线）。</p>

            <div style={styles.alignmentStage}>
              {/* 领操宠物 */}
              <div style={styles.miniCoach}>
                <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--sys-color-text-secondary)' }}>教练示范</div>
                <div 
                  style={{
                    ...styles.sprite,
                    backgroundImage: `url(${petImages[petType]})`,
                    backgroundPosition: '-240px 0px', // STRETCH 帧
                    transform: 'scale(0.8)'
                  }}
                />
              </div>

              {/* 模拟的对齐圆环 */}
              <div style={{
                ...styles.miniRing,
                borderColor: demoAlignment >= 90 ? 'var(--sys-color-success)' : 'rgba(47,42,51,0.1)'
              }}>
                <div style={{
                  ...styles.figureDot,
                  transform: `translateX(${(demoAlignment - 50) * 0.5}px)`
                }} />
              </div>
            </div>

            <div style={styles.alignmentSlider}>
              <div style={styles.sliderHeader}>
                <span>拖动滑块模拟扭头，将绿点对准靶心：</span>
                <span style={{ fontWeight: 700 }}>{demoAlignment}%</span>
              </div>
              <input 
                type="range" 
                min="0" 
                max="100" 
                value={demoAlignment}
                onChange={(e) => setDemoAlignment(Number(e.target.value))}
                style={styles.rangeInput}
              />
            </div>
          </div>
        )}

        {/* 底部导航按钮 */}
        <div style={styles.btnRow}>
          {step > 0 ? (
            <button style={styles.secondaryBtn} onClick={handleBack}>上一步</button>
          ) : (
            <div />
          )}
          <button 
            style={{
              ...styles.primaryBtn,
              opacity: step === 2 && demoAlignment < 90 ? 0.5 : 1
            }} 
            onClick={handleNext}
            disabled={step === 2 && demoAlignment < 90}
          >
            {step === 2 ? '完成并让宠物入驻 ➔' : '下一步 ➔'}
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    width: '100%',
    backgroundColor: 'var(--sys-color-background)',
    padding: '24px',
    alignItems: 'center',
    justifyContent: 'center'
  },
  navBar: {
    width: '100%',
    maxWidth: '520px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '16px'
  },
  backBtn: {
    background: 'none',
    border: 'none',
    color: 'var(--sys-color-text-secondary)',
    fontWeight: 700,
    fontSize: 13,
    cursor: 'pointer'
  },
  navTitle: {
    fontSize: 13,
    fontWeight: 700,
    color: 'var(--sys-color-text-primary)'
  },
  card: {
    background: '#FFFFFF',
    borderRadius: '24px',
    width: '520px',
    padding: '32px',
    boxShadow: 'var(--shadow-xl)',
    border: '1px solid rgba(47, 42, 51, 0.03)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    minHeight: '440px'
  },
  stepContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    flexGrow: 1
  },
  stepTitle: {
    fontSize: '18px',
    fontWeight: 800,
    color: 'var(--sys-color-text-primary)',
    textAlign: 'center',
    marginBottom: '8px'
  },
  stepDesc: {
    fontSize: '12px',
    lineHeight: 1.5,
    color: 'var(--sys-color-text-secondary)',
    textAlign: 'center',
    marginBottom: '20px',
    maxWidth: '380px'
  },
  tabGroup: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr',
    gap: '8px',
    background: 'var(--sys-color-surface)',
    padding: '4px',
    borderRadius: '10px',
    width: '100%',
    marginBottom: '20px'
  },
  tab: {
    background: 'none',
    border: 'none',
    padding: '8px 12px',
    borderRadius: '6px',
    fontSize: 11,
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
  animBox: {
    width: '240px',
    height: '140px',
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'center',
    marginBottom: '20px'
  },
  sprite: {
    width: '240px',
    height: '200px',
    backgroundSize: '960px 200px',
    backgroundRepeat: 'no-repeat',
    transformOrigin: 'bottom center'
  },
  inputBox: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  inputLabel: {
    fontSize: 11,
    fontWeight: 700,
    color: 'var(--sys-color-text-secondary)'
  },
  inputText: {
    height: '38px',
    borderRadius: '8px',
    border: '1px solid var(--sys-color-surface-border)',
    padding: '0 12px',
    fontSize: 13,
    color: 'var(--sys-color-text-primary)',
    outline: 'none'
  },
  /* Step 2: 档位选择 */
  presetGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    width: '100%',
    marginBottom: '20px'
  },
  presetCard: {
    background: 'var(--sys-color-surface)',
    border: '1px solid var(--sys-color-surface-border)',
    borderRadius: '12px',
    padding: '12px 16px',
    cursor: 'pointer',
    transition: 'all 0.2s'
  },
  activePreset: {
    background: 'var(--ref-color-mint-light, #F2FBF7)',
    borderColor: 'var(--sys-color-primary)'
  },
  presetTitle: {
    fontSize: '13px',
    fontWeight: 700,
    color: 'var(--sys-color-text-primary)',
    marginBottom: '4px'
  },
  presetDetail: {
    fontSize: '11px',
    lineHeight: 1.4,
    color: 'var(--sys-color-text-secondary)'
  },
  /* Step 3: 对齐练习 */
  alignmentStage: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '30px',
    height: '140px',
    marginBottom: '20px'
  },
  miniCoach: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    height: '100px',
    justifyContent: 'center'
  },
  miniRing: {
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    border: '3px dashed var(--sys-color-surface-border)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative'
  },
  figureDot: {
    width: '12px',
    height: '12px',
    background: 'var(--sys-color-success)',
    borderRadius: '50%',
    boxShadow: '0 0 8px var(--sys-color-success)',
    transition: 'transform 0.15s ease'
  },
  alignmentSlider: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  sliderHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '11px',
    color: 'var(--sys-color-text-secondary)',
    fontWeight: 600
  },
  rangeInput: {
    width: '100%'
  },
  btnRow: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '20px',
    borderTop: '1px solid var(--sys-color-surface-border)',
    paddingTop: '20px'
  },
  primaryBtn: {
    background: 'var(--sys-color-primary)',
    border: 'none',
    color: '#FFFFFF',
    padding: '10px 24px',
    borderRadius: '10px',
    fontSize: 12,
    fontWeight: 700,
    cursor: 'pointer',
    boxShadow: '0 2px 8px rgba(47, 191, 152, 0.25)',
    transition: 'all 0.2s'
  },
  secondaryBtn: {
    background: 'var(--sys-color-surface)',
    border: '1px solid var(--sys-color-surface-border)',
    color: 'var(--sys-color-text-secondary)',
    padding: '10px 24px',
    borderRadius: '10px',
    fontSize: 12,
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.2s'
  }
};
