export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      type_description: {
        Row: {
          type_name: string
          description: string | null
          work_duration: number | null
        }
        Insert: {
          type_name: string
          description?: string | null
          work_duration?: number | null
        }
        Update: {
          type_name?: string
          description?: string | null
          work_duration?: number | null
        }
      }
      creative_requests: {
        Row: {
          id: string
          created_at: string
          applicant_name: string
          applicant_division: string | null
          client_email: string
          project_title: string
          project_type: string | null
          brief_link: string | null
          requested_deadline: string | null
          status: string
          negotiation_notes: string | null
          receivable_link: string | null
          pic_id: number | null
        }
        Insert: {
          id?: string
          created_at?: string
          applicant_name: string
          applicant_division?: string | null
          client_email: string
          project_title: string
          project_type?: string | null
          brief_link?: string | null
          requested_deadline?: string | null
          status?: string
          negotiation_notes?: string | null
          receivable_link?: string | null
          pic_id?: number | null
        }
        Update: {
          id?: string
          created_at?: string
          applicant_name?: string
          applicant_division?: string | null
          client_email?: string
          project_title?: string
          project_type?: string | null
          brief_link?: string | null
          requested_deadline?: string | null
          status?: string
          negotiation_notes?: string | null
          receivable_link?: string | null
          pic_id?: number | null
        }
      }
      staff: {
        Row: {
          staff_id: number
          staff_name: string
          staff_email: string
        }
        Insert: {
          staff_id?: number
          staff_name: string
          staff_email: string
        }
        Update: {
          staff_id?: number
          staff_name?: string
          staff_email?: string
        }
      }
    }
  }
}