async function test() {
  try {
    const res = await fetch('https://backend-six-gamma-28.vercel.app/api/workspaces/420771a2-de82-48da-9baf-85adfb423305/messages');
    console.log("Status:", res.status);
    console.log("Data:", await res.text());
  } catch (err) {
    console.error(err);
  }
}
test();
