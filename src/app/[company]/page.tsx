'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { getSubCompanyConfig } from '@/config/sub-companies';

import { SubAbout } from '@/components/sub-company/sub-about';
import { SubFooter } from '@/components/sub-company/sub-footer';
import { SubHeader } from '@/components/sub-company/sub-header';
import { SubHero } from '@/components/sub-company/sub-hero';
import { SubServices } from '@/components/sub-company/sub-services';
import { SubSolution } from '@/components/sub-company/sub-solution';

export default function CompanyPage() {
  const params = useParams();
  const slug = params?.company as string;
  const config = getSubCompanyConfig(slug);

  // 404-like fallback if company slug not found
  if (!config) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4">
        <h1 className="text-[32px] font-bold">Company not found</h1>
        <p className="text-gray-500">The company &ldquo;{slug}&rdquo; does not exist.</p>
        <Link href="/" className="text-blue-600 underline">
          Back to KTD Group
        </Link>
      </div>
    );
  }

  return (
    <>
      <SubHeader config={config} />
      <main>
        <SubHero config={config} />
        <SubAbout config={config} />
        <SubServices config={config} />
        <SubSolution config={config} />
      </main>
      <SubFooter config={config} />
    </>
  );
}
