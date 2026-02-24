'use client'

import { useTransition, useState } from 'react'
import { useRouter } from 'next/navigation'
import { clsx } from 'clsx'
import toast from 'react-hot-toast'
import { createQuestionnaire, updateQuestionnaire } from '~/app/actions/cms'
import type { QuestionnaireStatus } from '~/types'

interface QuestionnaireFormProps {
  /** Pass existing data for edit mode, omit for create mode */
  initial?: {
    id: string
    title: string
    slug: string
    description: string | null
    status: QuestionnaireStatus
  }
}

function toSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

export function QuestionnaireForm({ initial }: QuestionnaireFormProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const isEdit = Boolean(initial)

  const [title, setTitle] = useState(initial?.title ?? '')
  const [slug, setSlug] = useState(initial?.slug ?? '')
  const [description, setDescription] = useState(initial?.description ?? '')
  const [status, setStatus] = useState<QuestionnaireStatus>(
    initial?.status ?? 'DRAFT',
  )
  const [slugTouched, setSlugTouched] = useState(isEdit)

  function handleTitleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setTitle(e.target.value)
    if (!slugTouched) setSlug(toSlug(e.target.value))
  }

  function handleSlugChange(e: React.ChangeEvent<HTMLInputElement>) {
    setSlug(toSlug(e.target.value))
    setSlugTouched(true)
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim() || !slug.trim()) return

    startTransition(async () => {
      if (isEdit && initial) {
        const result = await updateQuestionnaire({
          id: initial.id,
          title,
          slug,
          description: description || undefined,
          status,
        })
        if (result.success) {
          toast.success('Questionnaire updated.')
        } else {
          toast.error(result.error)
        }
      } else {
        const result = await createQuestionnaire({
          title,
          slug,
          description: description || undefined,
          status,
        })
        if (result.success) {
          toast.success('Questionnaire created.')
          router.push(`/cms/questionnaires/${result.data.id}`)
        } else {
          toast.error(result.error)
        }
      }
    })
  }

  const fieldCls =
    'w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-excellent-500 focus:outline-none focus:ring-1 focus:ring-excellent-500 disabled:opacity-60'

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Title */}
      <div>
        <label className="mb-1.5 block text-sm font-medium text-gray-700">
          Title <span className="text-verypoor-500">*</span>
        </label>
        <input
          type="text"
          required
          placeholder="e.g. Pittsburgh Sleep Quality Index"
          value={title}
          onChange={handleTitleChange}
          disabled={isPending}
          className={fieldCls}
        />
      </div>

      {/* Slug */}
      <div>
        <label className="mb-1.5 block text-sm font-medium text-gray-700">
          Slug <span className="text-verypoor-500">*</span>
        </label>
        <div className="flex items-center overflow-hidden rounded-xl border border-gray-200 bg-white focus-within:border-excellent-500 focus-within:ring-1 focus-within:ring-excellent-500">
          <span className="flex-shrink-0 border-r border-gray-200 bg-pagebg-100 px-3 py-2.5 text-sm text-gray-500">
            /q/
          </span>
          <input
            type="text"
            required
            placeholder="psqi-assessment"
            value={slug}
            onChange={handleSlugChange}
            disabled={isPending}
            className="flex-1 bg-transparent px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none disabled:opacity-60"
          />
        </div>
        <p className="mt-1 text-xs text-gray-400">
          URL-safe identifier. Auto-generated from title.
        </p>
      </div>

      {/* Description */}
      <div>
        <label className="mb-1.5 block text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          rows={3}
          placeholder="Brief description shown to participants…"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          disabled={isPending}
          className={clsx(fieldCls, 'resize-none')}
        />
      </div>

      {/* Status */}
      <div>
        <label className="mb-1.5 block text-sm font-medium text-gray-700">Status</label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as QuestionnaireStatus)}
          disabled={isPending}
          className={fieldCls}
        >
          <option value="DRAFT">Draft</option>
          <option value="PUBLISHED">Published</option>
          <option value="ARCHIVED">Archived</option>
        </select>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 pt-2">
        <button
          type="submit"
          disabled={isPending || !title.trim() || !slug.trim()}
          className="inline-flex items-center gap-2 rounded-xl bg-excellent-500 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isPending ? (
            <>
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              Saving…
            </>
          ) : isEdit ? (
            'Save Changes'
          ) : (
            'Create Questionnaire'
          )}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          disabled={isPending}
          className="rounded-xl px-5 py-2.5 text-sm font-medium text-gray-600 ring-1 ring-gray-200 hover:bg-pagebg-100 disabled:opacity-50"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}
