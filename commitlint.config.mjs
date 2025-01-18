module.exports = {
    extends: ['@commitlint/config-conventional'],
    ignores: [
        (message) => /^Repo visualizer: update diagram$/m.test(message),
        (message) => /^Bumps [.+](.+) from .+ to .+.$/m.test(message),
    ],
};
