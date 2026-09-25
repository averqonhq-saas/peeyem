export interface YouTubeVideoInfo {
  videoId: string;
  thumbnailUrl: string;
  thumbnailHqUrl: string;
  embedUrl: string;
  cleanUrl: string;
}

/**
 * Extracts YouTube video information from various URL formats
 * (watch?v=, youtu.be/, embed/, shorts/)
 */
export function parseYouTubeUrl(rawUrl: string): YouTubeVideoInfo | null {
  if (!rawUrl || typeof rawUrl !== "string") return null;

  const trimmed = rawUrl.trim();
  let videoId: string | null = null;

  try {
    // Check if user simply entered the 11-char video ID directly
    if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
      videoId = trimmed;
    } else {
      const url = new URL(trimmed.startsWith("http") ? trimmed : `https://${trimmed}`);

      if (url.hostname.includes("youtube.com")) {
        if (url.pathname.includes("/watch")) {
          videoId = url.searchParams.get("v");
        } else if (url.pathname.startsWith("/embed/")) {
          videoId = url.pathname.split("/embed/")[1]?.split("/")[0]?.split("?")[0] || null;
        } else if (url.pathname.startsWith("/shorts/")) {
          videoId = url.pathname.split("/shorts/")[1]?.split("/")[0]?.split("?")[0] || null;
        }
      } else if (url.hostname === "youtu.be") {
        videoId = url.pathname.slice(1).split("?")[0] || null;
      }
    }
  } catch {
    // Regex fallback
    const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/|youtube\.com\/shorts\/)([^"&?\/\s]{11})/;
    const match = trimmed.match(regex);
    if (match && match[1]) {
      videoId = match[1];
    }
  }

  if (!videoId || videoId.length !== 11) {
    return null;
  }

  return {
    videoId,
    thumbnailUrl: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
    thumbnailHqUrl: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
    embedUrl: `https://www.youtube.com/embed/${videoId}?rel=0`,
    cleanUrl: `https://www.youtube.com/watch?v=${videoId}`,
  };
}
