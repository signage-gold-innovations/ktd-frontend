'use client';

import { useState, useTransition } from 'react';
import type { LanguageInfo } from '@/i18n/translations';

import { ImageField } from '@/components/admin/content/image-field';
import { LanguageTabs } from '@/components/admin/content/language-tabs';
import type { SaveStatus } from '@/components/admin/content/section-form';
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
import { saveCompany } from '@/app/admin/(protected)/content/actions';

import type { CompanySocialLinks, LandingCompanyRow } from '@/types/landing';

const SOCIAL_FIELDS: { key: keyof CompanySocialLinks; label: string }[] = [
  { key: 'website', label: 'Website URL' },
  { key: 'facebook', label: 'Facebook URL' },
  { key: 'instagram', label: 'Instagram URL' },
];

interface CompanyFormProps {
  company: LandingCompanyRow;
  /** All configured site languages (from /admin/languages), incl. disabled ones */
  languages: LanguageInfo[];
}

export function CompanyForm({ company, languages }: CompanyFormProps) {
  const [name, setName] = useState(company.name);
  const [description, setDescription] = useState(company.description);
  const [bgColor, setBgColor] = useState(company.bg_color);
  const [bottomImage, setBottomImage] = useState(company.bottom_image ?? '');
  const [socialLinks, setSocialLinks] = useState<CompanySocialLinks>(company.social_links);
  const [images, setImages] = useState(company.images);
  const [activeLang, setActiveLang] = useState(languages[0]?.code ?? 'en');
  const [status, setStatus] = useState<SaveStatus>(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus(null);
    startTransition(async () => {
      const result = await saveCompany({
        slug: company.slug as 'hiterratech' | 'silachai' | 'kitthana',
        name,
        description,
        bg_color: bgColor,
        bottom_image: bottomImage || null,
        social_links: socialLinks,
        images,
        sort_order: company.sort_order,
      });
      setStatus(
        result.ok
          ? { type: 'success', message: 'Saved. All languages of this company are updated.' }
          : { type: 'error', message: result.error }
      );
    });
  };

  return (
    <Card>
      <form onSubmit={handleSubmit}>
        <CardHeader className="border-b">
          <CardTitle>{company.name.en || company.slug}</CardTitle>
          <CardDescription>Section content for {company.slug}</CardDescription>
        </CardHeader>

        <CardContent className="flex flex-col gap-6 py-6">
          {/* Translated text — one sub-tab per language */}
          <div className="flex flex-col gap-5">
            <LanguageTabs
              languages={languages}
              active={activeLang}
              onChange={setActiveLang}
              idPrefix={`company-${company.slug}`}
            />

            <div className="flex flex-col gap-1.5">
              <Label htmlFor={`${company.slug}-name-${activeLang}`}>Name</Label>
              <Input
                id={`${company.slug}-name-${activeLang}`}
                value={name[activeLang] ?? ''}
                onChange={(event) =>
                  setName((prev) => ({ ...prev, [activeLang]: event.target.value }))
                }
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor={`${company.slug}-desc-${activeLang}`}>Description</Label>
              <Textarea
                id={`${company.slug}-desc-${activeLang}`}
                rows={5}
                value={description[activeLang] ?? ''}
                onChange={(event) =>
                  setDescription((prev) => ({ ...prev, [activeLang]: event.target.value }))
                }
              />
            </div>
          </div>

          {/* Shared settings — the same in every language */}
          <div className="border-border flex flex-col gap-6 border-t pt-6">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor={`${company.slug}-bg-color`}>Background color</Label>
              <Input
                id={`${company.slug}-bg-color`}
                value={bgColor}
                onChange={(event) => setBgColor(event.target.value)}
                placeholder="#000000 or a CSS gradient"
              />
              <p className="text-muted-foreground text-xs">
                Any CSS color or gradient, e.g. linear-gradient(360deg, #010214 0%, #39005D 100%)
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              {SOCIAL_FIELDS.map((field) => (
                <div key={field.key} className="flex flex-col gap-1.5">
                  <Label htmlFor={`${company.slug}-${field.key}`}>{field.label}</Label>
                  <Input
                    id={`${company.slug}-${field.key}`}
                    value={socialLinks[field.key] ?? ''}
                    onChange={(event) =>
                      setSocialLinks((prev) => ({ ...prev, [field.key]: event.target.value }))
                    }
                  />
                </div>
              ))}
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              {images.map((image, index) => (
                <ImageField
                  key={index}
                  label={`Gallery image ${index + 1}`}
                  value={image}
                  onChange={(url) =>
                    setImages((prev) => prev.map((current, i) => (i === index ? url : current)))
                  }
                />
              ))}
            </div>

            <ImageField
              label="Bottom decorative image (optional)"
              value={bottomImage}
              onChange={setBottomImage}
            />
          </div>
        </CardContent>

        <CardFooter className="flex items-center gap-3 border-t">
          <Button type="submit" disabled={isPending}>
            {isPending ? 'Saving…' : 'Save changes'}
          </Button>
          <p className="text-muted-foreground text-xs">
            Saving stores every language, not just the open tab.
          </p>
          {status && (
            <p
              className={
                status.type === 'success' ? 'text-sm text-emerald-600' : 'text-destructive text-sm'
              }
            >
              {status.message}
            </p>
          )}
        </CardFooter>
      </form>
    </Card>
  );
}
