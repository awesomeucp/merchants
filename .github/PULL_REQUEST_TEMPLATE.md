## Description

<!-- Provide a clear and concise description of your changes -->

## Related Issues

<!-- Link to related issues using keywords (e.g., "Closes #123", "Fixes #456", "Related to #789") -->

- Closes #
- Related to #

## Type of Change

<!-- Mark the relevant option(s) with an "x" -->

- [ ] Merchant submission (new merchant JSON file)
- [ ] Merchant update (changes to existing merchant data)
- [ ] Bug fix (non-breaking change that fixes an issue)
- [ ] New feature (non-breaking change that adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Documentation update
- [ ] Refactoring (no functional changes)
- [ ] Performance improvement
- [ ] Dependency update
- [ ] Other (please describe):

## Changes Made

<!-- Provide a detailed list of changes -->

-
-
-

## For Merchant Submissions

<!-- If this is a merchant submission, fill out this section -->

### Merchant Information

**Merchant Name:**
**Merchant URL:**
**UCP Profile URL:** https://example.com/.well-known/ucp
**Merchant Slug:**

### Merchant Submission Checklist

- [ ] JSON file is valid (no syntax errors)
- [ ] Slug matches filename (e.g., `data/merchants/tech-haven.json` has `"slug": "tech-haven"`)
- [ ] UCP discovery profile is live and accessible at `.well-known/ucp`
- [ ] Logo URL is HTTPS and publicly accessible
- [ ] All required fields are present (`slug`, `name`, `url`, `description`, `logo`, `categories`, `ucpProfile`)
- [ ] Categories and tags are relevant and lowercase
- [ ] I am authorized to submit this merchant
- [ ] Merchant information is accurate and up-to-date
- [ ] Ran `bun run metadata:generate` successfully

### UCP Profile Verification

I have verified the UCP profile is accessible:

```bash
curl https://yourstore.com/.well-known/ucp
```

## Testing

<!-- Describe how you tested your changes -->

### Manual Testing

- [ ] Tested locally with development server (`bun run dev`)
- [ ] Verified merchant appears in browse page
- [ ] Verified merchant detail page loads correctly
- [ ] Tested search and filtering
- [ ] Verified API endpoints return correct data
- [ ] Tested in multiple browsers (if UI change)

### Build Validation

- [ ] `bun run metadata:generate` passes with no errors
- [ ] `bun run build` completes successfully
- [ ] No TypeScript errors
- [ ] No console errors in browser developer tools

## Documentation

<!-- Mark all that apply -->

- [ ] Updated README.md
- [ ] Updated CONTRIBUTING.md
- [ ] Added inline code comments for complex logic
- [ ] No documentation changes needed

## Pre-submission Checklist

<!-- Please verify all items before submitting -->

### Code Quality (for code changes)

- [ ] Code follows the project's code style guidelines
- [ ] TypeScript types are properly defined
- [ ] File naming follows project conventions
- [ ] Imports are organized

### Git

- [ ] Branch is up to date with main
- [ ] Commit messages are clear and descriptive
- [ ] No merge conflicts

### Review

- [ ] Self-reviewed the changes
- [ ] Checked for potential security issues
- [ ] Verified no sensitive information (API keys, credentials) is committed
- [ ] Added appropriate labels to this PR

## Screenshots / Videos

<!-- If applicable, add screenshots or videos demonstrating the changes -->

## Additional Notes

<!-- Any additional context, concerns, or notes for reviewers -->

## Reviewer Notes

<!-- Optional: Specific areas you'd like reviewers to focus on -->

- Please pay special attention to:
- Questions for reviewers:

---

**By submitting this pull request, I confirm that my contribution is made under the terms of the Apache 2.0 license.**
