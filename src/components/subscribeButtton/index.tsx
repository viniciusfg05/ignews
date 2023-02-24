import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { api } from '../../services/api';
import { getStripeJs } from '../../services/stripe.js';
import styles from './styles.module.scss';

interface SubscribeButttonProps {
  priceId: string;
}

export function SubscribeButtton(priceId: SubscribeButttonProps) {
  //Saber se o usuario ja está logado
  const {data: session} = useSession();

  const router = useRouter()

  async function HandleSubscrebe() {
    if(!session) {
      signIn('github')
      return;
    }

    if (session.activeSubscription) {
      router.push('/posts');

      return;
    }

    //criação da checkout session
    try {
      const response = await api.post('/subscribe') //rota

      const { sessionId } = response.data; //id da sessao

      const stripe = await getStripeJs()

      await stripe.redirectToCheckout({sessionId})
    }catch (err) {
      alert(err.message)
    }
  }

  return (
    <button
    type="button"
    className={styles.subscribeButtton}
    onClick={HandleSubscrebe}
    >
      Subscribe now
    </button>
  )
} 