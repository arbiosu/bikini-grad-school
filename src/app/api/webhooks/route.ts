import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createServiceClient } from '@/lib/supabase/clients/service';
import { createSubscriptionService } from '@/lib/container';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature');

  if (!signature) {
    return NextResponse.json(
      { error: 'Missing stripe-signature header' },
      { status: 400 }
    );
  }

  // 1. Verify webhook signature
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }
  const supabase = await createServiceClient();
  const service = createSubscriptionService(supabase);

  // 2. Handle events
  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;

        // Only handle subscription checkouts
        if (session.mode !== 'subscription') break;

        const metadata = session.metadata;
        if (!metadata?.tier_id || !metadata?.tier_price_id) {
          console.error(
            'Checkout session missing required metadata:',
            session.id
          );
          break;
        }

        const result = await service.handleCheckoutCompleted({
          stripeSubscriptionId: session.subscription as string,
          stripeCustomerId: session.customer as string,
          customerEmail:
            session.customer_details?.email ?? session.customer_email ?? '',
          metadata: {
            tier_id: metadata.tier_id,
            tier_price_id: metadata.tier_price_id,
            addon_product_ids: metadata.addon_product_ids ?? '',
          },
          shippingAddress: {
            city:
              session.collected_information?.shipping_details?.address.city ??
              '',
            country:
              session.collected_information?.shipping_details?.address
                .country ?? '',
            line1:
              session.collected_information?.shipping_details?.address.line1 ??
              '',
            line2:
              session.collected_information?.shipping_details?.address.line2 ??
              '',
            postalCode:
              session.collected_information?.shipping_details?.address
                .postal_code ?? '',
            state:
              session.collected_information?.shipping_details?.address.state ??
              '',
          },
          name: session.collected_information?.individual_name ?? '',
          promotionOptIn: session.consent?.promotions === 'opt_in',
        });

        if (!result.success) {
          console.error('handleCheckoutCompleted failed:', result.error);
          // Return 500 so Stripe retries
          return NextResponse.json(
            { error: 'Failed to process checkout' },
            { status: 500 }
          );
        }

        console.log('Checkout completed for subscription:', result.data.id);
        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;

        const result = await service.handleSubscriptionUpdated(subscription);

        if (!result.success) {
          console.error('handleSubscriptionUpdated failed:', result.error);
          return NextResponse.json(
            { error: 'Failed to update subscription' },
            { status: 500 }
          );
        }

        console.log('Subscription updated:', subscription.id);
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;

        const result = await service.handleSubscriptionDeleted(subscription.id);

        if (!result.success) {
          console.error('handleSubscriptionDeleted failed:', result.error);
          return NextResponse.json(
            { error: 'Failed to delete subscription' },
            { status: 500 }
          );
        }

        console.log('Subscription deleted:', subscription.id);
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;
        const subscriptionId = invoice.parent?.subscription_details as
          | string
          | null;

        if (subscriptionId) {
          const result = await service.handleSubscriptionUpdated(
            await stripe.subscriptions.retrieve(subscriptionId)
          );

          if (!result.success) {
            console.error(
              'Failed to sync after payment failure:',
              result.error
            );
          }
        }

        console.log('Payment failed for invoice:', invoice.id);
        break;
      }

      case 'invoice.paid': {
        const invoice = event.data.object as Stripe.Invoice;
        const subscriptionId = invoice.parent?.subscription_details as
          | string
          | null;

        // Sync subscription state on successful payment (handles renewals)
        if (subscriptionId) {
          const result = await service.handleSubscriptionUpdated(
            await stripe.subscriptions.retrieve(subscriptionId)
          );

          if (!result.success) {
            console.error(
              'Failed to sync after payment success:',
              result.error
            );
          }
        }

        console.log('Invoice paid:', invoice.id);
        break;
      }

      default:
        // Unhandled event type — that's fine, just acknowledge it
        console.log('Unhandled event type:', event.type);
    }
  } catch (err) {
    console.error('Webhook handler error:', err);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }

  // 3. Always return 200 for handled events so Stripe doesn't retry
  return NextResponse.json({ received: true });
}
