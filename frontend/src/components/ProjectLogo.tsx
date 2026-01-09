import { Link } from "react-router-dom";

export default function ProjectLogo() {
  return (
    <Link to="/" className="text-3xl font-bold font-serif tracking-tight">
      <span className="hidden md:block">SatyaNews</span>
      <span className="md:hidden">SN</span>
    </Link>
  );
}
