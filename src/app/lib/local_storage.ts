export interface LocalPollAccess {
    pollId: string;
    pollTitle: string;
    lastAccessed: string;
  }

export function getPreviousPollsFromLocalStorage(): LocalPollAccess[] {
  const previousPolls = localStorage.getItem("pollAccesses");
  if (previousPolls) {
    return JSON.parse(previousPolls);
  }
  return [];
}

export function addPollRefToLocalStorage(pollId: string, pollName: string) {
  const previousPolls = getPreviousPollsFromLocalStorage();
  if (previousPolls) {
    const updatedPolls = [...previousPolls.filter(poll => poll.pollId !== pollId), { pollId: pollId, pollTitle: pollName, lastAccessed: new Date().toISOString() }];
    localStorage.setItem("pollAccesses", JSON.stringify(updatedPolls));
  }
}