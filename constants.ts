
import { Type } from "@google/genai";

export const SYSTEM_PROMPT = `
You are a Senior Conversion-Focused Copywriter for Home Services.
Your goal is to write high-conversion but strictly COMPLIANT landing page copy for a home service contractor.

COMPLIANCE & NEUTRALITY RULES (STRICT - FAILURE IS UNACCEPTABLE):
1. NO GUARANTEES: Do NOT use words like "guaranteed", "will", "always", "best", "promise", "certainty", or "perfect".
2. NO NUMBERS: Do NOT include any digits (0-9) or spelled-out numbers (e.g., "four", "ten"). This applies to years in business, project counts, and ratings.
3. NO CERTIFICATIONS/AWARDS: Do NOT mention licenses, awards, affiliations, or certifications.
4. NO WARRANTIES: Do NOT make outcome promises or mention warranties.
5. NO ASSUMPTIONS: Do NOT guess years in business, availability, pricing, service area size, or experience levels.
6. NO SOCIAL PROOF: Do NOT invent testimonials, reviews, or ratings.
7. NEUTRAL TONE: Use "We offer", "We help with", "Designed to", "Learn more", "Contact us".
8. FOOTER: Do NOT generate a disclaimer, the application handles it.

BRAND PLACEMENT: Include Company Name + Location in the Hero Headline.

SECTIONS TO GENERATE:
1. Hero: Headline (3 lines), subtext, badge, and 3-4 key features (neutral bullet points, NO numbers).
2. Services: Exactly 4 distinct service cards with icons. 
3. Value Proposition: Section headline, subtitle, descriptive content, and 3-4 highlights (process-based, neutral).
4. Process: Exactly 3 logical steps from start to finish.
5. Key Highlights: Headline and exactly 6 checklist items (neutral, no claims).
6. FAQs: Exactly 4 common questions (neutral answers, no promises).

Icon Selection: Use Lucide-react icon names in dash-case (e.g., "wrench", "shield-check", "clock").

Industry: {industry}
Company: {companyName}
Location: {location}
Phone: {phone}
`;

export const RESPONSE_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    bannerText: { type: Type.STRING },
    hero: {
      type: Type.OBJECT,
      properties: {
        badge: { type: Type.STRING },
        headline: {
          type: Type.OBJECT,
          properties: {
            line1: { type: Type.STRING },
            line2: { type: Type.STRING },
            line3: { type: Type.STRING }
          },
          required: ["line1", "line2", "line3"]
        },
        subtext: { type: Type.STRING },
        stats: { // Keep key name for compatibility but updated prompt restricts contents
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              label: { type: Type.STRING },
              value: { type: Type.STRING } // Prompt says NO NUMBERS
            },
            required: ["label", "value"]
          },
          minItems: 3,
          maxItems: 4
        }
      },
      required: ["badge", "headline", "subtext", "stats"]
    },
    services: {
      type: Type.OBJECT,
      properties: {
        cards: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              description: { type: Type.STRING },
              icon: { type: Type.STRING }
            },
            required: ["title", "description", "icon"]
          },
          minItems: 4,
          maxItems: 4
        }
      },
      required: ["cards"]
    },
    valueProposition: {
      type: Type.OBJECT,
      properties: {
        title: { type: Type.STRING },
        subtitle: { type: Type.STRING },
        content: { type: Type.STRING },
        highlights: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          minItems: 3,
          maxItems: 4
        }
      },
      required: ["title", "subtitle", "content", "highlights"]
    },
    process: {
      type: Type.OBJECT,
      properties: {
        title: { type: Type.STRING },
        steps: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              description: { type: Type.STRING },
              icon: { type: Type.STRING }
            },
            required: ["title", "description", "icon"]
          },
          minItems: 3,
          maxItems: 3
        }
      },
      required: ["title", "steps"]
    },
    benefits: {
      type: Type.OBJECT,
      properties: {
        title: { type: Type.STRING },
        items: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          minItems: 6,
          maxItems: 6
        }
      },
      required: ["title", "items"]
    },
    faqs: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          question: { type: Type.STRING },
          answer: { type: Type.STRING }
        },
        required: ["question", "answer"]
      },
      minItems: 4,
      maxItems: 4
    },
    contact: {
      type: Type.OBJECT,
      properties: {
        phone: { type: Type.STRING },
        location: { type: Type.STRING },
        companyName: { type: Type.STRING }
      },
      required: ["phone", "location", "companyName"]
    }
  },
  required: ["bannerText", "hero", "services", "valueProposition", "process", "benefits", "faqs", "contact"]
};

export const STATUS_MESSAGES = [
  "Setting up your website structure...",
  "Creating your homepage layout...",
  "Adding your services and content...",
  "Optimizing layout for mobile and desktop...",
  "Applying your business details...",
  "Finalizing design and sections...",
  "Your site is almost ready..."
];
