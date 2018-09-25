require('@babel/register')({
  presets: [
    [
      '@babel/preset-env',
      {
        modules: 'commonjs',
        targets: {
          node: '6.11.1',
        },
      },
    ],
  ],
  plugins: ['@babel/plugin-proposal-object-rest-spread', '@babel/plugin-transform-runtime'],
})

require('child_process').spawnSync('yarn', ['build'], {
  cwd: require('path').resolve(__dirname, '..', 'src', 'runtime'),
  stdio: 'inherit',
})

require('child_process').spawnSync('yarn', ['build'], {
  cwd: require('path').resolve(__dirname, '..', 'src', 'runtimes', 'node'),
  stdio: 'inherit',
})

process.env.DISABLE_SKYPAGER_FILE_MANAGER = true

const MultiSpinner = require('multispinner')
const { resolve } = require('path')

const stageOne = [['@skypager/features-file-manager', 'src/features/file-manager', 'lib']]

const stageTwo = [
  ['@skypager/helpers-client', 'src/helpers/client', 'lib'],
  ['@skypager/helpers-server', 'src/helpers/server', 'lib'],
  ['@skypager/helpers-repl', 'src/helpers/repl', 'lib'],
]

const first = stageOne
const rest = stageTwo

class CISpinner {
  constructor(projectNames) {
    this.projectNames = projectNames
  }

  start() {
    console.log('Starting Build Scripts')
    this.projectNames.forEach(name => console.log(`  ${name}`))
  }
  success(name) {
    console.log(`${skypager.cli.colors.green('Success')}: ${name}`)
  }
  error(name) {
    console.log(`${skypager.cli.colors.red('ERROR')}: ${name}`)
  }
}

async function main() {
  console.log('Building Local Projects')

  if (!first.length && !rest.length) {
    return
  }

  const skypager = require('@skypager/node')

  // skypager.cli.clear()

  const { spawn } = skypager.proc.async
  const { print } = skypager.cli
  const { red, green } = skypager.cli.colors

  const spinner = process.env.JOB_NAME
    ? new CISpinner(first.concat(rest).map(i => i[0]))
    : new MultiSpinner(first.concat(rest).map(i => i[0]), {
        autoStart: false,
        clear: false,
      })

  spinner.start()

  await Promise.all(
    first.map(([project, subfolder]) =>
      spawn('yarn', ['build'], { cwd: skypager.resolve(subfolder) })
        .then(() => {
          spinner.success(project)
        })
        .catch(error => {
          print(red(`Error in ${project}`))
          print(red(error.message), 2, 2, 2)
          print(red(error.stack), 2, 2, 2)
          spinner.error(project)
          throw error
        })
    )
  ).catch(error => {
    print(red(error.message))
    print(error.stack)
    process.exit(1)
  })

  await Promise.all(
    rest.map(([project, subfolder]) =>
      spawn('yarn', ['build', skypager.argv.force && '--force'].filter(Boolean), {
        cwd: skypager.resolve(subfolder),
        stdio: skypager.argv.debug ? 'inherit' : 'ignore',
      })
        .then(() => {
          spinner.success(project)
        })
        .catch(error => {
          print(red(`Error in ${project}`))
          print(red(error.message), 2, 2, 2)
          print(red(error.stack), 2, 2, 2)
          spinner.error(project)
          throw error
        })
    )
  ).catch(error => {
    print(red(error.message))
    print(error.stack)
    process.exit(1)
  })

  return new Promise(resolve => {
    setTimeout(resolve, 3000)
  })
}

main()
  .then(() => {
    delete process.env.DISABLE_SKYPAGER_FILE_MANAGER
    skypager.cli.print('Creating dev dependency symlinks in each of our local projects.')
    return skypager.proc.async.spawn('node', ['scripts/link-dev-dependencies.js'], {
      stdio: 'inherit',
    })
  })
  .then(() => {
    printUsageInstructions()
    process.exit(0)
  })
  .catch(error => {
    console.error(error)
    process.exit(1)
  })

function printUsageInstructions() {
  skypager.cli.clear()
  skypager.cli.randomBanner('Skypager')

  skypager.cli.print(
    [`The Skypager Frontend Portfolio`, `Version: ${skypager.currentPackage.version}`],
    0,
    2,
    2
  )

  require('child_process').spawnSync('lerna', ['ls'], {
    cwd: resolve(__dirname, '..'),
    stdio: 'inherit',
  })
  const USAGE = `
${skypager.cli.colors.green.bold('Good luck!')}
`.trim()
  console.log(`\n\n${USAGE}\n\n`)
}
