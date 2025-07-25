import { Metadata } from "next";
// import { createClient } from "@openauthjs/openauth/client"
import './globals.css'
// import { Resource } from "sst";
// import { headers } from "next/headers";
import { auth, login, logout } from "./actions";
// import { AuthLink } from "./components/AuthLink";
// import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Sign Up | Join the Foreververse",
};

// export const getServerSideProps: GetServerSideProps<{host: string|null}> = async (context) => ({
//   props: { host: context.req.headers.host || null}
// })

export default async function Home() {
  const subject = await auth();
    return (
    <div>
      <main>

        <ol>
          {subject ? (
            <>
              <li>
                Logged in as <code>{subject.properties.userId}</code>.
              </li>
              <li>
                And then check out <code>app/page.tsx</code>.
              </li>
            </>
          ) : (
            <>
              <li>Login with your email and password.</li>
              <li>
                And then check out <code>app/page.tsx</code>.
              </li>
            </>
          )}
        </ol>

        <div>
          {subject ? (
            <form action={logout}>
              <button>Logout</button>
            </form>
          ) : (
            <form action={login}>
              <button>Login with OpenAuth</button>
            </form>
          )}
        </div>
      </main>
    </div>
  )
  // console.log('happening on...')
  // const client = createClient({
  //   clientID: "exp-aws-game",
  //   issuer: Resource.auth.url
  // })
  // // const all = await headers();
  // // console.log('all', all)
  // const redirect_to = (await headers()).get('referer')
  // const { url } = await client.authorize(`${redirect_to}/dash`, 'code')
  // return (
  //   <>
  //   {/* <Suspense> */}
  //   <main>
  //     <h1>Account User</h1>
  //     <h2>Welcome!</h2>
  //     <a href={url}>Sign in or sign up</a>
  //     <p>will redirect to {redirect_to}</p>
  //     {/* <AuthLink auth_url={Resource.auth.url} redirect_to="/dash">Sign in or sign up</AuthLink> */}
  //   </main>
  //   <footer>
  //     This is the footer
  //   </footer>
  //   {/* </Suspense> */}
  // </>
   
  // );
}
