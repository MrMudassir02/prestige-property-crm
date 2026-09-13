import PublicNavbar from "@/components/PublicNavbar";

export default function PublicLayout({ children }) {
  return (
    <>
      <PublicNavbar />

      <main>{children}</main>
    </>
  );
}
