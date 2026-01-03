
import type { VercelRequest, VercelResponse } from '@vercel/node';
import axios from 'axios';
import crypto from 'crypto';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { eventId, userData, eventSourceUrl } = req.body;

    const PIXEL_ID = '1287427660086229';
    const ACCESS_TOKEN = process.env.FB_ACCESS_TOKEN || 'EAACebucvHOIBQPm2X9KVM7KUfgVReFoTw86OwhXxZBYpf8j2I73RfTJZBmxYfukroUMReZBpBNsT1WlFMoCBkZAzKn0OrIgnRz5bsl5PZCf3TREeSX9RcdR2vI8ZBpyZBwq3fYvPnB95gU0LkXEZCBZCjlO290VYuBwSNf6a3VrZAufCW4N8wR4GIDlLNNjfZCl71aYhwZDZD';

    try {
        // Basic user data hashing as per FB requirements
        const hash = (data: string) => data ? crypto.createHash('sha256').update(data.toLowerCase().trim()).digest('hex') : null;

        const data = {
            data: [{
                event_name: 'Purchase',
                event_time: Math.floor(Date.now() / 1000),
                event_id: eventId,
                event_source_url: eventSourceUrl,
                action_source: 'website',
                user_data: {
                    client_ip_address: req.headers['x-forwarded-for'] || req.socket.remoteAddress,
                    client_user_agent: req.headers['user-agent'],
                    em: userData?.email ? [hash(userData.email)] : undefined,
                    ph: userData?.phone ? [hash(userData.phone)] : undefined,
                },
                custom_data: {
                    currency: 'USD',
                    value: 10.00,
                }
            }]
        };

        const response = await axios.post(
            `https://graph.facebook.com/v17.0/${PIXEL_ID}/events?access_token=${ACCESS_TOKEN}`,
            data
        );

        console.log('[FB-CAPI] Event sent successfully:', response.data);
        return res.status(200).json({ success: true, result: response.data });
    } catch (error: any) {
        console.error('[FB-CAPI] Error details:', error.response?.data || error.message);
        return res.status(500).json({
            error: 'Failed to send CAPI event',
            details: error.response?.data || error.message
        });
    }
}
