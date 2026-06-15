const GITHUB_API_BASE = 'https://api.github.com';

export async function fetchReadme(fullName: string): Promise<string> {
  try {
    const response = await fetch(
      `${GITHUB_API_BASE}/repos/${fullName}/readme`,
      {
        headers: {
          Accept: 'application/vnd.github.v3.raw',
          'Accept-Version': '2022-11-28',
        },
        next: { revalidate: 3600 },
      }
    );

    if (!response.ok) return '';
    const text = await response.text();
    return text.slice(0, 6000);
  } catch {
    return '';
  }
}
