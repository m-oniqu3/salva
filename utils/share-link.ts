export async function shareLink(url: string) {
  try {
    await navigator.clipboard.writeText(url);
  } catch (error) {
    throw error;
  }
}
