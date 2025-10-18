const config = {
  extends: ['@commitlint/config-conventional'],
  ignores: [
    /** Ignores:
     * @type: repo-visualizer
     * @description depends on repo-visualizer action, it does not support any custom
     *              feature requests and etc., so just ignore issues with it's commit
     *
     * @param {*} message entirety of commit message (header + description)
     * @returns Boolean value which shows whether commit should be ignored or not
     */
    (message) => /^repo visualizer:\s*update diagram$/im.test(message),
    /** Ignores:
     * @type: dependabot
     * @description since dependabot is an automated system which is important in terms not only
     *              tracking updates, but security issues too, it is acceptable to ignore issues
     *              with it's commit naming
     *
     * @param {*} message entirety of commit message (header + description)
     * @returns Boolean value which shows whether commit should be ignored or not
     */
    (message) =>
      /^(build|chore|deps|ci)\([^)]+\): bump (?:@?[\w-]+(?:\/[\w-]+)*|.+ from [\w.-]+ to [\w.-]+)$/gm.test(
        message
      ),
    (message) =>
      /^(build|chore|deps|ci)\([^)]+\): bump the [\w-]+ group with \d+ updates?$/gim.test(message),
    /** Ignores:
     * @type: imgbot
     * @description while imgbot doesn't appears to be ever linted by commitlint because it's
     *              messaging entirely of commitlint's convention, it still be useful to ignore
     *              possible errors from bot which doesn't touch source code, it optimizes only
     *              images
     *
     * @param {*} message entirety of commit message (header + description)
     * @returns Boolean value which shows whether commit should be ignored or not
     */
    (message) => /^\[[iI]mg[bB]ot\](?: Optimize images|:? .*)$/m.test(message),
    /** Ignores:
     * @type: copilot
     * @description filters out automatically generated commits authored or co-authored by
     *              Github Copilot. Such commits typically have generic messages.
     *              These are IDE-assisted maintenance actions and do not follow the
     *              conventional commit specification. Since they are non-semantic and
     *              often result from editor integrations rather than intentional versioning
     *              actions, they are safely ignored by commitlint to prevent unnecessary CI
     *              failures.
     *
     *
     * @param {*} message entirety of commit message (header + description)
     * @returns Boolean value which shows whether commit should be ignored or not
     */
    (message) => /co-authored-by:\s*copilot\s*</im.test(message)
  ],
  rules: {
    'header-max-length': async () => [2, 'always', 72],
    'body-max-length': async () => [0, 'always', 100]
  }
}

export default config
