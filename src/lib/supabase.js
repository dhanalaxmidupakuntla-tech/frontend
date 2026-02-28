import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://cuybmwifiyydpvxauhoq.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN1eWJtd2lmaXl5ZHB2eGF1aG9xIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIyNjA1NDIsImV4cCI6MjA4NzgzNjU0Mn0.VJ_DGAdZMjH5nOgdIQ4PXcFdzCjlX9OlwlKBbuz7kLQ";

export const supabase = createClient(supabaseUrl, supabaseKey);