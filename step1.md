## Step 1 - Create project
When you are all set, let's make a project.
```shell
npx create-next-app@latest
```
You will get a few prompts. Let's choose a name and use the default values for the other prompts.
Example name:
```text
webshop-frontend-course
```
You can press enter on the other questions.


You now have a project with an empty next.js template ready to go.
You can run to start a dev server to see what it looks like:
```shell
npm run dev
```
Go to http://localhost:3000 to view live changes you make.

Now let's remove the default page elements from the template.

Go to `app/page.tsx` and remove everything in the return call and replace it with a `<div>Home</div>`:

```tsx
export default function Home() {
  return (
    <div>
      Home
    </div>
  );
}
```
Your webpage now looks rather empty from the browser.
