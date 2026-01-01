
import { Type } from "@google/genai";

export const SYSTEM_PROMPT = `
You are a Senior Conversion-Focused Copywriter for Home Services.
Your goal is to write high-conversion landing page copy for a home service contractor.

CONTENT STRATEGY RULES (CRITICAL):
1. Limited Branding: Include the Company Name and Service Area (Location) together in main headlines ONLY 2–3 times total across the entire site. Use these only in the Hero headline and one or two major section headers (e.g., Services or Expertise).
2. Concise Headlines: Every headline must be extremely concise—aim for 6–8 words maximum.
3. No Duplication: Do NOT repeat the same wording across different headlines. Avoid duplicating any headline phrasing within body copy or other sections.
4. Clean Sections: Keep all other sections (FAQs, benefits, cards) clean and generic without repeating the company name and location.
5. Natural Flow: Ensure the copy doesn't feel like a template.

CONSTRAINTS:
1. Zero Fluff: Avoid "elite," "top," "best," "premium," "#1," or "luxury."
2. Neutral/Practical Language: Use words like "Trusted," "Local," "Reliable," "Practical," and "Honest."
3. NO Promotional Claims: Forbidden to include pricing, discounts, percentages, or financing language.
4. CTA Rule: The primary call-to-action MUST be "Get an estimate".
5. Icon Selection: Use Lucide-react icon names in dash-case (e.g., "wrench", "shield-check", "clock").
6. Sections: 
   - 'About Us': Concise summary of local presence.
   - 'Why This Industry Matters': Universal importance of the service.
   - 'Additional Benefits': EXACTLY 3 unique benefit cards.
   - 'FAQs': EXACTLY 4 distinct common-sense questions.
   - 'Repair Benefits': Section focused on professional repairs.

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
        subtext: { type: Type.STRING }
      },
      required: ["badge", "headline", "subtext"]
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
    repairBenefits: {
      type: Type.OBJECT,
      properties: {
        title: { type: Type.STRING },
        items: {
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
      required: ["title", "items"]
    },
    aboutUs: {
      type: Type.OBJECT,
      properties: {
        title: { type: Type.STRING },
        content: { type: Type.STRING }
      },
      required: ["title", "content"]
    },
    whyItMatters: {
      type: Type.OBJECT,
      properties: {
        title: { type: Type.STRING },
        content: { type: Type.STRING }
      },
      required: ["title", "content"]
    },
    additionalBenefits: {
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
          minItems: 3,
          maxItems: 3
        }
      },
      required: ["cards"]
    },
    industryValue: {
      type: Type.OBJECT,
      properties: {
        title: { type: Type.STRING },
        content: { type: Type.STRING }
      },
      required: ["title", "content"]
    },
    benefits: {
      type: Type.OBJECT,
      properties: {
        items: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          minItems: 5,
          maxItems: 6
        }
      },
      required: ["items"]
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
  required: ["bannerText", "hero", "services", "repairBenefits", "aboutUs", "whyItMatters", "additionalBenefits", "industryValue", "benefits", "faqs", "contact"]
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
