// ...existing code...
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";

function getEnv(key) {
  const val = process.env[key];
  if (!val) throw new Error(`${key} must be set`);
  return val;
}

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: getEnv("GOOGLE_CLIENT_ID"),
      clientSecret: getEnv("GOOGLE_CLIENT_SECRET"),
    }),
    // add GithubProvider if needed:
    // GithubProvider({ clientId: getEnv("GITHUB_CLIENT_ID"), clientSecret: getEnv("GITHUB_CLIENT_SECRET") }),
  ],
  secret: getEnv("NEXTAUTH_SECRET"),
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
// ...existing code...