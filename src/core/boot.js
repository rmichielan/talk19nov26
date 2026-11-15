  TalkFeatures.init?.();
  const initialHash = location.hash.match(/^#slide-(\d+)-(\d+)$/);
  go(initialHash ? Number(initialHash[1]) : 1, initialHash ? Number(initialHash[2]) : 0);
  if (matchMedia("(prefers-reduced-motion:reduce)").matches) $("#pause").click();
