import config from "../../config";
import { prisma } from "../../lib/prisma";
import { stripe } from "../../lib/stripe";

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

export const subscriptionservice = {
  createsubscription,
};
