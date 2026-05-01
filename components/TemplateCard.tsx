import React from 'react';
import Link from 'next/link';
import { Template } from '../types';

interface TemplateCardProps {
  template: Template;
}

export function TemplateCard({ template }: TemplateCardProps) {
  return (
    <div className="group relative rounded-xl border border-gray-200 bg-white shadow-sm transition-all hover:shadow-md dark:border-gray-800 dark:bg-gray-900 overflow-hidden">
      <div className="aspect-[3/4] w-full overflow-hidden bg-gray-100 dark:bg-gray-800 relative">
        {template.thumbnail_url ? (
          <img
            src={template.thumbnail_url}
            alt={template.name}
            className="h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-gray-400">
            No Preview Available
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
      </div>
      <div className="p-5">
        <div className="mb-2 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{template.name}</h3>
          <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
            {template.category}
          </span>
        </div>
        <p className="mb-4 text-sm font-medium text-gray-600 dark:text-gray-400">
          Rp {template.price.toLocaleString('id-ID')}
        </p>
        <div className="flex gap-2">
          <Link
            href={`/templates/${template.id}`}
            className="flex-1 rounded-lg bg-blue-600 px-4 py-2 text-center text-sm font-medium text-white hover:bg-blue-700 transition-colors"
          >
            Pilih Template
          </Link>
        </div>
      </div>
    </div>
  );
}
