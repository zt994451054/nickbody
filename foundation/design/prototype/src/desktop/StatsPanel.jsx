import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function StatsPanel() {
  const navigate = useNavigate();

  // 模拟数据
  const [healthScore, setHealthScore] = useState(480); // 当前分
  const [rankName, setRankName] = useState('GOLD III');
  const [weeklyWorkout, setWeeklyWorkout] = useState([1, 1, 0, 2, 1, 0, 0]); // 周一到周日次数

  // 增加分数值测试
  const addScore = () => {
    setHealthScore(prev => {
      const next = prev + 65;
      if (next >= 1000) {
        alert('🎉 恭喜达成满分健康段位 (Legend)！');
        return 1000;
      }
      // 段位简单映射
      if (next > 700) setRankName('PLATINUM I 🔒');
      else if (next > 400) setRankName('GOLD III');
      else setRankName('SILVER II');
      return next;
    });
  };

  const getRankPercentage = () => {
    return (healthScore / 1000) * 100;
  };

  const weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  return (
    <div style={styles.page}>
      {/* 导航 */}
      <div style={styles.navBar}>
        <button style={styles.backBtn} onClick={() => navigate('/desktop/home')}>
          ← 返回控制中心
        </button>
        <div style={styles.navTitle}>📈 数据统计与养成面板 - /desktop/stats</div>
      </div>

      <div style={styles.wrapper}>
        {/* 左侧：健康分仪表盘 */}
        <div style={styles.card}>
          <div style={styles.cardHeader}>HEALTH INDEX (健康分指数)</div>
          
          <div style={styles.scoreContainer}>
            {/* 环形进度条 */}
            <div style={styles.ringOuter}>
              <div 
                style={{
                  ...styles.ringFiller,
                  transform: `rotate(${getRankPercentage() * 3.6}deg)`
                }}
              />
              <div style={styles.ringInner}>
                <div style={styles.scoreNum}>{healthScore}</div>
                <div style={styles.scoreLabel}>Health Score</div>
              </div>
            </div>

            <div style={styles.rankStatusBox}>
              <div style={{ fontSize: 13, fontWeight: 700 }}>当前段位: {rankName}</div>
              <div style={{ fontSize: 11, color: 'var(--sys-color-text-secondary)', marginTop: 4 }}>
                {healthScore < 700 ? '下一段位：PLATINUM (需要 700 分)' : '您已解锁 PLATINUM 锁定测试态'}
              </div>
            </div>

            <button style={styles.scoreBtn} onClick={addScore}>
              ⚡ 模拟完成运动 (+65 分)
            </button>
          </div>
        </div>

        {/* 右侧：段位路与周数据 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* 段位路线图 */}
          <div style={styles.card}>
            <div style={styles.cardHeader}>RANK ROAD (养成段位路线)</div>
            <div style={styles.road}>
              {/* Bronze */}
              <div style={{...styles.roadNode, ...styles.roadCompleted}}>
                <div style={styles.nodePoint}>✓</div>
                <div style={styles.nodeLabel}>BRONZE</div>
              </div>
              <div style={{...styles.roadLine, background: 'var(--sys-color-success)'}} />

              {/* Gold */}
              <div style={{...styles.roadNode, ...styles.roadCompleted}}>
                <div style={styles.nodePoint}>✓</div>
                <div style={styles.nodeLabel}>GOLD</div>
              </div>
              <div style={{...styles.roadLine, background: healthScore >= 700 ? 'var(--sys-color-success)' : 'var(--sys-color-surface-border)'}} />

              {/* Platinum */}
              <div style={{
                ...styles.roadNode, 
                ...(healthScore >= 700 ? styles.roadCompleted : styles.roadLocked)
              }}>
                <div style={styles.nodePoint}>{healthScore >= 700 ? '✓' : '🔒'}</div>
                <div style={styles.nodeLabel}>PLATINUM</div>
              </div>
            </div>
            
            <div style={styles.premiumAlert}>
              📢 <strong>订阅提示：</strong> PLATINUM 段位及以上专属高阶宠物（如小熊、狐兔等）包含流光领操特效与独占的趣味解压交互。
            </div>
          </div>

          {/* 周视图柱状图 */}
          <div style={styles.card}>
            <div style={styles.cardHeader}>WEEKLY ACTIVITY (本周运动频次)</div>
            <div style={styles.chartContainer}>
              {weeklyWorkout.map((count, index) => (
                <div key={index} style={styles.chartColumn}>
                  <div 
                    style={{
                      ...styles.chartBar,
                      height: count === 0 ? '8px' : count === 1 ? '50px' : '90px',
                      background: count > 0 ? 'var(--sys-color-primary)' : 'var(--sys-color-surface)'
                    }}
                  />
                  <span style={styles.chartLabel}>{weekdays[index]}</span>
                </div>
              ))}
            </div>
          </div>
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
    gridTemplateColumns: '380px 450px',
    gap: '24px',
    maxWidth: '860px',
    width: '100%'
  },
  card: {
    background: '#FFFFFF',
    borderRadius: '20px',
    padding: '24px',
    boxShadow: 'var(--shadow-lg)',
    border: '1px solid rgba(47, 42, 51, 0.03)'
  },
  cardHeader: {
    fontSize: 11,
    fontWeight: 700,
    color: 'var(--sys-color-text-secondary)',
    marginBottom: '20px',
    letterSpacing: '0.5px'
  },
  scoreContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '24px'
  },
  ringOuter: {
    width: '180px',
    height: '180px',
    borderRadius: '50%',
    background: 'var(--sys-color-surface)',
    position: 'relative',
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.05)'
  },
  ringFiller: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: 'conic-gradient(var(--sys-color-primary) 0deg, var(--sys-color-surface) 0deg)',
    transformOrigin: 'center',
    transition: 'transform 0.5s ease'
  },
  ringInner: {
    width: '144px',
    height: '144px',
    borderRadius: '50%',
    background: '#FFFFFF',
    zIndex: 2,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: 'var(--shadow-sm)'
  },
  scoreNum: {
    fontSize: '40px',
    fontWeight: 800,
    color: 'var(--sys-color-text-primary)',
    lineHeight: 1
  },
  scoreLabel: {
    fontSize: '11px',
    color: 'var(--sys-color-text-secondary)',
    marginTop: '6px',
    fontWeight: 600
  },
  rankStatusBox: {
    textAlign: 'center'
  },
  scoreBtn: {
    width: '100%',
    background: 'var(--sys-color-primary)',
    border: 'none',
    color: '#FFFFFF',
    height: '42px',
    borderRadius: '12px',
    fontWeight: 700,
    fontSize: '13px',
    cursor: 'pointer',
    boxShadow: '0 4px 12px rgba(47, 191, 152, 0.2)',
    transition: 'all 0.2s'
  },
  // Rank Road
  road: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '10px 0 20px 0',
    position: 'relative'
  },
  roadNode: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '8px',
    zIndex: 2
  },
  nodePoint: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '12px',
    fontWeight: 800
  },
  roadCompleted: {
    '& .nodePoint': {
      background: 'var(--sys-color-success)',
      color: '#FFFFFF',
      boxShadow: '0 2px 8px rgba(47, 191, 152, 0.3)'
    }
  },
  roadLocked: {
    '& .nodePoint': {
      background: 'var(--sys-color-surface)',
      border: '2px dashed var(--sys-color-text-disabled)',
      color: 'var(--sys-color-text-disabled)'
    }
  },
  nodeLabel: {
    fontSize: '10px',
    fontWeight: 800,
    color: 'var(--sys-color-text-primary)'
  },
  roadLine: {
    height: '4px',
    flexGrow: 1,
    margin: '0 -10px',
    position: 'relative',
    top: '-12px',
    zIndex: 1
  },
  premiumAlert: {
    background: 'var(--sys-color-background)',
    borderRadius: '12px',
    padding: '12px',
    fontSize: '11px',
    lineHeight: 1.5,
    color: 'var(--sys-color-text-secondary)',
    borderLeft: '4px solid var(--sys-color-warning)',
    marginTop: '10px'
  },
  // Weekly Chart
  chartContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: '120px',
    padding: '10px 0'
  },
  chartColumn: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '8px',
    width: '36px'
  },
  chartBar: {
    width: '18px',
    borderRadius: '99px',
    transition: 'height 0.3s ease'
  },
  chartLabel: {
    fontSize: '10px',
    fontWeight: 600,
    color: 'var(--sys-color-text-secondary)'
  }
};
// 简单的 React 内联样式不支持伪类嵌套，我们需要在客户端组件渲染时动态适配背景色
styles.roadCompleted.background = 'var(--sys-color-success)';
styles.roadCompleted.color = '#FFFFFF';
styles.roadCompleted.boxShadow = '0 2px 8px rgba(47, 191, 152, 0.3)';

styles.roadLocked.background = 'var(--sys-color-surface)';
styles.roadLocked.border = '2px dashed var(--sys-color-text-disabled)';
styles.roadLocked.color = 'var(--sys-color-text-disabled)';
