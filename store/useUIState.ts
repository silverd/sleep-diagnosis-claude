'use client'

import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

// ===========================================================================
// Types
// ===========================================================================

export type ModalType =
  | 'createQuestionnaire'
  | 'editQuestionnaire'
  | 'deleteQuestionnaire'
  | 'createQuestion'
  | 'editQuestion'
  | 'deleteQuestion'
  | 'upgradePrompt'
  | null

export interface ModalState<T = unknown> {
  type: ModalType
  payload: T | null
}

export interface UIState {
  // ---- Questionnaire navigation ----
  /** The ID of the questionnaire currently being viewed/edited in the CMS. */
  activeQuestionnaireId: string | null
  /** The 0-based index of the question currently in focus inside the editor. */
  currentQuestionIndex: number

  // ---- Modal / dialog management ----
  modal: ModalState

  // ---- Search & filter state ----
  questionnaireSearch: string
  questionnaireStatusFilter: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED' | ''
  userSearch: string
  userPremiumFilter: boolean | ''

  // ---- Pagination ----
  questionnairePage: number
  userPage: number

  // ---- Sidebar ----
  sidebarOpen: boolean

  // ---- Actions ----
  setActiveQuestionnaire: (id: string | null) => void
  setCurrentQuestionIndex: (index: number) => void
  nextQuestion: () => void
  prevQuestion: () => void

  openModal: <T>(type: NonNullable<ModalType>, payload?: T) => void
  closeModal: () => void

  setQuestionnaireSearch: (search: string) => void
  setQuestionnaireStatusFilter: (
    filter: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED' | '',
  ) => void
  setUserSearch: (search: string) => void
  setUserPremiumFilter: (filter: boolean | '') => void

  setQuestionnairePage: (page: number) => void
  setUserPage: (page: number) => void

  toggleSidebar: () => void
  setSidebarOpen: (open: boolean) => void

  resetFilters: () => void
}

// ===========================================================================
// Store
// ===========================================================================

export const useUIState = create<UIState>()(
  devtools(
    (set, get) => ({
      // ---- Initial state ----
      activeQuestionnaireId: null,
      currentQuestionIndex: 0,
      modal: { type: null, payload: null },
      questionnaireSearch: '',
      questionnaireStatusFilter: '',
      userSearch: '',
      userPremiumFilter: '',
      questionnairePage: 1,
      userPage: 1,
      sidebarOpen: true,

      // ---- Questionnaire navigation ----
      setActiveQuestionnaire: (id) =>
        set({ activeQuestionnaireId: id, currentQuestionIndex: 0 }),

      setCurrentQuestionIndex: (index) =>
        set({ currentQuestionIndex: Math.max(0, index) }),

      nextQuestion: () =>
        set((s) => ({
          currentQuestionIndex: s.currentQuestionIndex + 1,
        })),

      prevQuestion: () =>
        set((s) => ({
          currentQuestionIndex: Math.max(0, s.currentQuestionIndex - 1),
        })),

      // ---- Modal ----
      openModal: <T>(type: NonNullable<ModalType>, payload?: T) =>
        set({ modal: { type, payload: payload ?? null } }),

      closeModal: () =>
        set({ modal: { type: null, payload: null } }),

      // ---- Search & filters ----
      setQuestionnaireSearch: (search) =>
        set({ questionnaireSearch: search, questionnairePage: 1 }),

      setQuestionnaireStatusFilter: (filter) =>
        set({ questionnaireStatusFilter: filter, questionnairePage: 1 }),

      setUserSearch: (search) =>
        set({ userSearch: search, userPage: 1 }),

      setUserPremiumFilter: (filter) =>
        set({ userPremiumFilter: filter, userPage: 1 }),

      // ---- Pagination ----
      setQuestionnairePage: (page) => set({ questionnairePage: page }),
      setUserPage: (page) => set({ userPage: page }),

      // ---- Sidebar ----
      toggleSidebar: () =>
        set((s) => ({ sidebarOpen: !s.sidebarOpen })),

      setSidebarOpen: (open) => set({ sidebarOpen: open }),

      // ---- Reset ----
      resetFilters: () =>
        set({
          questionnaireSearch: '',
          questionnaireStatusFilter: '',
          userSearch: '',
          userPremiumFilter: '',
          questionnairePage: 1,
          userPage: 1,
        }),
    }),
    { name: 'UIState' },
  ),
)
