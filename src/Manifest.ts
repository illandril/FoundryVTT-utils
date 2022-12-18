type Author = {
  name: string
  url?: string
  email?: string
  discord?: string
  'ko-fi'?: string
  patreon?: string
  reddit?: string
  twitter?: string
};

export const IllandrilAuthorInfo: Author = {
  name: 'Joe Spandrusyszyn (illandril)',
  url: 'https://github.com/illandril',
  email: 'foundry-modules@illandril.net',
  discord: 'joespan#3152',
  'ko-fi': 'illandril',
  patreon: 'illandril',
  reddit: 'u/illandril',
};

type MediaCoreOptions = {
  url: string,
  caption?: string,
};

type MediaOptions = MediaCoreOptions & ({
  type: 'cover' | 'icon' | 'screenshot'
} | {
  type: 'video'
  loop?: boolean
  thumbnail?: string
});

type SemVer = `${number}.${number}.${number}`;

type FoundryGenOrBuild = number | `${number}.${number}`;

type ModuleOrSystemReference = {
  id: string
  type: 'system' | 'module'
  manifest?: string
  compatibility?: {
    minimum?: SemVer
    verified?: SemVer
    maximum?: SemVer
  }
};

type System = ModuleOrSystemReference & {
  type: 'system'
};

type Module = ModuleOrSystemReference & {
  type: 'module'
};

type Language = {
  lang: string
  name: string
  path: string
};

type NonEmptyArray<T> = [T, ...T[]];

type ManifestOptions = {
  id: string
  title: string
  description: string
  version: SemVer
  compatibility: {
    minimum: FoundryGenOrBuild
    verified: FoundryGenOrBuild
    maximum?: FoundryGenOrBuild
  }
  authors: NonEmptyArray<Author>
  relationships?: {
    systems?: NonEmptyArray<System>
    requires?: NonEmptyArray<Module>
  }
  library?: boolean,
  socket?: boolean,
  esmodules?: NonEmptyArray<string>
  styles?: NonEmptyArray<string>
  packs?: NonEmptyArray<never> // TODO: Add packs support
  languages?: NonEmptyArray<Language>
  license?: string
  readme?: string
  repositoryURL: `git+https://github.com/${string}.git`
  media?: NonEmptyArray<MediaOptions>
};

export const generate = ({
  id, title, description,
  version,
  compatibility,
  authors,
  relationships,
  esmodules,
  styles,
  languages,
  license,
  repositoryURL,
  media,
}: ManifestOptions) => {
  const baseRepoURL = repositoryURL.substring(4, repositoryURL.length - 4);
  return {
    id, title, description, version,
    manifestPlusVersion: '1.2.0',
    authors,
    license,
    compatibility,
    relationships,
    esmodules, styles, languages,
    url: baseRepoURL,
    bugs: `${baseRepoURL}/issues`,
    flags: { allowBugReporter: true },
    changelog: `${baseRepoURL}/blob/master/CHANGELOG.md`,
    manifest: `${baseRepoURL}/releases/latest/download/module.json`,
    download: `${baseRepoURL}/releases/download/v${version}/module.zip`,
    media,
  };
};
