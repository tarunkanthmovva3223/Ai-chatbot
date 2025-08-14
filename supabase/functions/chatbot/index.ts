import { createClient } from 'npm:@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface ChatbotRequest {
  chat_id: string
  message: string
  user_id: string
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    const { chat_id, message, user_id }: ChatbotRequest = await req.json()

    // Verify the user owns the chat
    const { data: chat, error: chatError } = await supabaseClient
      .from('chats')
      .select('id')
      .eq('id', chat_id)
      .eq('user_id', user_id)
      .single()

    if (chatError || !chat) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized or chat not found' }),
        {
          status: 403,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    // Call OpenRouter API (using a free model)
    const openRouterResponse = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENROUTER_API_KEY')}`,
        'Content-Type': 'application/json',
        'X-Title': 'AI Chat Assistant',
      },
      body: JSON.stringify({
        model: 'meta-llama/llama-3.2-3b-instruct:free',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful AI assistant. Be concise and helpful in your responses.'
          },
          {
            role: 'user',
            content: message
          }
        ],
        max_tokens: 500,
        temperature: 0.7
      })
    })

    if (!openRouterResponse.ok) {
      console.error('OpenRouter API error:', await openRouterResponse.text())
      throw new Error('Failed to get AI response')
    }

    const aiResponse = await openRouterResponse.json()
    const botMessage = aiResponse.choices?.[0]?.message?.content || 'Sorry, I could not generate a response.'

    // Save bot response to database
    const { error: insertError } = await supabaseClient
      .from('messages')
      .insert([
        {
          chat_id,
          content: botMessage,
          is_bot: true,
          user_id,
        }
      ])

    if (insertError) {
      console.error('Error saving bot message:', insertError)
      throw new Error('Failed to save bot response')
    }

    // Update chat's updated_at timestamp
    await supabaseClient
      .from('chats')
      .update({ updated_at: new Date().toISOString() })
      .eq('id', chat_id)

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Bot response saved successfully',
        bot_message: botMessage
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )

  } catch (error) {
    console.error('Chatbot function error:', error)
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Internal server error'
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})