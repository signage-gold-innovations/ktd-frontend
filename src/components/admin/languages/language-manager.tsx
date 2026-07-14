'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { DEFAULT_LANGUAGE, type LanguageInfo } from '@/i18n/translations';
import { ArrowDownIcon } from '@solar-icons/react/linear/arrow-down';
import { ArrowUpIcon } from '@solar-icons/react/linear/arrow-up';
import { TrashBinTrashIcon } from '@solar-icons/react/linear/trash-bin-trash';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  deleteLanguage,
  reorderLanguages,
  saveLanguage,
} from '@/app/admin/(protected)/languages/actions';

type Status = { type: 'success' | 'error'; message: string } | null;

const EMPTY_FORM = { code: '', label: '', name: '', native_name: '' };

export function LanguageManager({ languages }: { languages: LanguageInfo[] }) {
  const router = useRouter();
  const [form, setForm] = useState(EMPTY_FORM);
  const [status, setStatus] = useState<Status>(null);
  const [isPending, startTransition] = useTransition();

  const run = (fn: () => Promise<{ ok: boolean; error?: string }>, success: string) => {
    setStatus(null);
    startTransition(async () => {
      const result = await fn();
      if (result.ok) {
        setStatus({ type: 'success', message: success });
        router.refresh();
      } else {
        setStatus({ type: 'error', message: result.error ?? 'Something went wrong.' });
      }
    });
  };

  const handleAdd = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const code = form.code.trim().toLowerCase();
    if (languages.some((lang) => lang.code === code)) {
      setStatus({ type: 'error', message: `"${code}" is already configured.` });
      return;
    }
    run(
      () =>
        saveLanguage({
          code,
          label: form.label.trim() || code.toUpperCase(),
          name: form.name.trim(),
          native_name: form.native_name.trim() || form.name.trim(),
          enabled: true,
          sort_order: languages.length,
        }),
      'Language added. It now has a tab in the content editor.'
    );
    setForm(EMPTY_FORM);
  };

  const handleToggle = (lang: LanguageInfo) => {
    run(
      () =>
        saveLanguage({
          code: lang.code,
          label: lang.label,
          name: lang.name,
          native_name: lang.nativeName,
          enabled: !lang.enabled,
          sort_order: lang.sortOrder,
        }),
      lang.enabled ? `${lang.name} hidden from the site.` : `${lang.name} is now live.`
    );
  };

  const handleDelete = (lang: LanguageInfo) => {
    if (
      !globalThis.confirm(
        `Remove ${lang.name}? Its saved content stays in the database and comes back if you re-add the same code.`
      )
    ) {
      return;
    }
    run(() => deleteLanguage(lang.code), `${lang.name} removed.`);
  };

  const handleMove = (index: number, direction: -1 | 1) => {
    const codes = languages.map((lang) => lang.code);
    const target = index + direction;
    if (target < 0 || target >= codes.length) return;
    [codes[index], codes[target]] = [codes[target], codes[index]];
    run(() => reorderLanguages(codes), 'Order updated.');
  };

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader className="border-b">
          <CardTitle>Configured languages</CardTitle>
          <CardDescription>
            Enabled languages appear in the public language switcher and as tabs in the content
            editor. English is the fallback for any missing text and cannot be disabled.
          </CardDescription>
        </CardHeader>
        <CardContent className="py-4">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-muted-foreground border-b text-left text-xs uppercase">
                  <th className="py-2 pr-4 font-medium">Language</th>
                  <th className="py-2 pr-4 font-medium">Code</th>
                  <th className="py-2 pr-4 font-medium">Switcher label</th>
                  <th className="py-2 pr-4 font-medium">Status</th>
                  <th className="py-2 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {languages.map((lang, index) => (
                  <tr key={lang.code} className="border-b last:border-0">
                    <td className="py-3 pr-4">
                      <span className="font-medium">{lang.name}</span>
                      <span className="text-muted-foreground ml-2">{lang.nativeName}</span>
                    </td>
                    <td className="text-muted-foreground py-3 pr-4 font-mono">{lang.code}</td>
                    <td className="py-3 pr-4">{lang.label}</td>
                    <td className="py-3 pr-4">
                      <span
                        className={
                          lang.enabled
                            ? 'rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700'
                            : 'bg-muted text-muted-foreground rounded-full px-2 py-0.5 text-xs font-medium'
                        }
                      >
                        {lang.enabled ? 'Live' : 'Hidden'}
                      </span>
                    </td>
                    <td className="py-3">
                      <div className="flex items-center gap-1.5">
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          disabled={isPending || index === 0}
                          onClick={() => handleMove(index, -1)}
                          aria-label={`Move ${lang.name} up`}
                        >
                          <ArrowUpIcon size={14} color="currentColor" aria-hidden />
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          disabled={isPending || index === languages.length - 1}
                          onClick={() => handleMove(index, 1)}
                          aria-label={`Move ${lang.name} down`}
                        >
                          <ArrowDownIcon size={14} color="currentColor" aria-hidden />
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          disabled={isPending || lang.code === DEFAULT_LANGUAGE}
                          onClick={() => handleToggle(lang)}
                        >
                          {lang.enabled ? 'Disable' : 'Enable'}
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          className="text-destructive"
                          disabled={isPending || lang.code === DEFAULT_LANGUAGE}
                          onClick={() => handleDelete(lang)}
                        >
                          <TrashBinTrashIcon size={14} color="currentColor" aria-hidden />
                          Remove
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Card>
        <form onSubmit={handleAdd}>
          <CardHeader className="border-b">
            <CardTitle>Add a language</CardTitle>
            <CardDescription>
              The new language starts with English text everywhere — translate it section by section
              in the Content editor.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 py-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="new-lang-code">Code</Label>
              <Input
                id="new-lang-code"
                value={form.code}
                onChange={(event) => setForm((prev) => ({ ...prev, code: event.target.value }))}
                placeholder="ja, ko, zh-tw…"
                required
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="new-lang-name">English name</Label>
              <Input
                id="new-lang-name"
                value={form.name}
                onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
                placeholder="Japanese"
                required
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="new-lang-native">Native name</Label>
              <Input
                id="new-lang-native"
                value={form.native_name}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, native_name: event.target.value }))
                }
                placeholder="日本語"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="new-lang-label">Switcher label</Label>
              <Input
                id="new-lang-label"
                value={form.label}
                onChange={(event) => setForm((prev) => ({ ...prev, label: event.target.value }))}
                placeholder="JA (defaults to the code)"
              />
            </div>
          </CardContent>
          <CardContent className="flex items-center gap-3 border-t py-4">
            <Button type="submit" disabled={isPending}>
              {isPending ? 'Saving…' : 'Add language'}
            </Button>
            {status && (
              <p
                className={
                  status.type === 'success'
                    ? 'text-sm text-emerald-600'
                    : 'text-destructive text-sm'
                }
              >
                {status.message}
              </p>
            )}
          </CardContent>
        </form>
      </Card>
    </div>
  );
}
