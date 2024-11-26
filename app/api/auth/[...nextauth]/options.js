// NOTE : Option User want to authenticate
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import User from "@/app/(models)/User";
import bcrypt from "bcrypt";
import sendLoginNotification from "../../send/route";

export const options = {
  providers: [
    GitHubProvider({
      profile(profile) {
        console.log("Github Profile", profile);

        let userRole = "Github User";
        if (profile?.email === "er.prabalgupta.2411@gmail.com") {
          userRole = "admin";
        }
        console.log({
          ...profile,
          role: userRole,
        });
        return {
          ...profile,
          role: userRole,
        };
      },
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
    GoogleProvider({
      profile(profile) {
        console.log("Google Profile", profile);
        let userRole = "Google User";
        // console.log({
        //   ...profile,
        //   id: profile.sub,
        //   role: userRole,
        // });
        return {
          ...profile,
          id: profile.sub,
          role: userRole,
        };
      },
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "Email",
        },
        password: {
          label: "Password",
          type: "password",
          placeholder: "Password",
        },
      },
      async authorize(credentials) {
        try {
          const foundUser = await User.findOne({ email: credentials.email })
            .lean()
            .exec();
          if (foundUser) {
            console.log("User Exists");
            const match = await bcrypt.compare(
              credentials.password,
              foundUser.password
            );

            if (match) {
              console.log("Good Match");
              delete foundUser.password;
              foundUser["role"] = "Unverified Email";
              return foundUser;
            }
          }
        } catch (error) {
          console.log(error);
        }
        return null;
      },
    }),
  ],
  //   SECTION : Custom Callbacks to bind Rolw with the token
  callbacks: {
    // Server Side accessing
    async jwt({ token, user }) {
      if (user) token.role = user.role;
      return token;
    },
    // Client Side accessing
    async session({ session, token }) {
      if (session?.user) session.user.role = token.role;
      return session;
    },
  },
  events: {
    // async createUser(message) {
    //   const params = {
    //     user: {
    //       name: message.user.name,
    //       email: message.user.email,
    //     },
    //   };
    //   await sendLoginNotification(params); // <-- send welcome email
    // },

    async signIn(user) {
      const params = {
        user: {
          name: user.user.name,
          email: user.user.email,
        },
      };
      await sendLoginNotification(params); // <-- send welcome email
    },
  },
};
