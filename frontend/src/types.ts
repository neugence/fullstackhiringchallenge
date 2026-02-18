export type PostStatus = 'draft' | 'published'

export type Post = {
  id: string
  title: string
  lexical_state: Record<string, unknown>
  text_content: string
  status: PostStatus
  created_at: string
  updated_at: string
}

export type AuthResponse = {
  access_token: string
  token_type: string
}
