import { Metadata } from "next";
// import { createClient } from "@openauthjs/openauth/client"
import './globals.css'
// import { Resource } from "sst";

export const metadata: Metadata = {
  title: "Dash | Foreververse",
};

export default async function Home() {
  return (
    <>
    <main>
      <h1>Dash</h1>
    </main>
    <footer>
      This is the footer
    </footer>
  </>
   
  );
}
