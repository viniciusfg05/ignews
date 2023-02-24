import { render, screen } from '@testing-library/react' //renderiza virtualmente
import { Header } from '.'

jest.mock('next/router', () => {
  return {
    useRouter() {
      return {
        asPath: '/'
      }
    }
  }
})

jest.mock('next-auth/react', () => {
  return {
    useSession() {
      return [null, false]
    }
  }
})

// Desestruturando GetByText
// describe('ActiveLink component', () => {
//   it('renders correctly', () => {
//     const { getByText } = render(
//       <Header />
//      )
  
//     expect(getByText('Home')).toBeInTheDocument()
//     expect(getByText('Posts')).toBeInTheDocument()
//   })
// })


// primeira forma usando o screen
describe('ActiveLink component', () => {
  it('renders correctly', () => {
    render(
      <Header />
     )
  
    expect(screen.getByText('Home')).toBeInTheDocument()
    expect(screen.getByText('Posts')).toBeInTheDocument()
  })
})



