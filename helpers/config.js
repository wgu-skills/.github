import { getInput } from '@actions/core';

const checkEnvVariable = (key, defaultValue = null) => {
  const value = getInput(key)
  if (typeof value === "undefined") {
    if (defaultValue !== null) {
      console.warn(`Environment variable ${key} is not set. Using default value.`)
      return defaultValue
    }
    console.error(`Environment variable ${key} is missing.`)
    return null
  }
  return value
}

// Environment variables grouped and validated
const config = {
  collection: {
    slug: checkEnvVariable("COLLECTION_SLUG", github.context.repo.repo),
    uuid: checkEnvVariable("COLLECTION_UUID", "168fae01-783d-422e-8b9f-93b9dc9102ea"),
    url: checkEnvVariable("COLLECTION_URL", getInput('skillCollectionUrl'))
  },
  files: {
    output_dir: checkEnvVariable("OUTPUT_DIR", process.env.GITHUB_WORKSPACE)
  },
  git: {
    pat: checkEnvVariable("GIT_PAT", getInput('patToken')),
    username: checkEnvVariable("GIT_USERNAME", "davidjpetersen"),
    email: checkEnvVariable("GIT_EMAIL", "david.petersen@wgu.edu"),
    org: checkEnvVariable("GIT_ORG", github.context.repo.owner)
  }
}

// Throw an error if any required variable is missing
Object.keys(config).forEach((group) => {
  Object.entries(config[group]).forEach(([key, value]) => {
    if (value === null) {
      throw new Error(`Required environment variable ${key} is missing in ${group}`)
    }
  })
})

export default config