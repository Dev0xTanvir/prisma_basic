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
      success_url: `${config.app_url}/premium/success`,
      cancel_url: `${config.app_url}/payment`,
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
      const session: Stripe.Checkout.Session = event.data.object;
      const userId = session.metadata?.userId as string;
      const stripecustomerid = session.customer as string;
      const stripesubscribeId = session.subscription as string;

      if (!userId || !stripecustomerid || !stripesubscribeId) {
        throw new Error("webhook failed");
      }

      const stripesubscription = await stripe.subscriptions.retrieve(
        stripesubscribeId as string,
      );

      const currentPeriodEndmillesecoend =
        stripesubscription.items.data[0]?.current_period_end!;

      const currentPeriodEnd = new Date(currentPeriodEndmillesecoend * 1000);

      await prisma.subscription.upsert({
        where: {
          userId,
        },
        create: {
          userId,
          stripecustomerid,
          stripesubscribeId,
          status: "ACTIVE",
          currentPeriodEnd,
        },
        update: {
          stripecustomerid,
          stripesubscribeId,
          status: "ACTIVE",
          currentPeriodEnd,
        },
      });

      break;
    case "customer.subscription.updated":
      const subscription = event.data.object as Stripe.Subscription;

      const updatePeriodEndmillesecoend =
        subscription.items.data[0]?.current_period_end!;

      const updatecurrentPeriodEnd = new Date(
        updatePeriodEndmillesecoend * 1000,
      );

      await prisma.subscription.update({
        where: {
          stripesubscribeId: subscription.id,
        },
        data: {
          status: subscription.status.toUpperCase() as any,
          currentPeriodEnd: updatecurrentPeriodEnd,
        },
      });

      break;
    case "customer.subscription.deleted":
      const deletesubscription = event.data.object as Stripe.Subscription;

      await prisma.subscription.update({
        where: {
          stripesubscribeId: deletesubscription.id,
        },
        data: {
          status: "CENCELED",
        },
      });
      break;
    default:
      // Unexpected event type
      console.log(`no match Unhandled event type ${event.type}.`);
  }
};

const getsubscription = async (userId: string) => {
  const issubscriptionexist = await prisma.subscription.findUniqueOrThrow({
    where: {
      userId,
    },
  });

  const isActive =
    issubscriptionexist.status === "ACTIVE" &&
    issubscriptionexist.currentPeriodEnd &&
    new Date(issubscriptionexist.currentPeriodEnd) > new Date();

  return {
    status: issubscriptionexist.status,
    isstatus: isActive,
    currentPeriodEnd: issubscriptionexist.currentPeriodEnd,
  };
};

export const subscriptionservice = {
  createsubscription,
  webhooksubscription,
  getsubscription,
};
