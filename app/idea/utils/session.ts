const CACHE_AMOUNT = 10;

function getCachedIdeas(): string[] {
  const cached = localStorage.getItem("recentIdeas");
  return cached ? JSON.parse(cached) : [];
}

function addIdeaToCache(newIdea: string) {
  const recentIdeas = getCachedIdeas();
  if (!recentIdeas.includes(newIdea)) {
    if (recentIdeas.length >= CACHE_AMOUNT) recentIdeas.shift(); // keep last X ideas
    recentIdeas.push(newIdea);
    localStorage.setItem("recentIdeas", JSON.stringify(recentIdeas));
  }
}

function clearIdeaCache() {
  localStorage.removeItem("recentIdeas");
}

export { getCachedIdeas, addIdeaToCache, clearIdeaCache };
