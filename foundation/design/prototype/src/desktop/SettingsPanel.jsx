import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function SettingsPanel() {
  const navigate = useNavigate();

  // 1. 设置状态
  const [preset, setPreset] = useState('standard');
  const [dndActive, setDndActive] = useState(true);
  const [soundActive, setSoundActive] = useState(true);

  // 2. 订阅内购状态
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [showPurchaseSheet, setShowPurchaseSheet] = useState(false);
  const [purchasing, setPurchasing] = useState(false);

  // 模拟订阅购买
  const handlePurchase = () => {
    setPurchasing(true);
    setTimeout(() => {
      setPurchasing(false);
      setIsSubscribed(true);
      setShowPurchaseSheet(false);
      alert('🎉 恭喜！您已成功订阅 nick+！\n现已解锁全部 Platinum+ 高阶宠物与流光动作特效。');
    }, 1800);
  };

  // 模拟取消订阅
  const handleCancelSubscription = () => {
    setIsSubscribed(false);
    alert('已恢复为免费档。高阶宠物动效已被锁定。');
  };

  return (
    <div style={styles.page}>
      {/* 导航 */}
      <div style={styles.navBar}>
        <button style={styles.backBtn} onClick={() => navigate('/desktop/home')}>
          ← 返回控制中心
        </button>
        <div style={styles.navTitle}>⚙️ 设置与内购面板 - /desktop/settings</div>
      </div>

      <div style={styles.wrapper}>
        {/* 左侧：系统参数设置 */}
        <div style={styles.card}>
          <div style={styles.cardHeader}>PREFERENCES (应用偏好设置)</div>
          
          {/* 疲劳档预设 */}
          <div style={styles.section}>
            <label style={styles.sectionLabel}>疲劳追踪预设时长 (Fatigue Preset)</label>
            <div style={styles.presetGroup}>
              <button 
                style={{...styles.presetBtn, ...(preset === 'strict' ? styles.presetBtnActive : {})}}
                onClick={() => setPreset('strict')}
              >
                Strict (30m)
              </button>
              <button 
                style={{...styles.presetBtn, ...(preset === 'standard' ? styles.presetBtnActive : {})}}
                onClick={() => setPreset('standard')}
              >
                Standard (60m)
              </button>
              <button 
                style={{...styles.presetBtn, ...(preset === 'chill' ? styles.presetBtnActive : {})}}
                onClick={() => setPreset('chill')}
              >
                Chill (90m)
              </button>
            </div>
          </div>

          {/* 辅助开关 */}
          <div style={styles.section}>
            <div style={styles.toggleRow}>
              <div>
                <div style={{ fontWeight: 700, fontSize: 13 }}>全屏免打扰 (Smart DND)</div>
                <div style={{ fontSize: 11, color: 'var(--sys-color-text-secondary)', marginTop: 4 }}>
                  检测到屏幕共享或 Keynote 全屏演示时自动延迟提醒。
                </div>
              </div>
              <input 
                type="checkbox" 
                checked={dndActive} 
                onChange={(e) => setDndActive(e.target.checked)}
                style={styles.checkbox}
              />
            </div>
          </div>

          <div style={styles.section}>
            <div style={styles.toggleRow}>
              <div>
                <div style={{ fontWeight: 700, fontSize: 13 }}>轻量跟练音效 (Sound Effects)</div>
                <div style={{ fontSize: 11, color: 'var(--sys-color-text-secondary)', marginTop: 4 }}>
                  动作就位对齐和跟练结束时播放轻柔声效提示。
                </div>
              </div>
              <input 
                type="checkbox" 
                checked={soundActive} 
                onChange={(e) => setSoundActive(e.target.checked)}
                style={styles.checkbox}
              />
            </div>
          </div>
        </div>

        {/* 右侧：订阅权益与购买入口 */}
        <div style={styles.card}>
          <div style={styles.cardHeader}>NICK+ SUBSCRIPTION (会员权益)</div>
          
          <div style={styles.subBox}>
            <div style={styles.crownIcon}>👑</div>
            <h3 style={styles.subTitle}>解锁 nick+ 完整体验</h3>
            <p style={styles.subDesc}>
              免费用户可以畅玩核心循环并把宠物养到 Gold 段位。订阅 nick+ 可解锁更丰富的情绪特权：
            </p>
            
            <ul style={styles.benefitList}>
              <li>✨ 解锁 Platinum / Diamond / Legend 高阶宠物</li>
              <li>🎨 获得高难度独占拉伸领操姿态与爆笑逗趣动效</li>
              <li>💫 领操关节轨迹高亮流光特效 (Glow Trail)</li>
              <li>📊 开启健康数据深度周报与颈椎改善分析</li>
            </ul>

            {!isSubscribed ? (
              <button style={styles.subscribeBtn} onClick={() => setShowPurchaseSheet(true)}>
                订阅 nick+ ($6.99 / 月)
              </button>
            ) : (
              <div style={styles.subscribedArea}>
                <div style={styles.activeStatus}>✓ nick+ 订阅已激活 (Platinum 特权生效中)</div>
                <button style={styles.cancelLink} onClick={handleCancelSubscription}>
                  模拟取消订阅
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 模拟 App Store 弹出内购框 (StoreKit Sheet) */}
      {showPurchaseSheet && (
        <div style={styles.sheetOverlay}>
          <div style={styles.appStoreSheet}>
            <div style={styles.sheetHeader}>
              <div style={styles.appLogo}>🌱</div>
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontWeight: 800, fontSize: 15 }}>nick+ Annual Pass</div>
                <div style={{ fontSize: 11, color: 'var(--sys-color-text-secondary)' }}>Masseuse in your Menu bar</div>
              </div>
              <button style={styles.sheetClose} onClick={() => setShowPurchaseSheet(false)}>✕</button>
            </div>

            <div style={styles.sheetContent}>
              <div style={styles.priceRow}>
                <span style={{ fontSize: 13, fontWeight: 700 }}>价格:</span>
                <span style={{ fontSize: 16, fontWeight: 800, color: 'var(--sys-color-primary)' }}>$39.99 / 年</span>
              </div>
              <div style={styles.priceNotice}>
                包含 7 天免费试用。试用期结束后按年扣款，可随时在 App Store 账户中管理或取消。
              </div>

              <div style={styles.sheetDivider} />

              <div style={styles.termsText}>
                本商品参与 App Store 小型企业计划。支持“家庭共享”。购买即代表您同意服务条款与隐私政策。
              </div>
            </div>

            <button 
              style={styles.confirmPayBtn} 
              onClick={handlePurchase}
              disabled={purchasing}
            >
              {purchasing ? '正在向 Apple 沙盒验证...' : '双击以购买 (Confirm Subscription)'}
            </button>
          </div>
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
    alignItems: 'center'
  },
  navBar: {
    width: '100%',
    maxWidth: '860px',
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
    gridTemplateColumns: '1fr 1fr',
    gap: '24px',
    maxWidth: '860px',
    width: '100%'
  },
  card: {
    background: '#FFFFFF',
    borderRadius: '20px',
    padding: '24px',
    boxShadow: 'var(--shadow-lg)',
    border: '1px solid rgba(47, 42, 51, 0.03)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between'
  },
  cardHeader: {
    fontSize: 11,
    fontWeight: 700,
    color: 'var(--sys-color-text-secondary)',
    marginBottom: '20px',
    letterSpacing: '0.5px'
  },
  section: {
    borderBottom: '1px solid var(--sys-color-surface-border)',
    paddingBottom: '16px',
    marginBottom: '16px'
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: 700,
    color: 'var(--sys-color-text-secondary)',
    marginBottom: '8px',
    display: 'block'
  },
  presetGroup: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr',
    gap: '8px'
  },
  presetBtn: {
    background: 'var(--sys-color-surface)',
    border: '1px solid var(--sys-color-surface-border)',
    padding: '8px',
    borderRadius: '8px',
    fontSize: 11,
    fontWeight: 700,
    cursor: 'pointer',
    color: 'var(--sys-color-text-secondary)',
    transition: 'all 0.15s'
  },
  presetBtnActive: {
    background: 'var(--sys-color-primary)',
    borderColor: 'var(--sys-color-primary)',
    color: '#FFFFFF'
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
  // 订阅区
  subBox: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    padding: '10px 0'
  },
  crownIcon: {
    fontSize: '44px',
    marginBottom: '12px',
    filter: 'drop-shadow(0 4px 10px rgba(255, 201, 72, 0.4))'
  },
  subTitle: {
    fontSize: '18px',
    fontWeight: 800,
    color: 'var(--sys-color-text-primary)',
    marginBottom: '6px'
  },
  subDesc: {
    fontSize: '12px',
    lineHeight: 1.5,
    color: 'var(--sys-color-text-secondary)',
    marginBottom: '16px'
  },
  benefitList: {
    textAlign: 'left',
    fontSize: '12px',
    lineHeight: 1.8,
    color: 'var(--sys-color-text-primary)',
    marginBottom: '24px',
    listStyleType: 'none'
  },
  subscribeBtn: {
    width: '100%',
    background: 'linear-gradient(135deg, #FFD56B 0%, #FFC948 100%)',
    border: 'none',
    color: 'var(--sys-color-text-primary)',
    height: '44px',
    borderRadius: 'var(--radius-lg)',
    fontWeight: 800,
    fontSize: '14px',
    cursor: 'pointer',
    boxShadow: '0 4px 12px rgba(255, 201, 72, 0.3)',
    transition: 'all 0.2s'
  },
  subscribedArea: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '12px'
  },
  activeStatus: {
    width: '100%',
    height: '44px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'var(--ref-color-mint-light, #F2FBF7)',
    border: '1px solid var(--sys-color-success)',
    borderRadius: 'var(--radius-lg)',
    fontSize: '12px',
    fontWeight: 700,
    color: 'var(--sys-color-success)'
  },
  cancelLink: {
    background: 'none',
    border: 'none',
    color: 'var(--sys-color-text-secondary)',
    fontSize: '11px',
    fontWeight: 600,
    textDecoration: 'underline',
    cursor: 'pointer'
  },
  // Apple App Store Sheet
  sheetOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: 'rgba(0,0,0,0.4)',
    zIndex: 999,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backdropFilter: 'blur(4px)'
  },
  appStoreSheet: {
    width: '340px',
    background: '#FFFFFF',
    borderRadius: '16px',
    padding: '20px',
    boxShadow: '0 10px 40px rgba(0,0,0,0.3)',
    border: '1px solid rgba(0,0,0,0.05)',
    display: 'flex',
    flexDirection: 'column',
    animation: 'sheet-pop 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
  },
  sheetHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    position: 'relative',
    marginBottom: '16px'
  },
  appLogo: {
    width: '40px',
    height: '40px',
    background: 'var(--sys-color-primary)',
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '20px'
  },
  sheetClose: {
    position: 'absolute',
    top: '0',
    right: '0',
    background: 'none',
    border: 'none',
    fontSize: '16px',
    color: 'var(--sys-color-text-secondary)',
    cursor: 'pointer'
  },
  sheetContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    textAlign: 'left'
  },
  priceRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTop: '1px solid var(--sys-color-surface-border)',
    borderBottom: '1px solid var(--sys-color-surface-border)',
    padding: '10px 0'
  },
  priceNotice: {
    fontSize: '10px',
    lineHeight: 1.4,
    color: 'var(--sys-color-text-secondary)'
  },
  sheetDivider: {
    height: '1px',
    background: 'var(--sys-color-surface-border)'
  },
  termsText: {
    fontSize: '9px',
    lineHeight: 1.4,
    color: 'var(--sys-color-text-disabled)'
  },
  confirmPayBtn: {
    marginTop: '20px',
    height: '44px',
    background: '#007AFF', // iOS System Blue
    border: 'none',
    borderRadius: '10px',
    color: '#FFFFFF',
    fontWeight: 700,
    fontSize: '13px',
    cursor: 'pointer',
    transition: 'background 0.2s'
  }
};
