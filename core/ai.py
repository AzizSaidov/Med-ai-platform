from django.conf import settings


class AIConfigurationError(Exception):
    pass


class AIServiceError(Exception):
    pass


DEVELOPER_PROMPT = """
You are the Med Tech AI Assistant inside a Django medical platform demo.
Provide calm, concise, general medical guidance for patients.
Do not claim to diagnose, prescribe, or replace a licensed clinician.
If the user asks about politics, war, news, entertainment, coding, or any
clearly non-medical topic, do not answer that topic. Briefly explain that you
can help only with health-related questions such as symptoms, wellness,
appointments, or preparing for a doctor visit.
If the user mentions emergency symptoms such as chest pain, trouble breathing,
heavy bleeding, stroke symptoms, seizures, or loss of consciousness, clearly
tell them to seek emergency medical care immediately.
When helpful, structure replies with:
1. What might be going on
2. Safe next step
3. When to contact a doctor urgently
Keep the tone supportive and practical.
""".strip()


def _build_messages(history, limit):
    messages = []
    for item in (history or [])[-limit:]:
        role = item.get("role")
        content = (item.get("content") or "").strip()
        if role in {"user", "assistant"} and content:
            messages.append({"role": role, "content": content})
    return messages


def _extract_openai_response_text(response):
    output_text = getattr(response, "output_text", "") or ""
    if output_text.strip():
        return output_text.strip()

    fragments = []
    for item in getattr(response, "output", []) or []:
        if getattr(item, "type", "") != "message":
            continue
        for content in getattr(item, "content", []) or []:
            text = getattr(content, "text", "") or ""
            if text.strip():
                fragments.append(text.strip())

    return "\n\n".join(fragments).strip()


def _generate_with_openai(history):
    if not settings.OPENAI_API_KEY:
        raise AIConfigurationError("OPENAI_API_KEY is not configured.")

    try:
        from openai import OpenAI
    except ImportError as exc:
        raise AIConfigurationError("The OpenAI SDK is not installed.") from exc

    client = OpenAI(api_key=settings.OPENAI_API_KEY)
    response = client.responses.create(
        model=settings.OPENAI_MODEL,
        input=[{"role": "developer", "content": DEVELOPER_PROMPT}] + _build_messages(history, settings.OPENAI_MAX_CHAT_HISTORY),
    )
    return _extract_openai_response_text(response)


def _generate_with_xai(history):
    if not settings.XAI_API_KEY:
        raise AIConfigurationError("XAI_API_KEY is not configured.")

    try:
        from openai import OpenAI
    except ImportError as exc:
        raise AIConfigurationError("The OpenAI SDK is not installed for xAI fallback.") from exc

    client = OpenAI(
        api_key=settings.XAI_API_KEY,
        base_url="https://api.x.ai/v1",
    )
    response = client.chat.completions.create(
        model=settings.XAI_MODEL,
        messages=[
            {"role": "system", "content": DEVELOPER_PROMPT},
            *_build_messages(history, settings.OPENAI_MAX_CHAT_HISTORY),
        ],
    )

    if not response.choices:
        return ""

    content = response.choices[0].message.content or ""
    if isinstance(content, list):
        parts = []
        for item in content:
            text = getattr(item, "text", None)
            if text:
                parts.append(text)
        return "\n\n".join(parts).strip()

    return str(content).strip()


def _generate_with_gemini(history):
    if not settings.GEMINI_API_KEY:
        raise AIConfigurationError("GEMINI_API_KEY is not configured.")

    try:
        from google import genai
        from google.genai import types
    except ImportError as exc:
        raise AIConfigurationError("The Google GenAI SDK is not installed.") from exc

    client = genai.Client(api_key=settings.GEMINI_API_KEY)
    conversation = []
    for item in _build_messages(history, settings.OPENAI_MAX_CHAT_HISTORY):
        role = "model" if item["role"] == "assistant" else "user"
        conversation.append(
            types.Content(
                role=role,
                parts=[types.Part(text=item["content"])],
            )
        )

    response = client.models.generate_content(
        model=settings.GEMINI_MODEL,
        contents=conversation,
        config=types.GenerateContentConfig(
            system_instruction=DEVELOPER_PROMPT,
        ),
    )

    return (getattr(response, "text", "") or "").strip()


PROVIDER_HANDLERS = {
    "openai": _generate_with_openai,
    "xai": _generate_with_xai,
    "gemini": _generate_with_gemini,
}


def get_available_ai_providers():
    providers = []
    if settings.OPENAI_API_KEY:
        providers.append("OpenAI")
    if settings.XAI_API_KEY:
        providers.append("Grok")
    if settings.GEMINI_API_KEY:
        providers.append("Gemini")
    return providers


def generate_ai_reply(session):
    history = session.history or []
    errors = []

    for provider_name in settings.AI_PROVIDER_ORDER:
        handler = PROVIDER_HANDLERS.get(provider_name)
        if handler is None:
            continue

        try:
            reply = handler(history)
        except AIConfigurationError as exc:
            errors.append(f"{provider_name}: {exc}")
            continue
        except Exception as exc:
            errors.append(f"{provider_name}: {exc}")
            continue

        if reply:
            return reply, provider_name

        errors.append(f"{provider_name}: empty response")

    if errors:
        raise AIServiceError(
            "All AI providers failed. Checked: " + "; ".join(errors)
        )

    raise AIConfigurationError(
        "No AI providers are configured. Add OPENAI_API_KEY, XAI_API_KEY, or GEMINI_API_KEY to .env."
    )
