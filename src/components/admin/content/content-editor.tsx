'use client';

import { useState } from 'react';
import type { LanguageInfo } from '@/i18n/translations';

import { CompanyForm } from '@/components/admin/content/company-form';
import type { EditableSection } from '@/components/admin/content/section-form';
import { SectionForm } from '@/components/admin/content/section-form';
import { Button } from '@/components/ui/button';

import type { LandingCompanyRow, LandingSectionKey } from '@/types/landing';

type TabId = 'hero' | 'about' | 'services' | 'nav' | 'footer-social' | 'companies';

const TABS: { id: TabId; label: string }[] = [
  { id: 'hero', label: 'Hero' },
  { id: 'about', label: 'About' },
  { id: 'services', label: 'Services' },
  { id: 'nav', label: 'Navigation' },
  { id: 'footer-social', label: 'Footer & Social' },
  { id: 'companies', label: 'Companies' },
];

const SECTION_META: Record<LandingSectionKey, { title: string; description: string }> = {
  nav: { title: 'Navigation', description: 'Company name and menu labels in the top bar' },
  hero: { title: 'Hero', description: 'Headline area at the top of the landing page' },
  about: { title: 'About', description: '"Who Are We?" section text and feature cards' },
  services: { title: 'Services', description: 'Services & ventures section title and cards' },
  footer: { title: 'Footer', description: 'Footer text' },
  social: { title: 'Social', description: 'Labels for the social link buttons' },
};

interface ContentEditorProps {
  sections: EditableSection[];
  companies: LandingCompanyRow[];
  /** All configured site languages (from /admin/languages), incl. disabled ones */
  languages: LanguageInfo[];
}

export function ContentEditor({ sections, companies, languages }: ContentEditorProps) {
  const [activeTab, setActiveTab] = useState<TabId>('hero');

  const sectionByKey = new Map(sections.map((section) => [section.key, section]));

  const renderSection = (key: LandingSectionKey) => {
    const section = sectionByKey.get(key);
    if (!section) return null;
    return <SectionForm section={section} languages={languages} {...SECTION_META[key]} />;
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap gap-2">
        {TABS.map((tab) => (
          <Button
            key={tab.id}
            type="button"
            size="sm"
            variant={activeTab === tab.id ? 'default' : 'outline'}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </Button>
        ))}
      </div>

      {activeTab === 'hero' && renderSection('hero')}
      {activeTab === 'about' && renderSection('about')}
      {activeTab === 'services' && renderSection('services')}
      {activeTab === 'nav' && renderSection('nav')}
      {activeTab === 'footer-social' && (
        <div className="flex flex-col gap-6">
          {renderSection('footer')}
          {renderSection('social')}
        </div>
      )}
      {activeTab === 'companies' && (
        <div className="flex flex-col gap-6">
          {companies.map((company) => (
            <CompanyForm key={company.slug} company={company} languages={languages} />
          ))}
        </div>
      )}
    </div>
  );
}
