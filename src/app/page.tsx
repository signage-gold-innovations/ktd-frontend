import { Navbar } from "@/components/landing/navbar";
import { Hero } from "@/components/landing/hero";
import { About } from "@/components/landing/about";
import { Services } from "@/components/landing/services";
import { CompanyShowcase } from "@/components/landing/company-showcase";
import { Footer } from "@/components/landing/footer";

const companies = [
  {
    name: "HiTerraTech",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
    socialLinks: {
      facebook: "#",
      instagram: "#",
      website: "#",
    },
  },
  {
    name: "ศิลาชัยเจริญ",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
    socialLinks: {
      facebook: "#",
      instagram: "#",
      website: "#",
    },
  },
  {
    name: "กิจธนาทรัพย์",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
    socialLinks: {
      facebook: "#",
      instagram: "#",
      website: "#",
    },
  },
];

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <About />
        <Services />
        {companies.map((company) => (
          <CompanyShowcase key={company.name} {...company} />
        ))}
      </main>
      <Footer />
    </>
  );
}
