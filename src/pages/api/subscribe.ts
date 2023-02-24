import { NextApiRequest, NextApiResponse } from "next";
import { stripe } from '../../services/stripe'
import { getSession } from 'next-auth/react'; //serve para pegar os coockies
import { query as q } from "faunadb";
import { fauna } from "../../services/fauna";

type User = {
  ref: {
      id: string;
  },
  data: {
      stripe_customer_id: string;
  }
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
      //criar o usuario em si
      const session = await getSession({ req });



      const user = await fauna.query<User>(
        q.Get(
          q.Match(
            q.Index('user-by-email'),
            q.Casefold(session.user.email)
          )
        )
      )

      //IF PARA EVITAR DUPLICIDADE NO CADASTRO DE CLIENTES
      let customerId = user.data.stripe_customer_id

      if(!customerId) {
        const stripeCustomer = await stripe.customers.create({
          email: session.user.email,
          // metadata
        })
        await fauna.query(
          q.Update(
            q.Ref(q.Collection('users'), user.ref.id),
            {
              data: {
                stripe_customer_id: stripeCustomer.id
              }
            }
          )
        )
      }



    const stripeCheckoutSession = await stripe.checkout.sessions.create({
      customer: customerId, // Id do usuario; comprador
      payment_method_types: ['card'], //metodo de pagamento
      billing_address_collection: 'required', //Endereço obrigatorio ou não
      line_items: [
        //itens do carrinho
        {price: 'price_1KaNxwF0aa4KZVxj1gsjE5Ya', quantity: 1} //id do price
      ],
      mode: 'subscription', //pagamento mensal em assinatura
      allow_promotion_codes: true, //se aceita cupom de descontos
      success_url: process.env.STRIPE_SUCCESS_URL, // link de redirecionamento apos o pagamento 
      cancel_url: process.env.STRIPE_CANCEL_URL
    })

    return res.status(200).json({ sessionId: stripeCheckoutSession.id }) // se bem sucessido
  } else {
    res.setHeader('Allow', 'POST') //metodo que aceita e POST
    res.status(405).end('Method not allowed') //exibe uma mensagem de erro que nao é permitido o metodo 
  }
}