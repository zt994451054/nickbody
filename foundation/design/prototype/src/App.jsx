import { Navigate, Route, Routes } from 'react-router-dom';
import Portal from './pages/Portal';
import WebHome from './web/WebHome';
import MobileHome from './mobile/MobileHome';
import DesktopHome from './desktop/DesktopHome';
import PetWidget from './desktop/PetWidget';
import InviteCard from './desktop/InviteCard';
import WorkoutSession from './desktop/WorkoutSession';
import StatsPanel from './desktop/StatsPanel';
import OnboardingFlow from './desktop/OnboardingFlow';
import SettingsPanel from './desktop/SettingsPanel';

function NotFound() {
  return (
    <div style={{ padding: 48, fontFamily: "-apple-system, 'PingFang SC', sans-serif" }}>
      404 · 页面不存在
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      {/* 终端选择入口 */}
      <Route path="/" element={<Portal />} />

      {/* PC Web 终端 */}
      <Route path="/web" element={<Navigate to="/web/home" replace />} />
      <Route path="/web/home" element={<WebHome />} />

      {/* 移动端 */}
      <Route path="/mobile" element={<Navigate to="/mobile/home" replace />} />
      <Route path="/mobile/home" element={<MobileHome />} />

      {/* 桌面端 */}
      <Route path="/desktop" element={<Navigate to="/desktop/home" replace />} />
      <Route path="/desktop/home" element={<DesktopHome />} />
      <Route path="/desktop/pet" element={<PetWidget />} />
      <Route path="/desktop/invite" element={<InviteCard />} />
      <Route path="/desktop/workout" element={<WorkoutSession />} />
      <Route path="/desktop/stats" element={<StatsPanel />} />
      <Route path="/desktop/onboarding" element={<OnboardingFlow />} />
      <Route path="/desktop/settings" element={<SettingsPanel />} />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
