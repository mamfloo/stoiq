import NextAuth from "next-auth"

declare module "next-auth" {
  interface User {
    username: string;
    profilePic: string
    bio: string
    id: string
    registerDate: string,
    page: number
}
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: User & {  
      username: string;
      profilePic: string
      bio: string
      id: string
      registerDate: string
      page: number
    }
    token: {
      username: string;
      profilePic: string
      bio: string
      id: string
      registerDate: string
      page: number
    }
  }

}