import { Link } from "react-router-dom"
import { ReactNode } from "react"

interface LogoLinkProps {
  path: string;
  children: ReactNode;
}

export const LogoLink = ({ path, children }: LogoLinkProps) => {
  return (
    <Link to={path}>
      <h1 className='logo header'>{children}</h1>
    </Link>
  )
}
