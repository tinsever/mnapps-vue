import { createClient } from "@supabase/supabase-js";

export default defineEventHandler(async (event) => {

  const config = useRuntimeConfig(event);
  const supabaseAdmin = createClient(
    config.supabaseUrl!,
    config.supabaseServiceKey!,
    { auth: { persistSession: false } },
  );

  const functionName = `process_newspaper`;

  const { data, error } = await supabaseAdmin.functions.invoke(functionName, {
    headers: {
      Authorization: `Bearer ${config.supabaseServiceKey}`,
    },
  });

  if (error) {
    console.error(
      `Error invoking Supabase function '${functionName}':`,
      error.context || error,
    );
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to refresh newspaper feed.",
      data: { originalError: error.message },
    });
  }
  setResponseStatus(event, 200);
  return data;
});