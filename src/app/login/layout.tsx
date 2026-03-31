import { ConsoleAuthProvider } from "@/lib/console-auth";

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return <ConsoleAuthProvider>{children}</ConsoleAuthProvider>;
}
