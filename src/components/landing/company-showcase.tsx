"use client";

import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowRightIcon,
  FacebookIcon,
  InstagramIcon,
  InternetIcon,
} from "@hugeicons/core-free-icons";

import { Button } from "@/components/ui/button";

interface CompanyShowcaseProps {
  name: string;
  description: string;
  socialLinks: {
    facebook?: string;
    instagram?: string;
    website?: string;
  };
}

export function CompanyShowcase({
  name,
  description,
  socialLinks,
}: CompanyShowcaseProps) {
  return (
    <section className="bg-zinc-100 py-16 md:py-24">
      <div className="container mx-auto px-4 md:px-8">
        {/* Heading */}
        <h2 className="text-2xl font-bold tracking-tight text-zinc-900 md:text-3xl">
          <span className="underline decoration-zinc-900 underline-offset-8">
            {name}
          </span>
        </h2>

        {/* Description */}
        <p className="mt-6 max-w-3xl leading-relaxed text-zinc-600">
          {description}
        </p>

        {/* Social links */}
        <div className="mt-4 flex items-center gap-4">
          {socialLinks.facebook && (
            <Link
              href={socialLinks.facebook}
              className="flex items-center gap-1.5 text-sm text-zinc-600 transition-colors hover:text-zinc-900"
            >
              <HugeiconsIcon icon={FacebookIcon} className="size-4" />
              Facebook
            </Link>
          )}
          {socialLinks.instagram && (
            <Link
              href={socialLinks.instagram}
              className="flex items-center gap-1.5 text-sm text-zinc-600 transition-colors hover:text-zinc-900"
            >
              <HugeiconsIcon icon={InstagramIcon} className="size-4" />
              Instagram
            </Link>
          )}
          {socialLinks.website && (
            <Link
              href={socialLinks.website}
              className="flex items-center gap-1.5 text-sm text-zinc-600 transition-colors hover:text-zinc-900"
            >
              <HugeiconsIcon icon={InternetIcon} className="size-4" />
              Website
            </Link>
          )}
        </div>

        {/* Image cards row */}
        <div className="mt-8 flex items-center gap-4">
          <div className="grid flex-1 grid-cols-2 gap-4 md:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="aspect-[4/3] w-full rounded-lg bg-zinc-200"
              />
            ))}
          </div>
          <Button variant="outline" size="icon" className="shrink-0 rounded-full">
            <HugeiconsIcon icon={ArrowRightIcon} className="size-4" />
          </Button>
        </div>
      </div>
    </section>
  );
}
