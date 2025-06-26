# Supabase CLI

[![Coverage Status](https://coveralls.io/repos/github/supabase/cli/badge.svg?branch=main)](https://coveralls.io/github/supabase/cli?branch=main) [![Bitbucket Pipelines](https://img.shields.io/bitbucket/pipelines/supabase-cli/setup-cli/master?style=flat-square&label=Bitbucket%20Canary)](https://bitbucket.org/supabase-cli/setup-cli/pipelines) [![Gitlab Pipeline Status](https://img.shields.io/gitlab/pipeline-status/sweatybridge%2Fsetup-cli?label=Gitlab%20Canary)
](https://gitlab.com/sweatybridge/setup-cli/-/pipelines)

[Supabase](https://supabase.io) is an open source Firebase alternative. We're building the features of Firebase using enterprise-grade open source tools.

This repository contains all the functionality for Supabase CLI.

- [x] Running Supabase locally
- [x] Managing database migrations
- [x] Creating and deploying Supabase Functions
- [x] Generating types directly from your database schema
- [x] Making authenticated HTTP requests to [Management API](https://supabase.com/docs/reference/api/introduction)

## Getting started

### Install the CLI

Available via [NPM](https://www.npmjs.com) as dev dependency. To install:

```bash
npm i supabase --save-dev
```

To install the beta release channel:

```bash
npm i supabase@beta --save-dev
```

When installing with yarn 4, you need to disable experimental fetch with the following nodejs config.

```
NODE_OPTIONS=--no-experimental-fetch yarn add supabase
```

> **Note**
For Bun versions below v1.0.17, you must add `supabase` as a [trusted dependency](https://bun.sh/guides/install/trusted) before running `bun add -D supabase`.

<details>
  <summary><b>macOS</b></summary>

  Available via [Homebrew](https://brew.sh). To install:

  ```sh
  brew install supabase/tap/supabase
  ```

  To install the beta release channel:
  
  ```sh
  brew install supabase/tap/supabase-beta
  brew link --overwrite supabase-beta
  ```
  
  To upgrade:

  ```sh
  brew upgrade supabase
  ```
</details>

<details>
  <summary><b>Windows</b></summary>

  Available via [Scoop](https://scoop.sh). To install:

  ```powershell
  scoop bucket add supabase https://github.com/supabase/scoop-bucket.git
  scoop install supabase
  ```

  To upgrade:

  ```powershell
  scoop update supabase
  ```
</details>

<details>
  <summary><b>Linux</b></summary>

  Available via [Homebrew](https://brew.sh) and Linux packages.

  #### via Homebrew

  To install:

  ```sh
  brew install supabase/tap/supabase
  ```

  To upgrade:

  ```sh
  brew upgrade supabase
  ```

  #### via Linux packages

  Linux packages are provided in [Releases](https://github.com/supabase/cli/releases). To install, download the `.apk`/`.deb`/`.rpm`/`.pkg.tar.zst` file depending on your package manager and run the respective commands.

  ```sh
  sudo apk add --allow-untrusted <...>.apk
  ```

  ```sh
  sudo dpkg -i <...>.deb
  ```

  ```sh
  sudo rpm -i <...>.rpm
  ```

  ```sh
  sudo pacman -U <...>.pkg.tar.zst
  ```
</details>

<details>
  <summary><b>Other Platforms</b></summary>

  You can also install the CLI via [go modules](https://go.dev/ref/mod#go-install) without the help of package managers.

  ```sh
  go install github.com/supabase/cli@latest
  ```

  Add a symlink to the binary in `$PATH` for easier access:

  ```sh
  ln -s "$(go env GOPATH)/bin/cli" /usr/bin/supabase
  ```

  This works on other non-standard Linux distros.
</details>

<details>
  <summary><b>Community Maintained Packages</b></summary>

  Available via [pkgx](https://pkgx.sh/). Package script [here](https://github.com/pkgxdev/pantry/blob/main/projects/supabase.com/cli/package.yml).
  To install in your working directory:

  ```bash
  pkgx install supabase
  ```

  Available via [Nixpkgs](https://nixos.org/). Package script [here](https://github.com/NixOS/nixpkgs/blob/master/pkgs/development/tools/supabase-cli/default.nix).
</details>

### Run the CLI

```bash
supabase bootstrap
```

Or using npx:

```bash
npx supabase bootstrap
```

The bootstrap command will guide you through the process of setting up a Supabase project using one of the [starter](https://github.com/supabase-community/supabase-samples/blob/main/samples.json) templates.

## Docs

Command & config reference can be found [here](https://supabase.com/docs/reference/cli/about).

## Breaking changes

We follow semantic versioning for changes that directly impact CLI commands, flags, and configurations.

However, due to dependencies on other service images, we cannot guarantee that schema migrations, seed.sql, and generated types will always work for the same CLI major version. If you need such guarantees, we encourage you to pin a specific version of CLI in package.json.

## Developing

To run from source:

```sh
# Go >= 1.22
go run . help
```

## Development History and Key Enhancements

Below is a detailed summary of the key actions, issues, and solutions discussed during the development of this Nuxt 3 application for product reviews:

1. **Amazon Product Lookup Integration:**  
   - Created a composable for Amazon API calls, a secure server-side API endpoint with AWS signature generation, and a UI button to trigger Amazon product searches displayed in a modal.  
   - Resolved a 404 error for the Amazon API endpoint by verifying file locations, creating test endpoints, and updating the endpoint to match AWS signature requirements. Credentials were moved to environment variables.

2. **UI/UX Enhancements:**  
   - Adjusted the size and style of the "Save" buttons on review cards, fixed Vue warnings about the "review" prop, and replaced the save button with a bookmark icon with tooltip.  
   - Updated the create review page to include a rating input and AI-generated ratings, fixed `v-model` bindings, and resolved a runtime error about reading 'title' of undefined.  
   - Resolved a Nuxt warning about `useAsyncData` keys by making the key unique.

3. **Saved Lists and Comparison Features:**  
   - Implemented a "Reformat as Table" feature for saved-lists compare display.  
   - Made saved lists cards smaller, fit 3 across per page, and included a scrollable section for items. Footer buttons were made always visible.  
   - Moved the "Compare" button in the View List dialog to the footer and fixed missing scrollbars.  
   - Removed the author name from each review in the details dialog.

4. **Review Detail Page Enhancements:**  
   - Added an "Update with AI" button to send the product name to the AI and display the response in a PrimeVue Dialog with markdown formatting and smaller font for headers.

5. **Navigation and Admin Features:**  
   - Added List Management (Bookmarks) and Admin icon buttons to the top navigation, visible based on user login and admin privileges.  
   - Updated the home page to show the list where generated reviews were added.  
   - Updated the userReviewGenerator completion step to always show a button to the generated list.

6. **Deduplication and Category Management:**  
   - Created a deduplication tool for admins at `pages/admin/reviews/dedup.vue`, grouping similar reviews and allowing admins to delete duplicates.  
   - Added a button for the deduplication tool to the admin quick actions.  
   - Updated the "Append Category" action to only add a category if the review was not already in that category.

7. **Database and SQL Issues:**  
   - Provided SQL statements to remove duplicate entries from `review_categories`, keeping the most recent entry and logging deleted rows.

8. **Review Update Error:**  
   - Fixed a type mismatch error (`integer` vs. `numeric`) in the review update function by updating the parameter type in `schema.sql`.

9. **Deployment and Build Issues:**  
   - Diagnosed and resolved Vercel deployment issues related to the `outputDirectory` and the use of `--prebuilt`.  
   - Added a build date/time to the footer for debugging deployments, with a script to generate `.build-date` and display it in the app.  
   - Fixed an ES module error with the build script by renaming it to `.cjs` and updating the `package.json` script.

10. **Final Deployment Troubleshooting:**  
    - Confirmed deployment process and settings via Vercel dashboard.  
    - Recommended removing the `outputDirectory` from `vercel.json` and deploying without `--prebuilt`, which resolved the issue.

**Throughout the development, code edits, SQL queries, deployment advice, and UI/UX improvements were provided, addressing each request and troubleshooting step in detail.**
