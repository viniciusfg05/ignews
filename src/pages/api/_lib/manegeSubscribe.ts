import { query as q } from "faunadb";
import { fauna } from "../../../services/fauna";
import { stripe } from "../../../services/stripe";

export async function saveSubscription(
  subscriptionId: string,
  customerId: string,
  createdAction = false,
  ) {
  //buscar o usuario no banco do fauna com id Custumer ID
  //Buscar a ref do usuario
  const useRef = await fauna.query(
    q.Select(
      "ref",
      q.Get(
        q.Match(
          q.Index('user_by_stripe_customer_id'), //idex do subscribe do fauna
          customerId
        )
      )
    )
  )
  //buscando todos os dados da subscription
  const subscription = await stripe.subscriptions.retrieve(subscriptionId)
  //Informando os dados do subscription que eu quero salvar
  const subscriptionData = {
    id: subscription.id,
    userId: useRef,
    status: subscription.status,
    price_id: subscription.items.data[0].price.id, //data[0] -- pegar o id do primeiro intem
  }
  //salvar os dados da subscription no faunaDB
  if(createdAction) {
    await fauna.query(
      q.Create(
        q.Collection('subscriptions'),
        { data: subscriptionData} //salvamos o intem no fauna
      )
  )
  } else {
    await fauna.query(
      q.Replace(
        q.Select(
          "ref",
          q.Get(
            q.Match(
              q.Index('subscription_by_id'),
              subscriptionId,
            )
          )
        ),
        //passa o dados que quero atulizar
        { data: subscriptionData }
      )
    )
  }
}