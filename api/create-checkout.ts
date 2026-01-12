import type { VercelRequest, VercelResponse } from '@vercel/node';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
    apiVersion: '2025-01-27.acacia',
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { companyName, siteId } = req.body;

    if (!companyName) {
        return res.status(400).json({ error: 'Missing companyName' });
    }

    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: `Website Hosting - ${companyName}`,
                            description: `Monthly hosting and maintenance for your custom website.`,
                        },
                        unit_amount: 1000, // $10.00
                        recurring: {
                            interval: 'month',
                        },
                    },
                    quantity: 1,
                },
            ],
            mode: 'subscription',
            success_url: `${req.headers.origin}?payment=success&siteId=${siteId}`,
            cancel_url: `${req.headers.origin}`,
            metadata: {
                companyName,
                siteId
            }
        });

        return res.status(200).json({ url: session.url });
    } catch (error: any) {
        console.error('[Stripe] Checkout Error:', error);
        return res.status(500).json({ error: error.message || 'Failed to create checkout session' });
    }
}
