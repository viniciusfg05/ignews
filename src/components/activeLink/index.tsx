import Link, { LinkProps } from "next/link";
import { useRouter } from "next/router";
import { ReactElement, cloneElement } from "react";


interface ActiveLinkProps extends LinkProps { //para passarmos as props do Link para o ActiveLink
  children: ReactElement; //Para receber um elemeto react dentro do Link
  activeClassName: string;
}

export function ActiveLink({children, activeClassName, ...rest}: ActiveLinkProps) {
  const { asPath } = useRouter()

  const className = asPath === rest.href
  ? activeClassName
  : '';

  return (
    <Link {...rest}>
      {cloneElement(children, { className })}
    </Link>
  )
}