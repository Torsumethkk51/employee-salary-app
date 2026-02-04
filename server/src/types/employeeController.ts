import { t } from "elysia";

export type createBodyValue = {
  firstname: string,
  lastname: string,
  nickname?: string,
  job_titles?: string
}

export const createBody = t.Object({
  firstname: t.String(),
  lastname: t.String(),
  nickname: t.Optional(t.String()),
  job_titles: t.Optional(t.String())
})

export type updateBodyValue = {
  firstname?: string,
  lastname?: string,
  nickname?: string,
  job_titles?: string
}

export const updateBody = t.Object({
  firstname: t.Optional(t.String()),
  lastname: t.Optional(t.String()),
  nickname: t.Optional(t.String()),
  job_titles: t.Optional(t.String())
})