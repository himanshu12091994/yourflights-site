// ─────────────────────────────────────────────────────────────
// Compliance Notification Top Banner
// Highlights non-licenseing consulting advisory scope under MCC 8999/8999.
// ─────────────────────────────────────────────────────────────
import React from 'react';
import { Info } from 'lucide-react';
import { translations } from '../../translations';

interface ComplianceBannerProps {
  t: typeof translations['en'];
}

export const ComplianceBanner: React.FC<ComplianceBannerProps> = ({ t }) => {
  return (
    <div className="bg-amber-50 border-b border-amber-200 py-3 px-4">
      <div className="max-w-7xl mx-auto flex items-start sm:items-center space-x-3">
        <Info className="h-5 w-5 text-amber-600 shrink-0 mt-0.5 sm:mt-0" />
        <p className="text-sm text-amber-800 font-medium">
          <strong>{t.banner.important}</strong> {t.banner.text}
        </p>
      </div>
    </div>
  );
};
