import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// 导入三只宠物的精灵原画
import sproutImg from './pet_sprout.jpg';
import bearImg from './pet_bear.jpg';
import foxImg from './pet_fox.jpg';

export default function InviteCard() {
  const navigate = useNavigate();

  // 1. 交互状态
  const [activePet, setActivePet] = useState('sprout'); // 'sprout' | 'bear' | 'fox'
  const [delayCount, setDelayCount] = useState(0); // 延迟计数
  const [isIgnored, setIsIgnored] = useState(false); // 模拟忽略卡片
  const [showToast, setShowToast] = useState(false); // 软惩罚提示
  const [toastMsg, setToastMsg] = useState('');

  const petImages = {
    sprout: sproutImg,
    bear: bearImg,
    fox: foxImg
  };

  // 延迟按钮点击
  const handleDelay = () => {
    if (delayCount < 2) {
      const nextCount = delayCount + 1;
      setDelayCount(nextCount);
      triggerToast(`⏰ 已为您延迟 5 分钟运动 (第 ${nextCount}/2 次)`);
    }
  };

  // 忽略/关闭卡片
  const handleIgnore = () => {
    setIsIgnored(true);
    triggerToast('⚠️ 忽略提醒：健康分开始缓慢衰减，宠物进入蔫态');
    setTimeout(() => {
      // 3秒后自动恢复，方便再次测试
      setIsIgnored(false);
      setDelayCount(0);
    }, 4000);
  };

  const triggerToast = (msg) => {
    setToastMsg(msg);
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 3500);
  };

  return (
    <div style={styles.page}>
      {/* 顶部标题与路由导航 */}
      <div style={styles.navBar}>
        <button style={styles.backBtn} onClick={() => navigate('/desktop/home')}>
          ← 返回控制中心
        </button>
        <div style={styles.navTitle}>🔔 提醒邀请卡片原型 - /desktop/invite</div>
      </div>

      {/* 测试多宠物切换器 */}
      <div style={styles.petSelector}>
        <span style={styles.selectorLabel}>测试切换示范宠物：</span>
        <button 
          style={{...styles.selectorTab, ...(activePet === 'sprout' ? styles.activeTab : {})}}
          onClick={() => setActivePet('sprout')}
        >
          🌱 小草人
        </button>
        <button 
          style={{...styles.selectorTab, ...(activePet === 'bear' ? styles.activeTab : {})}}
          onClick={() => setActivePet('bear')}
        >
          🐻 萌宠熊
        </button>
        <button 
          style={{...styles.selectorTab, ...(activePet === 'fox' ? styles.activeTab : {})}}
          onClick={() => setActivePet('fox')}
        >
          🦊 狐兔
        </button>
      </div>

      <div style={styles.wrapper}>
        {/* 卡片未被忽略时渲染 */}
        {!isIgnored ? (
          <div style={styles.inviteCard}>
            {/* 关闭按钮（触发忽略逻辑） */}
            <button style={styles.closeBtn} onClick={handleIgnore}>×</button>

            {/* 顶部的拟人化宠物拉伸动效 (STRETCH) */}
            <div style={styles.animBox}>
              <div 
                style={{
                  ...styles.sprite,
                  backgroundImage: `url(${petImages[activePet]})`,
                  backgroundPosition: '-240px 0px', // 取动作分解原画的第二帧（STRETCH 姿态）
                  animation: 'anim-stretch-loop 2s cubic-bezier(0.25, 0.8, 0.25, 1) infinite alternate'
                }}
              />
              <style>{`
                @keyframes anim-stretch-loop {
                  0% { transform: scale(1) translateY(0); }
                  100% { transform: scale(0.95, 1.08) translateY(-8px); }
                }
              `}</style>
            </div>

            {/* 邀请文本内容 */}
            <div style={styles.cardContent}>
              <h2 style={styles.cardTitle}>Time for a Stretch!</h2>
              <p style={styles.cardText}>
                您的脖子连续工作太久啦。跟 {activePet === 'sprout' ? '小草人' : activePet === 'bear' ? '小熊' : '小狐兔'} 做操舒缓一下吧 (需要 2 分钟)
              </p>
            </div>

            {/* 交互按钮区域 */}
            <div style={styles.btnArea}>
              {/* 主按钮：Let's move */}
              <button style={styles.primaryBtn} onClick={() => navigate('/desktop/workout')}>
                Let's move!
              </button>

              {/* 次要按钮：5more minutes（限 2 次延迟，之后隐藏） */}
              {delayCount < 2 ? (
                <button style={styles.secondaryBtn} onClick={handleDelay}>
                  5 more minutes ({2 - delayCount} left)
                </button>
              ) : (
                <div style={styles.lockNotice}>
                  🔒 已达延迟上限，请开始做操或手动关闭
                </div>
              )}
            </div>
          </div>
        ) : (
          <div style={styles.ignoredState}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>🌱💤</div>
            <div style={{ fontWeight: 600, color: 'var(--sys-color-text-secondary)' }}>
              提醒卡片已收起，宠物蔫蔫地退回桌面角落...
            </div>
          </div>
        )}
      </div>

      {/* 软惩罚/延迟 Toast 提示器 */}
      {showToast && (
        <div style={styles.toast}>
          {toastMsg}
        </div>
      )}
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
    position: 'relative'
  },
  navBar: {
    width: '100%',
    maxWidth: '500px',
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
    fontSize: 14,
    cursor: 'pointer'
  },
  navTitle: {
    fontSize: 14,
    fontWeight: 700,
    color: 'var(--sys-color-text-primary)'
  },
  petSelector: {
    background: '#FFFFFF',
    border: '1px solid var(--sys-color-surface-border)',
    borderRadius: '12px',
    padding: '8px 12px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '40px',
    boxShadow: 'var(--shadow-sm)'
  },
  selectorLabel: {
    fontSize: 12,
    fontWeight: 700,
    color: 'var(--sys-color-text-secondary)'
  },
  selectorTab: {
    background: 'none',
    border: 'none',
    padding: '6px 12px',
    borderRadius: '6px',
    fontSize: 11,
    fontWeight: 700,
    color: 'var(--sys-color-text-secondary)',
    cursor: 'pointer',
    transition: 'all 0.2s'
  },
  activeTab: {
    background: 'var(--sys-color-surface)',
    color: 'var(--sys-color-text-primary)'
  },
  wrapper: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexGrow: 1,
    width: '100%'
  },
  inviteCard: {
    width: '400px',
    background: '#FFFFFF',
    borderRadius: 'var(--radius-xl)',
    boxShadow: 'var(--shadow-xl)',
    border: '1px solid rgba(47, 42, 51, 0.03)',
    padding: '28px',
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    animation: 'slide-up 0.5s cubic-bezier(0.16, 1, 0.3, 1)'
  },
  closeBtn: {
    position: 'absolute',
    top: '16px',
    right: '16px',
    width: '28px',
    height: '28px',
    background: 'var(--sys-color-surface)',
    border: 'none',
    borderRadius: '50%',
    cursor: 'pointer',
    fontSize: '18px',
    color: 'var(--sys-color-text-secondary)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'background 0.2s'
  },
  animBox: {
    width: '240px',
    height: '200px',
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'center',
    marginBottom: '20px',
    borderBottom: '1px solid var(--sys-color-surface-border)',
    paddingBottom: '8px'
  },
  sprite: {
    width: '240px',
    height: '200px',
    backgroundSize: '960px 200px',
    backgroundRepeat: 'no-repeat',
    transformOrigin: 'bottom center'
  },
  cardContent: {
    textAlign: 'center',
    marginBottom: '24px'
  },
  cardTitle: {
    fontSize: '22px',
    fontWeight: 800,
    color: 'var(--sys-color-text-primary)',
    marginBottom: '8px',
    letterSpacing: '-0.5px'
  },
  cardText: {
    fontSize: '13px',
    lineHeight: 1.5,
    color: 'var(--sys-color-text-secondary)'
  },
  btnArea: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px'
  },
  primaryBtn: {
    width: '100%',
    background: 'var(--sys-color-primary)',
    border: 'none',
    color: '#FFFFFF',
    height: '44px',
    borderRadius: 'var(--radius-lg)',
    fontWeight: 700,
    fontSize: '14px',
    cursor: 'pointer',
    boxShadow: '0 4px 12px rgba(47, 191, 152, 0.25)',
    transition: 'all 0.2s'
  },
  secondaryBtn: {
    width: '100%',
    background: 'var(--sys-color-surface)',
    border: '1px solid var(--sys-color-surface-border)',
    color: 'var(--sys-color-text-secondary)',
    height: '38px',
    borderRadius: '10px',
    fontWeight: 600,
    fontSize: '13px',
    cursor: 'pointer',
    transition: 'all 0.2s'
  },
  lockNotice: {
    width: '100%',
    height: '38px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'var(--sys-color-surface)',
    border: '1px dashed var(--sys-color-surface-border)',
    borderRadius: '10px',
    fontSize: '11px',
    fontWeight: 700,
    color: 'var(--sys-color-text-disabled)'
  },
  ignoredState: {
    textAlign: 'center',
    animation: 'fade-in 0.3s forwards'
  },
  toast: {
    position: 'absolute',
    bottom: '40px',
    background: 'var(--sys-color-text-primary)',
    color: '#FFFFFF',
    padding: '12px 24px',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: 700,
    boxShadow: 'var(--shadow-lg)',
    animation: 'toast-pop 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards',
    zIndex: 100
  },
  // Keyframes animations
  '@keyframes slide-up': {
    '0%': { transform: 'translateY(20px)', opacity: 0 },
    '100%': { transform: 'translateY(0)', opacity: 1 }
  },
  '@keyframes toast-pop': {
    '0%': { transform: 'translateY(20px) scale(0.9)', opacity: 0 },
    '100%': { transform: 'translateY(0) scale(1)', opacity: 1 }
  }
};
