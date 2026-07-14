import { Stripe } from "stripe";
import config from "../../config";
import { prisma } from "../../lib/prisma";
import { stripe } from "../../lib/stripe";

// create checkout

const createsubscription = async (userId: string) => {
  const transction = await prisma.$transaction(async (tx) => {
    // find userid

    const user = await tx.user.findUniqueOrThrow({
      where: {
        id: userId,
      },
      include: {
        subscription: true,
      },
    });

    // old subscriber

    let stripecustomerid = user.subscription?.stripecustomerid;

    // new subscriber

    if (!stripecustomerid) {
      const customer = await stripe.customers.create({
        email: user.email,
        name: user.name,
        metadata: { userId: user.id },
      });
      stripecustomerid = customer.id;
    }

    const seasson = await stripe.checkout.sessions.create({
      line_items: [
        {
          price: config.stripe_product_price_id,
          quantity: 1,
        },
      ],
      mode: "subscription",
      customer: stripecustomerid,
      payment_method_types: ["card"],
      success_url: `${config.app_url}/premium?success=true`,
      cancel_url: `${config.app_url}/premium?success=false`,
      metadata: { userId: user.id },
    });

    return seasson.url;
  });

  return { transctionurl: transction };
};

// webhook

const webhooksubscription = async (payload: Buffer, signature: string) => {
  const endpointSecret = config.stripe_webhook_secret;

  const event = stripe.webhooks.constructEvent(
    payload,
    signature,
    endpointSecret,
  );

  switch (event.type) {
    case "checkout.session.completed":
      console.log(event.data.object);
      const session: Stripe.Checkout.Session = event.data.object;
      const userId = session.metadata?.userId;
      const stripecustomerid = session.customer;
      const stripesubscriptionId = session.subscription;

      if (!userId || !stripecustomerid || stripesubscriptionId) {
        throw new Error("webhook failed");
      }

      const stripesubscription = await stripe.subscriptions.retrieve(stripesubscriptionId as string)

      break;
    case "customer.subscription.updated":
      const paymentupdate = event.data.object;

      break;
    case "customer.subscription.deleted":
      const paymentdelete = event.data.object;
      break;
    default:
      // Unexpected event type
      console.log(`no match Unhandled event type ${event.type}.`);
  }
};

export const subscriptionservice = {
  createsubscription,
  webhooksubscription,
};
