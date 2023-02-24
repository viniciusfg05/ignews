import {query as q} from 'faunadb'
import NextAuth from "next-auth"
import GithubProvider from "next-auth/providers/github"

import { fauna } from '../../../services/fauna'

export default NextAuth({
  // Configure one or more authentication providers
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
        authorization: {
            params: {
                scope: 'read:user, user:email', 
            },
        }
    }),
  ],
  callbacks: {
    async session({ session }) {
      try {
        const userActiveSubscription = await fauna.query(
          //estamos pegando a ref do usuario pelo 'subscription_by_user_ref' , e encontrando a ref do usuario por email
          q.Get( //pegar
            //ver se combina a ref com o status active da assinatura
            q.Intersection([ //para ver se combina os dois 
              q.Match( //que bate
                q.Index('subscription_by_user_ref'), //com index
                q.Select( //seleciona //pegar o usuario pelo email
                  "ref",
                  q.Get( //pegar
                    q.Match( //que bate
                      q.Index('user-by-email'), //com esse index
                      q.Casefold(session.user.email) //local do email
                    )
                  )
                )
              ),
              q.Match(
                q.Index('subscription_by_status'),
                "active"
              )
            ])
          )
        )
  
        return {
          ...session,
          activeSubscription: userActiveSubscription
        }
      } catch {
        return {
          ...session,
          activeSubscription: null
        }
      }
    },
    async signIn({ user, account, profile }) {
      //inserção no banco de dados
      const { email } = user

      try {
        await fauna.query(
          q.If( //se
            q.Not( //não
              q.Exists( //existir
                q.Match( //uma match ou um mesmo email
                  q.Index('user-by-email'), //para fazer essa busca vamos usar o indexs que criamos no fauna
                  q.Casefold(user.email) //para normalizar a tipografica 
                )
              )
            ),
            //se a condição a cima for true, vamos crir um novo usarua no banco de dados 
            q.Create(
              q.Collection('users'), //nome da collection 
              { data: { email } }
            ),
            //se ele já existe trazer os dados
            q.Get(
              q.Match(
                q.Index('user-by-email'),   
                q.Casefold(user.email)
              )
            )
          )
        )

        return true //significa que o login deu certo

      } catch {
        return false //significa que o login deu errado
      }

    },
  }
})


