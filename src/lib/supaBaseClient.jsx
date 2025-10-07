import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://kkppabgoqavvqrqrsfce.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtrcHBhYmdvcWF2dnFycXJzZmNlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk1ODg4NzcsImV4cCI6MjA3NTE2NDg3N30.WgUDsZyFPpkATz2K1-r6Jip21U_qGlJENPD6JaEOWd8'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
