import PackageManager from './package-manager'

export function attach(runtime, options = {}) {
  runtime.features.register('package-manager', () => PackageManager)
  runtime.selectors.register('package/changed', () => require('./selectors/package/changed'))
  runtime.selectors.register('package/locations', () => require('./selectors/package/locations'))
  runtime.selectors.register('package/outdated-remotes', () =>
    require('./selectors/package/outdated-remotes')
  )
  runtime.selectors.register('package/repository-status', () =>
    require('./selectors/package/repository-status')
  )
  runtime.selectors.register('package/snapshot', () => require('./selectors/package/snapshot'))

  if (runtime.argv.packageManager !== false) {
    runtime.feature('package-manager').enable(options)
  }

  runtime.onRegistration('clients', () => {
    runtime.clients.register('package-manager', () => require('./clients/package-manager'))
  })

  runtime.onRegistration('servers', () => {
    runtime.servers.register('package-manager', () => require('./servers/package-manager'))
  })
}
