import { getDocument } from '../firebase/firestore'

const keyCache = {}

const PROMPTS = {
  enhance: `Improve the following text for clarity, professionalism, and brand voice. Make it compelling and well-structured. Return only the improved text without any prefixes or explanations:\n\n`,
  sales: `Rewrite the following as persuasive sales copy for luxury human hair wigs. Use emotional triggers, highlight benefits over features, create urgency, and maintain a luxury brand tone. Return only the rewritten text:\n\n`,
  urgency: `Add natural urgency and scarcity elements to this text. Include phrases like limited stock, bestseller, or time-sensitive language without sounding fake or gimmicky. Return only the enhanced text:\n\n`,
  promo: `Generate a short promotional blurb or sale banner text (2-3 sentences max) based on this product info. Make it exciting, urgency-driven, and conversion-focused. Return only the blurb:\n\n`,
  seoRewrite: `Rewrite this text for SEO. Include relevant high-intent buying keywords naturally, improve readability, and maintain a compelling tone. Return only the rewritten text:\n\n`,
  shorten: `Condense the following text while preserving all key information. Make it concise and scannable. Return only the shortened text:\n\n`,
  grammar: `Fix any grammar, spelling, and punctuation issues. Improve sentence flow without changing meaning or length significantly. Return only the corrected text:\n\n`,
}

async function getProviderKey(provider) {
  if (keyCache[provider]) return keyCache[provider]
  try {
    const doc = await getDocument('api_keys', provider)
    if (doc?.key) {
      keyCache[provider] = doc.key
      return doc.key
    }
  } catch (_) {}
  const envKey = import.meta.env[`VITE_${provider.toUpperCase()}_API_KEY`]
  if (envKey) keyCache[provider] = envKey
  return envKey || null
}

async function callChromeAI(prompt) {
  const ai = window.ai
  if (!ai?.languageModel) throw new Error('not available')
  const capabilities = await ai.languageModel.capabilities()
  if (capabilities.available !== 'readily') throw new Error('not ready')
  const session = await ai.languageModel.create()
  const result = await session.prompt(prompt)
  session.destroy()
  return result
}

async function callGeminiAPI(prompt) {
  const key = await getProviderKey('gemini')
  if (!key) throw new Error('no key')
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${key}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.7, maxOutputTokens: 1024 },
      }),
    }
  )
  if (!res.ok) throw new Error(await res.text())
  const data = await res.json()
  return data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || ''
}

async function callAI(prompt) {
  try {
    return await callChromeAI(prompt)
  } catch (_) {}
  try {
    return await callGeminiAPI(prompt)
  } catch (_) {}
  throw new Error('AI unavailable')
}

export async function enhanceText(text, mode = 'enhance') {
  if (!text?.trim()) throw new Error('No text to enhance')
  const prompt = PROMPTS[mode] || PROMPTS.enhance
  return callAI(prompt + text)
}

export async function generateMetaTags(title, content) {
  const prompt = `Based on this content, generate an SEO meta title (max 60 chars) and meta description (max 160 chars) for a luxury hair wig brand. Return ONLY valid JSON with "title" and "description" keys, no markdown or other text:\n\nTitle: ${title}\nContent: ${content || title}`
  const result = await callAI(prompt)
  try {
    const cleaned = result.replace(/```json?/gi, '').replace(/```/g, '').trim()
    return JSON.parse(cleaned)
  } catch {
    return { title: title?.slice(0, 60) || '', description: result?.slice(0, 160) || '' }
  }
}

export async function generateExcerpt(content) {
  if (!content?.trim()) throw new Error('No content to summarize')
  const prompt = `Write a compelling 2-3 sentence excerpt/summary for a blog post. Capture the essence and entice readers to click. Return only the excerpt:\n\n${content}`
  return callAI(prompt)
}

export async function analyzeSEO(products, blogs, pages) {
  const issues = []
  const total = products.length + blogs.length + pages.length

  products.forEach(p => {
    if (!p.seo?.title) issues.push({ item: p.title, type: 'Product', field: 'Meta Title', severity: 'high' })
    if (!p.seo?.description) issues.push({ item: p.title, type: 'Product', field: 'Meta Description', severity: 'high' })
    if (p.seo?.title?.length > 60) issues.push({ item: p.title, type: 'Product', field: 'Meta Title too long', severity: 'medium' })
    if (p.seo?.description?.length > 160) issues.push({ item: p.title, type: 'Product', field: 'Meta Description too long', severity: 'medium' })
  })
  blogs.forEach(b => {
    if (!b.seo?.title) issues.push({ item: b.title, type: 'Blog', field: 'Meta Title', severity: 'high' })
    if (!b.seo?.description) issues.push({ item: b.title, type: 'Blog', field: 'Meta Description', severity: 'high' })
  })
  pages.forEach(p => {
    if (!p.seo?.title && p.title) issues.push({ item: p.title || p.slug, type: 'Page', field: 'Meta Title', severity: 'high' })
    if (!p.seo?.description && p.title) issues.push({ item: p.title || p.slug, type: 'Page', field: 'Meta Description', severity: 'high' })
  })

  const summary = {
    total,
    issuesCount: issues.length,
    highPriority: issues.filter(i => i.severity === 'high').length,
    mediumPriority: issues.filter(i => i.severity === 'medium').length,
    issues,
    healthScore: Math.max(0, Math.round(100 - (issues.length / Math.max(total * 2, 1)) * 100)),
  }

  const aiPrompt = `You are an SEO expert for a luxury hair wig e-commerce brand. Analyze these SEO findings and give 3-5 specific, actionable recommendations to improve search rankings and conversions. Focus on sales keywords, meta quality, and content gaps:

Total pages analyzed: ${total}
Issues found: ${issues.length} (${summary.highPriority} high, ${summary.mediumPriority} medium)
Current health score: ${summary.healthScore}%

Top issues:
${issues.slice(0, 10).map(i => `- [${i.severity}] ${i.type}: "${i.item}" - missing ${i.field}`).join('\n')}

Give concise recommendations in plain English. Focus on practical fixes.`

  try {
    const aiSuggestions = await callAI(aiPrompt)
    summary.recommendations = aiSuggestions
  } catch {
    summary.recommendations = 'Configure a Gemini API key in API Keys settings for AI-powered recommendations.'
  }

  return summary
}
