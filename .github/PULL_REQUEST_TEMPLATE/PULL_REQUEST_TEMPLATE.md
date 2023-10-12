<!-- 
 This is an example template for PRs of any repository, in case of need, it could be 
 changed for other direct purposes or project's and organization's infrastructure.
 -->

PRs: [TITLE OF PULL REQUEST]
============================

Before writing anything about your changes in this PR, checklist this items:

- [ ] Agreed with current version of [code of conduct](./../CODE_OF_CONDUCT.md).
- [ ] Read and followed current version of [“issue policy”](./../../docs/github/ISSUES/ISSUE_POLICY.md).
- [ ] Read and followed current version of [“commit convention”](./../../docs/github/COMMIT_CONVENTION.md).

By agreeding and following this project's documentation, you are reminded that your's commit and styling of changes must follow this project's documentation, in case of “de-followization”, there are two ways before you make sure to publishing your PR:

1. In case of “de-followization” of commit's styling convention, you can amend them (change their message and description signatures):

```powershell
git commit --amend -m "MESSAGE" -m "DESCRIPTION"
```

For amending old commit, see the stackoverflow question[^1], more about changing commits in official docs for github: \
https://docs.github.com/en/pull-requests/committing-changes-to-your-project/creating-and-editing-commits/changing-a-commit-message/

[^1]: https://stackoverflow.com/questions/17338792/amending-old-commit/

2. In case of “de-followization” of coding, documentation and etc. files, you can just refactor everything you need by following styling guidelines of project.

<h3>
    Changes with that PR</h3>
<!-- CHANGES BLOCK: 
 -->

Please, write in the textbox below every changes you made:

<br/>
<div class="textblock" style='padding:0.1em; background-color:#cecece; color:#454545'>
<span style="margin-left:1em;text-align: justify;">
    <p style='margin-top: -0.5em;margin-left: 1em; text-align:left;'>
        <b>Description of changes with that pull request.</b>
    </p>        
    <p style='margin-left:1em;text-align: justify;'>
    ...write your changes here.
    </p>
    <!-- For writing new paragrapg just clone paragraph above and make your typings. -->
    <br/>
</span>
</div>

<h3>
    Process of testing for that PR</h3>
<!-- TESTING BLOCK: 
 -->

- <label for="debug"><b>Was testing process initiated via this PR:</b></label>
<select style="font-family: inherit; font-weight: 500; font-size: 14px; cursor: pointer; appearance: none; user-select: none; text-align: center; display: flex; -webkit-box-align: center; align-items: center; -webkit-box-pack: justify; justify-content: space-between; height: 32px; min-width: max-content; color: #454545; background-color: #cecece; box-shadow: transparent 0px 0px, transparent 0px 0px; border-radius: 6px; border-width: 1px; border-style: solid; border-image: initial; border-color: rgba(240, 246, 252, 0.1); text-decoration: none; padding: 0px 12px; gap: 8px; transition: color 80ms cubic-bezier(0.65, 0, 0.35, 1) 0s, fill, background-color, border-color;">
  <option value="YES" style="font-family: inherit; font-size: 14px; margin-top: 1px; text-align: left;">Yes.</option>
  <option value="NO" selected="selected" style="font-family: inherit; font-size: 14px; margin-top: 1px; text-align: left;">No.</option>
</select>
<br/>
<li><b>If testing was done, type below the procedures you make:</b></li>

...

<div style="text-align:left;margin-left:-7%;"><h3>
    Addition context for that PR</h3></div>

...
