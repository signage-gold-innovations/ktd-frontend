'use client';

import { useState, useTransition } from 'react';
import { translations, type LanguageInfo } from '@/i18n/translations';
import { toast } from 'react-toastify';

import { ImageField } from '@/components/admin/content/image-field';
import { LanguageTabs } from '@/components/admin/content/language-tabs';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { saveSection } from '@/app/admin/(protected)/content/actions';

import type { LandingSectionKey } from '@/types/landing';

/** One landing section with fully-prefilled values (DB merged over static defaults) */
export interface EditableSection {
  key: LandingSectionKey;
  /** Per-language field values, keyed by language code then field key */
  content: Record<string, Record<string, string>>;
  images: Record<string, string>;
}

export type SaveStatus = { type: 'success' | 'error'; message: string } | null;

/** Editable images per section — keys of landing_sections.images JSONB */
const SECTION_IMAGE_FIELDS: Partial<Record<LandingSectionKey, { key: string; label: string }[]>> = {
  hero: [{ key: 'background', label: 'Background image' }],
  services: [
    { key: 'card1', label: 'Card 1 image' },
    { key: 'card2', label: 'Card 2 image' },
    { key: 'card3', label: 'Card 3 image' },
  ],
};

/** Long-form fields get a Textarea instead of an Input */
function isLongText(key: string): boolean {
  return /^p\d+$/.test(key) || key.endsWith('Desc') || key.toLowerCase().includes('description');
}

function formatFieldLabel(key: string): string {
  if (/^p\d+$/.test(key)) return `Paragraph ${key.slice(1)}`;
  return key
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/([a-zA-Z])(\d)/g, '$1 $2')
    .replace(/\b(ceo|cta)\b/gi, (match) => match.toUpperCase())
    .replace(/^./, (char) => char.toUpperCase());
}

interface SectionFormProps {
  section: EditableSection;
  title: string;
  description: string;
  /** All configured site languages (from /admin/languages), incl. disabled ones */
  languages: LanguageInfo[];
}

export function SectionForm({ section, title, description, languages }: SectionFormProps) {
  const [content, setContent] = useState(section.content);
  const [images, setImages] = useState(section.images);
  const [activeLang, setActiveLang] = useState(languages[0]?.code ?? 'en');
  const [isPending, startTransition] = useTransition();

  // Canonical field list comes from the static translations, so newly added
  // static fields appear in the editor automatically.
  const fieldKeys = Object.keys(translations.en[section.key]);
  const imageFields = SECTION_IMAGE_FIELDS[section.key] ?? [];

  const setField = (key: string, value: string) => {
    setContent((prev) => ({
      ...prev,
      [activeLang]: { ...prev[activeLang], [key]: value },
    }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    startTransition(async () => {
      const result = await saveSection({
        key: section.key,
        content,
        images: imageFields.length > 0 ? images : undefined,
      });
      if (result.ok) {
        toast.success('Saved. All languages of this section are updated.');
      } else {
        toast.error(result.error);
      }
    });
  };

  return (
    <Card>
      <form onSubmit={handleSubmit}>
        <CardHeader className="border-b">
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>

        <CardContent className="flex flex-col gap-6 py-6">
          {imageFields.length > 0 && (
            <div className="grid gap-6 lg:grid-cols-2">
              {imageFields.map((field) => (
                <ImageField
                  key={field.key}
                  label={field.label}
                  value={images[field.key] ?? ''}
                  onChange={(url) => setImages((prev) => ({ ...prev, [field.key]: url }))}
                />
              ))}
            </div>
          )}

          <div className="flex flex-col gap-5">
            <LanguageTabs
              languages={languages}
              active={activeLang}
              onChange={setActiveLang}
              idPrefix={`section-${section.key}`}
            />

            {fieldKeys.map((key) => {
              const FieldComponent = isLongText(key) ? Textarea : Input;
              return (
                <div key={key} className="flex flex-col gap-1.5">
                  <Label htmlFor={`${section.key}-${key}-${activeLang}`}>
                    {formatFieldLabel(key)}
                  </Label>
                  <FieldComponent
                    id={`${section.key}-${key}-${activeLang}`}
                    value={content[activeLang]?.[key] ?? ''}
                    onChange={(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
                      setField(key, event.target.value)
                    }
                  />
                </div>
              );
            })}
          </div>
        </CardContent>

        <CardFooter className="flex items-center gap-3 border-t">
          <Button type="submit" disabled={isPending}>
            {isPending ? 'Saving…' : 'Save changes'}
          </Button>
          <p className="text-muted-foreground text-xs">
            Saving stores every language, not just the open tab.
          </p>
        </CardFooter>
      </form>
    </Card>
  );
}
