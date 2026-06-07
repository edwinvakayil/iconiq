export function recordGithubClick() {
  fetch("/api/flags/clicked-github", {
    keepalive: true,
    method: "POST",
  }).catch(() => undefined);
}
