This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).



### Notifications
https://supabase.com/docs/guides/realtime

https://makerkit.dev/blog/tutorials/real-time-notifications-supabase-nextjs



### Avatar
https://avatar-placeholder.iran.liara.run/document/name/#more-option

https://movie-reel.netlify.app/



### Temp Code
```ts
// Invalidate the query that gets the follower information
    queryClient.setQueryData(
      ["get-followers", id],
      (previousData: Array<Follower>) => {
        if (!previousData) return previousData;

        // flip the `isFollowedByViewer` state
        return previousData.map((follower) => {
          if (follower.id === id) {
            return { ...follower, isFollowedByViewer: !isFollowedByViewer };
          }

          return follower;
        });
      }
    );
```

are they any collections created by the user?

- no 
  - diaplay the arrow icon and the save button
  - user cant add to the collection if they click the save button because they have no collection (disable btn or open the collection menu )
  - user will have to click the (v) icon
  - open the context menu and display collection info (prompt to create new board)
  - create the collection and add the film to it

- yes
  - chwck th db for the most saved to collection/saved saved to collection
  - display that collection name 
  - if user clciks the arrow beside the collection open the collection menu
  - if they click the collection name then go to the collection page
  - if they click the plus icon add the film to the displayed collection













## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
