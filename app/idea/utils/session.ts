const CACHE_AMOUNT = 10;

function getCachedIdeas(): string[] {
  const cached = localStorage.getItem("recent_ideas");
  return cached ? JSON.parse(cached) : [];
}

function addIdeaToCache(newIdea: string) {
  const recentIdeas = getCachedIdeas();
  if (!recentIdeas.includes(newIdea)) {
    if (recentIdeas.length >= CACHE_AMOUNT) recentIdeas.shift(); // keep last X ideas
    recentIdeas.push(newIdea);
    localStorage.setItem("recent_ideas", JSON.stringify(recentIdeas));
  }
}

export { getCachedIdeas, addIdeaToCache };
