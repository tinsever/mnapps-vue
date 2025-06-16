import { createClient } from "@supabase/supabase-js";

export default defineEventHandler(async (event) => {
  const newspaperIdParam = getRouterParam(event, "id");
  const newspaperId = parseInt(newspaperIdParam || "", 10);

  if (isNaN(newspaperId)) {
    throw createError({
      statusCode: 400,
      statusMessage: "A valid numerical newspaper ID is required.",
    });
  }

  const config = useRuntimeConfig(event);
  const supabaseAdmin = createClient(
    config.supabaseUrl!,
    config.supabaseServiceKey!,
    { auth: { persistSession: false } },
  );

  const functionName = `process_one_newspaper/${newspaperId}`;

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