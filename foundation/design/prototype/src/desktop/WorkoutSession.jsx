import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// 导入精灵图
import sproutImg from './pet_sprout.jpg';
import bearImg from './pet_bear.jpg';
import foxImg from './pet_fox.jpg';

export default function WorkoutSession() {
  const navigate = useNavigate();

  // 1. 状态管理
  const [activePet, setActivePet] = useState('sprout');
  const [currentActionIdx, setCurrentActionIdx] = useState(0); // 6动作索引 (0-5)
  const [userAlignment, setUserAlignment] = useState(0); // 模拟用户到位度 0 到 100
  const [isHolding, setIsHolding] = useState(false); // 是否处于保持加分态
  const [holdProgress, setHoldProgress] = useState(0); // 3秒保持进度
  const [completedActions, setCompletedActions] = useState([]); // 已完成动作
  const [workoutScore, setWorkoutScore] = useState(0); // 累计分数

  const petImages = { sprout: sproutImg, bear: bearImg, fox: foxImg };

  const actions = [
    { name: '1. 左侧颈拉伸 (Left Neck Stretch)', tip: '头向左侧倾斜，耳朵尽量贴近左肩，保持顺畅呼吸' },
    { name: '2. 右侧颈拉伸 (Right Neck Stretch)', tip: '头向右侧倾斜，耳朵尽量贴近右肩，保持肌肉拉伸' },
    { name: '3. 向左转头 (Turn Neck Left)', tip: '头缓慢向左转 60 度，下巴保持水平，感受右颈侧拉伸' },
    { name: '4. 向右转头 (Turn Neck Right)', tip: '头缓慢向右转 60 度，感受左侧颈的延展' },
    { name: '5. 低头收颌 (Chin Tuck)', tip: '微微收紧下巴，头向下低，视线看向锁骨处' },
    { name: '6. 仰头拉伸 (Neck Extension)', tip: '头缓慢向后仰，拉伸颈部前侧肌肉，嘴唇轻合' }
  ];

  // 模拟对齐靶心的逻辑
  useEffect(() => {
    if (userAlignment >= 90) {
      setIsHolding(true);
    } else {
      setIsHolding(false);
      setHoldProgress(0);
    }
  }, [userAlignment]);

  // 保持就位 3 秒倒计时
  useEffect(() => {
    let interval;
    if (isHolding) {
      interval = setInterval(() => {
        setHoldProgress(prev => {
          if (prev >= 100) {
            // 该动作做完：累加动作积分，自动跳转下一动作
            clearInterval(interval);
            finishCurrentAction();
            return 0;
          }
          return prev + 10;
        });
      }, 150);
    }
    return () => clearInterval(interval);
  }, [isHolding, currentActionIdx]);

  const finishCurrentAction = () => {
    // 累计动作完成
    setCompletedActions(prev => [...prev, currentActionIdx]);
    setWorkoutScore(prev => prev + 15); // 每个动作15分
    setUserAlignment(0);
    setIsHolding(false);

    if (currentActionIdx < 5) {
      setCurrentActionIdx(prev => prev + 1);
    } else {
      // 6个做完，结算并弹框
      alert(`🎉 恭喜完成今日颈椎微运动！\n累计得分: 90/100 (健康分 +12)`);
      navigate('/desktop/home');
    }
  };

  return (
    <div style={styles.page}>
      {/* 顶部隐私盾 - 架构级安全指示器 */}
      <div style={styles.privacyShield}>
        <span style={{ fontSize: 14 }}>🔒</span>
        LOCAL INFERENCE — CAMERA STREAM NEVER LEAVES YOUR MAC
      </div>

      {/* 原型导航栏 */}
      <div style={styles.navBar}>
        <button style={styles.backBtn} onClick={() => navigate('/desktop/home')}>
          ✕ 退出跟练 (Esc)
        </button>
        <div style={styles.navTitle}>🧘 运动跟练面板 - /desktop/workout</div>
      </div>

      <div style={styles.wrapper}>
        {/* 左侧：教练面板 (Coach Panel) */}
        <div style={styles.panelCard}>
          <div style={styles.panelHeader}>
            <span style={styles.badge}>COACH (动作示范)</span>
            <span style={styles.petName}>{activePet === 'sprout' ? '🌱 小草人' : activePet === 'bear' ? '🐻 小熊' : '🦊 狐兔'}</span>
          </div>

          {/* 正在做操的宠物演示 (STRETCH 状态) */}
          <div style={styles.visualStage}>
            <div 
              style={{
                ...styles.sprite,
                backgroundImage: `url(${petImages[activePet]})`,
                backgroundPosition: '-240px 0px', // 精灵图第二帧 (STRETCH)
                animation: 'anim-coach-move 1.5s ease-in-out infinite alternate'
              }}
            />
            {/* 订阅专享流光线粒子效果 */}
            <div style={styles.flowingTrail} />
            <style>{`
              @keyframes anim-coach-move {
                0% { transform: scale(1) translateY(0); }
                100% { transform: scale(0.97, 1.05) translateY(-5px); }
              }
            `}</style>
          </div>

          {/* 实时动作说明 */}
          <div style={styles.actionDetail}>
            <h3 style={styles.actionName}>{actions[currentActionIdx].name}</h3>
            <p style={styles.actionTip}>{actions[currentActionIdx].tip}</p>
          </div>
        </div>

        {/* 右侧：用户影子面板 (User Shadow Panel) */}
        <div style={{...styles.panelCard, ...styles.shadowPanel}}>
          <div style={styles.panelHeader}>
            <span style={{...styles.badge, background: '#27A583'}}>USER SHADOW (影子镜像)</span>
            <span style={{...styles.petName, color: 'rgba(255,255,255,0.5)'}}>Camera Sandbox</span>
          </div>

          {/* 黑色影子的舞台 */}
          <div style={styles.visualStage}>
            {/* 靶心对齐圆环 */}
            <div style={{
              ...styles.alignmentRing,
              borderColor: isHolding ? 'var(--sys-color-success)' : 'rgba(255,255,255,0.2)',
              boxShadow: isHolding ? '0 0 15px var(--sys-color-success)' : 'none',
              transform: `translate(-50%, -50%) scale(${1.5 - (userAlignment / 200)})`
            }}>
              {isHolding && <div style={styles.holdText}>HOLDING ({10 - Math.floor(holdProgress / 10)})</div>}
            </div>

            {/* 绿色姿态影子人 (火柴人骨骼演示，永无真实视频画面) */}
            <div style={{
              ...styles.stickFigure,
              // 根据滑块拉伸度，改变关节倾斜
              transform: `rotate(${userAlignment * 0.3}deg)`
            }}>
              <div style={styles.headJoint} />
              <div style={styles.neckBone} />
              <div style={styles.shoulderLeft} />
              <div style={styles.shoulderRight} />
            </div>
          </div>

          {/* 测试控制器：仿真真实摄像头捕获的到位情况 */}
          <div style={styles.simulatorCard}>
            <div style={styles.sliderHeader}>
              <span>模拟姿态到位度 (Vision Yaw/Pitch)</span>
              <span style={{ fontWeight: 700, color: 'var(--sys-color-success)' }}>{userAlignment}%</span>
            </div>
            <input 
              type="range"
              min="0"
              max="100"
              value={userAlignment}
              onChange={(e) => setUserAlignment(Number(e.target.value))}
              style={styles.rangeInput}
            />
            <div style={styles.noticeText}>
              拖动滑块至 90% 以上代表您的姿态与左侧教练一致。保持 3 秒即可完成本动作。
            </div>
          </div>
        </div>
      </div>

      {/* 进度显示条 */}
      <div style={styles.progressBarBox}>
        {actions.map((act, index) => (
          <div 
            key={index}
            style={{
              ...styles.progressStep,
              background: index === currentActionIdx 
                ? 'var(--sys-color-primary)' 
                : completedActions.includes(index) 
                  ? 'var(--sys-color-success)' 
                  : 'var(--sys-color-surface-border)'
            }}
          />
        ))}
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
    justifyContent: 'space-between'
  },
  privacyShield: {
    width: '100%',
    maxWidth: '960px',
    backgroundColor: '#FAF6EF',
    border: '1px solid var(--sys-color-success)',
    borderRadius: '12px',
    padding: '10px 16px',
    fontSize: '11px',
    fontWeight: 700,
    color: 'var(--sys-color-success)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    boxShadow: '0 4px 10px rgba(47, 191, 152, 0.05)'
  },
  navBar: {
    width: '100%',
    maxWidth: '960px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    margin: '12px 0 20px 0'
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
    gridTemplateColumns: '1fr 1fr',
    gap: '24px',
    maxWidth: '960px',
    width: '100%',
    flexGrow: 1
  },
  panelCard: {
    background: '#FFFFFF',
    borderRadius: 'var(--radius-xl)',
    border: '1px solid rgba(47, 42, 51, 0.03)',
    boxShadow: 'var(--shadow-lg)',
    padding: '24px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    position: 'relative'
  },
  shadowPanel: {
    background: '#2F2A33', // 隐私红线深黑色底
    border: 'none'
  },
  panelHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  badge: {
    background: 'var(--sys-color-primary)',
    color: '#FFFFFF',
    padding: '3px 8px',
    borderRadius: '6px',
    fontSize: 10,
    fontWeight: 700
  },
  petName: {
    fontSize: 12,
    fontWeight: 700,
    color: 'var(--sys-color-text-primary)'
  },
  visualStage: {
    height: '280px',
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'center',
    position: 'relative',
    margin: '20px 0'
  },
  sprite: {
    width: '240px',
    height: '200px',
    backgroundSize: '960px 200px',
    backgroundRepeat: 'no-repeat',
    transformOrigin: 'bottom center'
  },
  flowingTrail: {
    position: 'absolute',
    bottom: '40px',
    width: '120px',
    height: '60px',
    background: 'radial-gradient(ellipse, rgba(47, 191, 152, 0.15) 0%, transparent 70%)',
    borderRadius: '50%',
    pointerEvents: 'none'
  },
  // 影子姿态对齐
  alignmentRing: {
    position: 'absolute',
    top: '40%',
    left: '50%',
    width: '120px',
    height: '120px',
    border: '3px dashed rgba(255, 255, 255, 0.2)',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.15s ease'
  },
  holdText: {
    color: 'var(--sys-color-success)',
    fontSize: '11px',
    fontWeight: 800,
    letterSpacing: '1px'
  },
  stickFigure: {
    position: 'relative',
    width: '100px',
    height: '140px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    transformOrigin: 'bottom center',
    transition: 'transform 0.1s ease',
    bottom: '30px'
  },
  headJoint: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    border: '3px solid var(--sys-color-success)',
    background: 'none'
  },
  neckBone: {
    width: '4px',
    height: '35px',
    background: 'var(--sys-color-success)'
  },
  shoulderLeft: {
    position: 'absolute',
    top: '45px',
    left: '20px',
    width: '30px',
    height: '4px',
    background: 'var(--sys-color-success)',
    transform: 'rotate(-10deg)',
    transformOrigin: 'right center'
  },
  shoulderRight: {
    position: 'absolute',
    top: '45px',
    right: '20px',
    width: '30px',
    height: '4px',
    background: 'var(--sys-color-success)',
    transform: 'rotate(10deg)',
    transformOrigin: 'left center'
  },
  actionDetail: {
    background: 'var(--sys-color-background)',
    padding: '16px',
    borderRadius: 'var(--radius-lg)',
    borderLeft: '4px solid var(--sys-color-primary)'
  },
  actionName: {
    fontSize: '15px',
    fontWeight: 700,
    color: 'var(--sys-color-text-primary)',
    marginBottom: '6px'
  },
  actionTip: {
    fontSize: '12px',
    lineHeight: 1.5,
    color: 'var(--sys-color-text-secondary)'
  },
  simulatorCard: {
    background: 'rgba(255, 255, 255, 0.05)',
    borderRadius: '16px',
    padding: '16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  sliderHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '11px',
    color: 'rgba(255, 255, 255, 0.7)',
    fontWeight: 600
  },
  rangeInput: {
    width: '100%',
    cursor: 'pointer'
  },
  noticeText: {
    fontSize: '10px',
    lineHeight: 1.4,
    color: 'rgba(255, 255, 255, 0.4)'
  },
  progressBarBox: {
    display: 'flex',
    gap: '12px',
    width: '100%',
    maxWidth: '960px',
    marginTop: '20px'
  },
  progressStep: {
    flexGrow: 1,
    height: '6px',
    borderRadius: '99px',
    transition: 'background 0.3s'
  }
};
